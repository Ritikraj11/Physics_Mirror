/**
 * Production Rate Limiter Middleware for Authentication
 * Specification: 5 attempts per IP address, 30-minute block upon reaching limit.
 */

const attemptsMap = new Map();

// Window: 30 minutes in milliseconds
const BLOCK_WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;

/**
 * Extracts client IP safely behind reverse proxies (Render / Cloudflare / Vercel)
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

// Background cleanup every 10 minutes to keep memory usage minimal
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attemptsMap.entries()) {
    const isBlockExpired = record.blockedUntil && now >= record.blockedUntil;
    const isWindowExpired = now - record.firstAttemptTime > BLOCK_WINDOW_MS && !record.blockedUntil;
    if (isBlockExpired || isWindowExpired) {
      attemptsMap.delete(ip);
    }
  }
}, 10 * 60 * 1000).unref();

/**
 * Rate Limiter for Login Endpoint:
 * - Allows up to 5 attempts per IP.
 * - On 5th failed attempt or more, enforces a 30-minute block.
 * - Automatically resets on successful login.
 */
const loginRateLimiter = (req, res, next) => {
  const ip = getClientIp(req);
  const now = Date.now();

  let record = attemptsMap.get(ip);

  // If entry does not exist or window has expired without an active block
  if (!record || (now - record.firstAttemptTime > BLOCK_WINDOW_MS && (!record.blockedUntil || now >= record.blockedUntil))) {
    record = {
      attempts: 0,
      firstAttemptTime: now,
      blockedUntil: null,
    };
    attemptsMap.set(ip, record);
  }

  // 1. Check if currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    const remainingSeconds = Math.max(1, Math.ceil((record.blockedUntil - now) / 1000));
    const remainingMinutes = Math.max(1, Math.ceil(remainingSeconds / 60));

    res.set({
      'Retry-After': String(remainingSeconds),
      'X-RateLimit-Limit': String(MAX_ATTEMPTS),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': new Date(record.blockedUntil).toISOString(),
    });

    return res.status(429).json({
      success: false,
      message: `Too many login attempts from this IP address. Access has been blocked for 30 minutes for security reasons. Please try again in ${remainingMinutes} minute(s).`,
      retryAfterMinutes: remainingMinutes,
      retryAfterSeconds: remainingSeconds,
      blocked: true,
    });
  }

  // 2. Check if attempts already reached limit (in case blockedUntil was just reached or flood)
  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_WINDOW_MS;
    attemptsMap.set(ip, record);

    const remainingSeconds = Math.ceil(BLOCK_WINDOW_MS / 1000);
    res.set({
      'Retry-After': String(remainingSeconds),
      'X-RateLimit-Limit': String(MAX_ATTEMPTS),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': new Date(record.blockedUntil).toISOString(),
    });

    return res.status(429).json({
      success: false,
      message: `Too many login attempts from this IP address. Access has been blocked for 30 minutes for security reasons. Please try again after 30 minutes.`,
      retryAfterMinutes: 30,
      retryAfterSeconds: remainingSeconds,
      blocked: true,
    });
  }

  // 3. Count this attempt
  record.attempts += 1;
  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  attemptsMap.set(ip, record);

  res.set({
    'X-RateLimit-Limit': String(MAX_ATTEMPTS),
    'X-RateLimit-Remaining': String(remaining),
  });

  // Attach reset function to locals so login handler can call it on successful authentication
  res.locals.resetRateLimit = () => {
    attemptsMap.delete(ip);
  };

  // When response finishes: if authentication failed and we reached MAX_ATTEMPTS, trigger 30-min block
  res.on('finish', () => {
    if (res.statusCode >= 400 && res.statusCode < 500 && record.attempts >= MAX_ATTEMPTS) {
      record.blockedUntil = Date.now() + BLOCK_WINDOW_MS;
      attemptsMap.set(ip, record);
    }
  });

  next();
};

/**
 * General API Rate Limiter (Protects non-auth API endpoints against DDoS / scraping)
 * Limit: 300 requests per 15 minutes per IP
 */
const generalApiMap = new Map();
const GENERAL_WINDOW_MS = 15 * 60 * 1000;
const GENERAL_MAX_REQUESTS = 300;

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of generalApiMap.entries()) {
    if (now - record.startTime > GENERAL_WINDOW_MS) {
      generalApiMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

const generalApiRateLimiter = (req, res, next) => {
  const ip = getClientIp(req);
  const now = Date.now();

  let record = generalApiMap.get(ip);
  if (!record || now - record.startTime > GENERAL_WINDOW_MS) {
    record = { count: 0, startTime: now };
    generalApiMap.set(ip, record);
  }

  record.count += 1;
  if (record.count > GENERAL_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests from this IP address. Please slow down.',
    });
  }

  next();
};

module.exports = {
  loginRateLimiter,
  generalApiRateLimiter,
  getClientIp,
  // Exported for testing/verification
  _attemptsMap: attemptsMap,
};

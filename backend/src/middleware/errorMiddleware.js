/**
 * Master Error Handler Middleware
 * Guarantees polite, non-technical, user-friendly general error messages in all situations.
 */
const errorHandler = (err, req, res, next) => {
  // Always log full diagnostic message on the server
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Physics Mirror Error]:', err.stack || err);
  } else {
    console.error('[Physics Mirror Error]:', err.message || err);
  }

  let statusCode = err.statusCode || 500;
  let message = 'An unexpected error occurred. Please try again.';

  // 1. Mongoose Bad ObjectId / Cast to ObjectId failure
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid information or record identifier provided. Please check your selection and try again.';
    return res.status(statusCode).json({ success: false, message });
  }

  // 2. Mongoose Duplicate Key (Unique constraint violation)
  if (err.code === 11000) {
    statusCode = 400;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'record';
    const fieldLabels = {
      email: 'email address',
      studentId: 'Student ID',
      facultyId: 'Faculty ID',
      phone: 'phone number',
      code: 'code',
      name: 'name',
      receiptNo: 'receipt number',
    };
    const label = fieldLabels[field] || 'information';
    message = `An account or record with this ${label} already exists in the system. Please verify and use unique details.`;
    return res.status(statusCode).json({ success: false, message });
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    if (err.errors) {
      // Pick clean custom validation message if available and not a technical Mongoose string
      const cleanMessages = Object.values(err.errors)
        .map((e) => e.message)
        .filter((msg) => msg && !/cast to|validation failed|path `|bson/i.test(msg));

      if (cleanMessages.length > 0) {
        message = cleanMessages[0];
      } else {
        message = 'Please ensure all required fields are filled out correctly.';
      }
    } else {
      message = 'Please ensure all required fields are filled out correctly.';
    }
    return res.status(statusCode).json({ success: false, message });
  }

  // 4. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please sign in again to continue.';
    return res.status(statusCode).json({ success: false, message });
  }

  // 5. Explicit client errors (4xx) vs unexpected server errors (500)
  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    const rawMsg = err.message || '';
    const hasTechnicalKeywords = /mongo|bson|cast|sql|syntax|stack|null|undefined|jwt|at object|at module|require\(/i.test(rawMsg);
    if (!hasTechnicalKeywords && rawMsg.length > 0 && rawMsg.length < 150) {
      message = rawMsg;
    } else {
      message = 'Unable to complete this action. Please verify the entered information and try again.';
    }
  } else {
    statusCode = 500;
    message = 'An unexpected server error occurred while processing your request. Please try again or contact the administrator.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };


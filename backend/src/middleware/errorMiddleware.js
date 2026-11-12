const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error stack:', err.stack || err);
  } else {
    console.error('Error:', err.message || 'Unknown error');
  }

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const message = `Duplicate value entered for ${field} field`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = err.errors
      ? Object.values(err.errors).map((val) => val.message).join(', ')
      : err.message;
    return res.status(400).json({ success: false, message });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && isProd
      ? 'An unexpected error occurred. Please contact Physics Mirror support if this persists.'
      : (error.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};

module.exports = { errorHandler };


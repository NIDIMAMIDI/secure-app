export const errorHandler = (err, req, res, next) => {
  // console.error(err); // Logs error details for debugging

  res.status(err.statusCode || 500).json({
    status: err.statusCode < 500 ? "failure" : "error",
    message: err.message || "Something went wrong!",
  });
};

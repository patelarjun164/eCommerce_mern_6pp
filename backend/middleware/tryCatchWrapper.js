const tryCatchWrapper = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next); // Call the original function with arguments
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
    };
  };

module.exports = tryCatchWrapper;
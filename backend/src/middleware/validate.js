const ApiError = require('../utils/ApiError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      return next(new ApiError(400, message));
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;

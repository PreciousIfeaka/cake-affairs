const { ZodError } = require('zod');

const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const dataToValidate = req[source];
    const validated = schema.parse(dataToValidate);
    req[source] = validated;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    next(error);
  }
};

module.exports = validate;

const validateSchema = (schema, data) => {
  const { value, error } = schema.validate(data, {
    abortEarly: false, // Collect all errors
    allowUnknown: false, // Disallow unknown fields
  });

  return { value, error };
};

export default validateSchema;

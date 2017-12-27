const findOneOrThrowError = schema => {
  schema.post('findOne', (res, next) => {
    if (!res) {
      return next(new Error('not found!'));
    }
    return next();
  });
};

export { findOneOrThrowError };

const mongoose = require("mongoose");
const { CastError, ValidationError } = mongoose.Error;
const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_NOT_FOUND;
    this.name = NotFoundError;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_NOT_FOUND;
    this.name = BadRequestError;
  }
}


const handleErrors = (err, res) => {
  if (err instanceof NotFoundError) {
    return res.status(NOT_FOUND_ERROR).send(err.message);
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(BAD_REQUEST_ERROR).send(err.message);
  } else {
    return res.status(INTERNAL_SERVER_ERROR).send("Что-то пошло не так");
  }
};

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  BadRequestError,
  handleErrors,
};

const mongoose = require("mongoose");

const { CastError, ValidationError } = mongoose.Error;
const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND_ERROR;
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED_ERROR;
    this.name = "UnauthorizedError";
  }
}

const handleErrors = ({
  err,
  req,
  res,
  next,
}) => {
  if (err instanceof NotFoundError) {
    return res.status(NOT_FOUND_ERROR).send({ message: "Данные по переданному _id не найдены" });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Переданы некорректные данные" });
  }
  if (err instanceof UnauthorizedError) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Ошибка авторизации" });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "Что-то пошло не так" });
};

module.exports = {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  handleErrors,
};

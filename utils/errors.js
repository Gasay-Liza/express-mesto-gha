const mongoose = require("mongoose");

const { CastError, ValidationError } = mongoose.Error;
const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND_ERROR;
    this.name = "NotFoundError";
  }
}

const handleErrors = ({
  err,
  res,
  messageOfNotFound = "Данные по переданному _id не найдены",
  messageOfBadRequest = "Переданы некорректные данные",
}) => {
  if (err instanceof NotFoundError) {
    return res.status(NOT_FOUND_ERROR).send({ message: messageOfNotFound });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(BAD_REQUEST_ERROR).send({ message: messageOfBadRequest });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "Что-то пошло не так" });
};

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  handleErrors,
};

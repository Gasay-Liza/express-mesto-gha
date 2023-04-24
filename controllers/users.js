const User = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  handleErrors,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  // Возвращает всех пользователей
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.status === BAD_REQUEST_ERROR) {
        res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так" });
      }
    });
};

module.exports.getUser = (req, res) => {
  // Возвращает пользователя по _id
  User.findById(req.params.UserId)
    .orFail(() => {
      throw new NotFoundError("Пользователь по указанному _id не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Пользователь по указанному _id не найден",
      });
    });
};

module.exports.createUser = (req, res) => {
  // Создаёт пользователя
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Пользователь по указанному _id не найден",
        messageOfBadRequest:
          "Переданы некорректные данные при создании пользователя",
      });
    });
};

module.exports.updateUser = (req, res) => {
  // Обновляет профиль
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError("Пользователь с указанным _id не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Пользователь с указанным _id не найден",
        messageOfBadRequest:
          "Переданы некорректные данные при обновлении профиля",
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  // Обновляет аватар
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError("Пользователь с указанным _id не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Пользователь с указанным _id не найден",
        messageOfBadRequest:
          "Переданы некорректные данные при обновлении профиля",
      });
    });
};

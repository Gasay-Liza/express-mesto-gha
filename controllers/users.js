const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const {
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  handleErrors,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  // Возвращает всех пользователей
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Что-то пошло не так" });
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

module.exports.getUserMe = (req, res) => {
  // Возвращает пользователя по _id
  console.log("req", req);
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err)
      res
        .status(404)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  // Создаёт пользователя
  // if (!req.body) {
  //   res.status(400).send({ error: "Invalid request body" });
  //   return;
  // }
  const { name, about, avatar, email, password } = req.body;
  // if (!email || !password) {
  //   res.status(400).send({ error: "Email or password is required" });
  //   return;
  // }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        handleErrors({
          err,
          res,
          messageOfNotFound: "Пользователь по указанному _id не найден",
          messageOfBadRequest:
            "Переданы некорректные данные при создании пользователя",
        });
      });
  });
};

module.exports.login = (req, res) => {
  //Создаёт пользователя
  if (!req.body) {
    res.status(400).send({ error: "Invalid request body" });
    return;
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: "Email or password is required" });
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" },
      );
      // вернём токен
      res
        .cookie("jwt", token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      res.status(200).send({ message: "Login succesful" });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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

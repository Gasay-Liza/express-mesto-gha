const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  CONFLICT_ERROR,
  BAD_REQUEST_ERROR,
  NotFoundError,
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

module.exports.getUser = (req, res, next) => {
  // Возвращает пользователя по _id
  User.findById(req.params.UserId)
    .orFail(() => {
      throw new NotFoundError("Пользователь по указанному _id не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  // Возвращает пользователя по _id
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  // Создаёт пользователя
  if (!req.body) {
    res.status(BAD_REQUEST_ERROR).send({ error: "Invalid request body" });
    return;
  }
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ error: "Email or password is required" });
    return;
  }
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
        if (err.code === 11000) {
          res
            .status(CONFLICT_ERROR)
            .send({ message: "Пользователь с таким email уже существует" });
        }
        next(err);
      });
  });
};

module.exports.login = (req, res, next) => {
  // Создаёт пользователя
  if (!req.body) {
    res.status(BAD_REQUEST_ERROR).send({ error: "Invalid request body" });
    return;
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ error: "Email or password is required" });
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
      res.cookie("jwt", token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: "Login succesful" });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  // Обновляет профиль
  const id = req.user._id;
  const { name, about } = req.body;
  if (!req.body) {
    res.status(BAD_REQUEST_ERROR).send({ error: "Invalid request body" });
    return;
  }
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
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  // Обновляет аватар
  const id = req.user._id;
  if (!req.body) {
    res.status(BAD_REQUEST_ERROR).send({ error: "Invalid request body" });
    return;
  }
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
      next(err);
    });
};

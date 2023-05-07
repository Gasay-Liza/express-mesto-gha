const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserMe,
} = require("../controllers/users");
const { celebrate, Joi } = require('celebrate');

userRouter.get("/", getUsers); // Возвращает всех пользователей
userRouter.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser); // Обновляет профиль
userRouter.get("/me", getUserMe); // Возвращает тукущего пользователя
userRouter.get("/:UserId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser); // Возвращает пользователя по _id
userRouter.patch("/me/avatar", updateAvatar); // Обновляет аватар

module.exports = { userRouter };

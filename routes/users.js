const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

userRouter.get("/", getUsers); // Возвращает всех пользователей
userRouter.get("/:UserId", getUser); // Возвращает пользователя по _id
userRouter.patch("/me", updateUser); // Обновляет профиль
userRouter.patch("/me/avatar", updateAvatar); // Обновляет аватар

module.exports = { userRouter };

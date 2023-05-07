const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserMe,
} = require("../controllers/users");

userRouter.get("/", getUsers); // Возвращает всех пользователей
userRouter.patch("/me", updateUser); // Обновляет профиль
userRouter.get("/me", getUserMe); // Возвращает тукущего пользователя
userRouter.get("/:UserId", getUser); // Возвращает пользователя по _id
userRouter.patch("/me/avatar", updateAvatar); // Обновляет аватар

module.exports = { userRouter };

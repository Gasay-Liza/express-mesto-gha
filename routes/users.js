const userRouter = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

userRouter.get("/", getUsers); // Возвращает всех пользователей
userRouter.post("/", createUser); // Создаёт пользователя
userRouter.get("/:UserId", getUser); // Возвращает пользователя по _id
userRouter.patch("/me", updateUser); // Обновляет профиль
userRouter.patch("/me/avatar", updateAvatar); // Обновляет аватар

module.exports = { userRouter };

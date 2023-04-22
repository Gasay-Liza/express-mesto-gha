const userRouter = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers); // Возвращает всех пользователей
userRouter.post("/users", createUser); // Создаёт пользователя
userRouter.get("/users/:UserId", getUser); // Возвращает пользователя по _id
userRouter.patch("/users/me", updateUser); // Обновляет профиль
userRouter.patch("/users/avatar", updateAvatar); // Обновляет аватар

module.exports = userRouter;

const handleErrors = (err, res) => {};

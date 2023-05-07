const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { celebrate, Joi } = require("celebrate");
const { errors } = require('celebrate');
const { NotFoundError, handleErrors } = require("./utils/errors");

const app = express();

const { userRouter, cardRouter } = require("./routes/index");
const { NOT_FOUND_ERROR } = require("./utils/errors");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use("/users", auth, userRouter);
app.use("/cards", auth, cardRouter);

app.use("*", (req, res) => {
  throw new NotFoundError("Ошибка 404");
});
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

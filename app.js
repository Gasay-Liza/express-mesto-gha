const express = require("express");

const mongoose = require("mongoose");

const app = express();

const { userRouter, cardRouter } = require("./routes/index");
const {
  NOT_FOUND_ERROR,
} = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "6443c7fd31929ff7fe677697", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use("*", (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "ERROR 404" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

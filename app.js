const express = require("express");

const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "6443c7fd31929ff7fe677697", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

module.exports.createCard = (req) => {
  console.log(req.user._id); // _id станет доступен
};

app.use(userRouter);
app.use(cardRouter);

app.use("*", (req, res) => {
  res.status(404).send({ message: "ERROR 404" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

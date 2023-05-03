const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // name - это строка
      required: false,
      default: "Жак-Ив Кусто",
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
    about: {
      // информация о пользователе
      type: String,
      required: false,
      default: "Исследователь",
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      // ссылка на аватарку
      type: String,
      required: false,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("user", userSchema);

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String, // name - это строка
    required: true, // оно должно быть у каждой карточки, так что name — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { //  ссылка на картинку
    type: String,
    required: true,
  },
  owner: { // сылка на модель автора карточки
    type: ObjectId, // тип - id
    required: true,
  },
  likes: { // список лайкнувших пост пользователей
    type: ObjectId, // тип - id
    required: true,
    default: [], // по умолчанию — пустой массив
  },
  createdAt: { // дата создания
    type: Date, // тип - дата
    default: Date.now, // значение по умолчанию
  },
});


module.exports = mongoose.model('card', cardSchema);
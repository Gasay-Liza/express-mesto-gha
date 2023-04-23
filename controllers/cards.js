const Card = require("../models/card");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  handleErrors,
} = require("../utils/errors");

module.exports.getCards = (req, res) => {
  // Возвращает все карточки
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.status === BAD_REQUEST_ERROR) {
        res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так" });
      }
    });
};

module.exports.createCard = (req, res) => {
  // Создаёт карточку

  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfBadRequest:
          "Переданы некорректные данные при создании карточки",
      });
    });
};

module.exports.deleteCard = (req, res) => {
  // Удаляет карточку
  const cardId = req.params.cardId;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new NotFoundError("Карточка с указанным _id не найдена");
    })
    .then((card) => {
      console.log(card);
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors({ err, res });
    });
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: cardId } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Передан несуществующий _id карточки");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Передан несуществующий _id карточки",
        messageOfBadRequest: "Переданы некорректные данные для постановки лайка.",
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Переданы некорректные данные для снятия лайка");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      handleErrors({
        err,
        res,
        messageOfNotFound: "Передан несуществующий _id карточки",
        messageOfBadRequest: "Переданы некорректные данные для снятия лайка.",
      });
    });
};

const Card = require("../models/card");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
  BadRequestError,
  handleErrors,
} = require("../utils/errors");

module.exports.getCards = (req, res) => {
  // Возвращает все карточки
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      if (err.status === BadRequestError) {
        res.status(BadRequestError).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "Что-то пошло не так" });
      }
    });
};

module.exports.createCard = (req, res) => {
  // Создаёт карточку

  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: "Что-то пошло не так" });
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
      handleErrors(err, res);
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
      throw new NotFoundError(
        "Переданы некорректные данные для постановки лайка"
      );
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      handleErrors(err, res);
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
      handleErrors(err, res);
    });
};

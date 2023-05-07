const Card = require("../models/card");
const {
  BAD_REQUEST_ERROR,
  NotFoundError,
  ForbidenError,
} = require("../utils/errors");

module.exports.getCards = (req, res, next) => {
  // Возвращает все карточки
  Card.find({})
    .populate([["owner", "likes"]])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  // Создаёт карточку

  const { name, link } = req.body;

  if (!name || !link) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ error: "Переданы некорректные данные при создании карточки" });
    return;
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  // Удаляет карточку
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError("Карточка с указанным _id не найдена."))
    .then((data) => {
      if (!(req.user._id === data.owner.toString())) {
        throw new ForbidenError("Недостаточно прав для удаления карточки");
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError("Карточка с указанным _id не найдена");
        })
        .then((card) => {
          res.send({ data: card });
        })
        .catch((err) => {
          next(err);
        });
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Передан несуществующий _id карточки");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Переданы некорректные данные для снятия лайка");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

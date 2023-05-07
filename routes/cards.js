const cardRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRouter.get("/", getCards); // Возвращает все карточки
cardRouter.post("/", createCard); // Создаёт карточку
cardRouter.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), deleteCard); // Удаляет карточку
cardRouter.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), likeCard);
cardRouter.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = { cardRouter };

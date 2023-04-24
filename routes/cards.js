const cardRouter = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRouter.get("/", getCards); // Возвращает все карточки
cardRouter.post("/", createCard); // Создаёт карточку
cardRouter.delete("/:cardId", deleteCard); // Удаляет карточку
cardRouter.put("/:cardId/likes", likeCard);
cardRouter.delete("/:cardId/likes", dislikeCard);

module.exports = { cardRouter };

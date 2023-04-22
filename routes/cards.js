const cardRouter = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRouter.get("/cards", getCards); // Возвращает все карточки
cardRouter.post("/cards", createCard); // Создаёт карточку
cardRouter.delete("/cards/:cardId", deleteCard); // Удаляет карточку
cardRouter.put("/cards/:cardId/likes", likeCard);
cardRouter.delete("/cards/:cardId/likes", dislikeCard);

module.exports = cardRouter;

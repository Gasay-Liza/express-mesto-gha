/* eslint-disable import/no-extraneous-dependencies */
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

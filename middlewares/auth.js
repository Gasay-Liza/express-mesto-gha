const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const token = req.cookies.jwt;
  // убеждаемся, что он есть или начинается с Bearer
  if (!token) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }
  // извлечём токен

  let payload;

  try {
    // попытаемся верифицировать токен
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
    console.log(payload)
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

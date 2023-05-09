const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const handlerError = require('./middlewares/handlerError');

const app = express();

const { router } = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

router.use(errors());
router.use((err, req, res, next) => {
  handlerError({
    err,
    req,
    res,
    next,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

// const router = require('express').Router(); // создали роутер
// const Card = require('../models/card');

// router.get('/', (req, res) => {
//   Card.find({})
//     .then(films => res.send({ data: films }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });

// // сработает при POST-запросе на URL /films
// router.post('/', (req, res) => {
//   const { title, genre } = req.body;
//    Film.create({ title, genre})
//   /* напишите код здесь */
//     .then(film => res.send({ data: film }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });

// module.exports = router;
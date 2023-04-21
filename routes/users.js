const router = require('express').Router();
const { getUsers, createUser, getUser, id } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.post('/:id', getUser);

module.exports = router;
module.exports = router;
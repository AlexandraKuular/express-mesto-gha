const router = require('express').Router();
const {
  getUsers, getUser, addUser, setUser, setAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/user/:userId', getUser);
router.post('/users', addUser);
router.patch('/users/me', setUser);
router.patch('/users/me/avatar', setAvatar);

module.exports = router;

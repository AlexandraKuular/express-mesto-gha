const router = require('express').Router();
const {
  getUsers, getUser, setUser, setAvatar, getMe,
} = require('../controllers/users');
const { validationUserId, validationUserInfo, validationAvatar } = require('../middlewares/validations');

router.get('/users', getUsers);
router.get('/users/:userId', validationUserId, getUser);
router.patch('/users/me', validationUserInfo, setUser);
router.patch('/users/me/avatar', validationAvatar, setAvatar);
router.get('/users/me', getMe);

module.exports = router;

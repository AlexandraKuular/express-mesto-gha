const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCardId, validationCard } = require('../middlewares/validations');

router.get('/cards', getCards);
router.post('/cards', validationCard, createCard);
router.delete('/cards/:cardId', validationCardId, deleteCard);
router.put('/cards/:cardId/likes', validationCardId, likeCard);
router.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;

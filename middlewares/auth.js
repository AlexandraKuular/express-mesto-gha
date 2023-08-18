const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (req.url === '/signup') {
    next();
    return;
  }
  if (req.url === '/signin') {
    next();
    return;
  }
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация.');
  }
  req.user = payload;
  next();
};

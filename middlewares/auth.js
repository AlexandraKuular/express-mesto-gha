const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/unauthorized_error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // if (req.orginalUrl)
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UNAUTHORIZED_ERROR('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
    if (payload) {
      next();
    }
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UNAUTHORIZED_ERROR('Необходима авторизация'));
  }
  return payload;
};

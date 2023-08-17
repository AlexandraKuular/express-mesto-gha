class ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = ERROR_CODE;

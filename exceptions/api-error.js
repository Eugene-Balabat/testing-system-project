module.exports = class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован.')
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }

  static NotFound(message = null) {
    return new ApiError(404, message || 'Данные не найдены.')
  }

  static Conflict(message, errors = []) {
    return new ApiError(409, message, errors)
  }
}

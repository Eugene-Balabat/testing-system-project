export default class UserDto {
  constructor(model) {
    this.id = model._id
    this.email = model.email
  }
}

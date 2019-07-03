const { UserModel } = require('./../models');

class UserService {
  getUser(filter) {
    return UserModel.findOne(filter);
  }

  getAll() {
    return UserModel.find();
  }

  createUser({ data }) {
    const user = new UserModel(data);
    return user.save();
  }
}

module.exports = UserService;

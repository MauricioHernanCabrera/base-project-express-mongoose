const { UserModel } = require('./../models');

const getOne = filter => {
  return UserModel.findOne(filter);
};

const getAll = () => {
  return UserModel.find();
};

const createOne = ({ data }) => {
  const user = new UserModel(data);
  return user.save();
};

module.exports = {
  getOne,
  getAll,
  createOne
};

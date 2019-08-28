const { UserModel } = require('./../models');

const getOne = filter => UserModel.findOne(filter);

const getAll = () => UserModel.find();

const createOne = data => UserModel.create(data);

module.exports = {
  getOne,
  getAll,
  createOne
};

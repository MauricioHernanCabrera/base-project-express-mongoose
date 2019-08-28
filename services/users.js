const { UserModel } = require('./../models');
const bcrypt = require('bcrypt');

const getOne = (filter, select = ['email', '_id', 'isAdmin', 'isActive']) => {
  return UserModel.findOne(filter).select(select);
};

const getAll = () =>
  UserModel.find().select([
    'isAdmin',
    'isActive',
    '_id',
    'email',
    'createdAt',
    'updatedAt'
  ]);

const createOne = async ({ email, password }) => {
  return UserModel.create({
    email,
    password: await bcrypt.hash(password, 10)
  });
};

const updateOne = async (filter, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return UserModel.findOneAndUpdate(filter, data, {
    new: true
  });
};

const toggleActive = async (filter, data) => {
  return new Promise(async (resolve, reject) => {
    let user = await getOne(filter);

    if (!user) {
      reject(boom.notFound('¡No existe el usuario!'));
    }

    await UserModel.findOneAndUpdate(filter, {
      isActive: !user.isActive
    });

    resolve({ isActive: user.isActive });
  });
};

const toggleAdmin = async (filter, data) => {
  return new Promise(async (resolve, reject) => {
    let user = await getOne(filter);

    if (!user) {
      reject(boom.notFound('¡No existe el usuario!'));
    }

    await UserModel.findOneAndUpdate(filter, {
      isAdmin: !user.isAdmin
    });

    resolve({ isAdmin: user.isAdmin });
  });
};

module.exports = {
  getOne,
  getAll,
  createOne,
  updateOne,
  toggleActive,
  toggleAdmin
};

const { BaseModel } = require('../models');
const boom = require('@hapi/boom');

const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const createOne = data => BaseModel.create({ ...data, isVisible: true });

const deleteOne = ({ _id }) =>
  new Promise((resolve, reject) => {
    BaseModel.findOneAndUpdate(
      { _id, isDelete: false },
      { isDelete: true },
      {
        new: true,
        runValidators: true,
        context: 'query'
      },
      (err, doc) => {
        if (!doc)
          reject(
            boom.notFound(
              'No se encontro el recurso de contacto para eliminarlo'
            )
          );
        resolve(doc);
      }
    );
  });

const getOne = ({ _id }) =>
  BaseModel.findOne({
    _id
  }).orFail(boom.notFound('¡No se encontro el recurso de contacto!'));

const getAll = () => BaseModel.find({});

const updateOne = ({ _id }, data) =>
  new Promise((resolve, reject) => {
    BaseModel.findOneAndUpdate(
      { _id },
      data,
      {
        new: true,
        runValidators: true,
        context: 'query'
      },
      (err, doc) => {
        handleUniqueValidator(err, doc, error => {
          reject(boom.badRequest(error));
        });

        if (!doc)
          reject(
            boom.notFound(
              'No se encontro el recurso de contacto para actualizarlo'
            )
          );
        resolve(doc);
      }
    );
  });

module.exports = {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne
};

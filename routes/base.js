const express = require('express');
const router = express();

const {} = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');
const {} = require('./../utils/schemas/base');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const data = await BaseService.getAll();

      res.status(200).json({
        data,
        message: '¡Bases recuperados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  // validation(BaseSchema.createOne),
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const data = await BaseService.createOne(req.body);

      res.status(201).json({
        data,
        message: '¡Base creado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.getOne({ _id });

      res.status(200).json({
        data,
        message: '¡Base recuperado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  // validation(BaseSchema.updateOne),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.updateFavorite({ _id }, req.body);

      res.status(200).json({
        data,
        message: '¡Base actualizado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.deleteOne({ _id });

      res.status(200).json({
        data,
        message: '¡Base eliminado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

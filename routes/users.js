const express = require('express');
const router = express();

const validation = require('./../utils/middlewares/validationHandler');
const { UserService } = require('./../services');

const passport = require('passport');
require('./../utils/auth/strategies/admin');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const data = await UserService.getAll();

      res.status(200).json({
        data,
        message: '¡Usuarios recuperados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:_id/active',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { _id } = req.params;
      const data = await UserService.toggleActive({ _id });

      res.status(200).json({
        data,
        message: data.isActive ? '¡Usuario activado!' : '¡Usuario bloqueado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:_id/admin',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { _id } = req.params;
      const data = await UserService.toggleAdmin({ _id });

      res.status(200).json({
        data,
        message: data.isAdmin ? '¡Usuario admin!' : '¡Usuario normal!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

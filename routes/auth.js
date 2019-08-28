const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { config } = require('./../config');

// Basic strategy
require('./../utils/auth/strategies/basic');
// JWT
require('./../utils/auth/strategies/jwt');

router.post('/token', async (req, res, next) => {
  passport.authenticate('basic', (error, user) => {
    try {
      if (error || !user) {
        next(boom.unauthorized());
      }

      req.login(user, { session: false }, async error => {
        if (error) {
          next(error);
        }

        const { username: sub, email } = user;

        const payload = { sub, email };

        const access_token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '1d'
        });

        res.status(200).json({
          message: 'User Authenticated',
          data: { access_token }
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({ message: '¡The access token is valid!' });
  }
);

module.exports = router;

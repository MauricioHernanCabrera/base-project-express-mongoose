const express = require('express');
const router = express();
const nodemailer = require('nodemailer');

const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const { config } = require('./../config');
const { UserSchema, AuthSchema } = require('./../utils/schemas');
const { UserService } = require('./../services');
const validation = require('./../utils/middlewares/validationHandler');

// Basic strategy
require('./../utils/auth/strategies/basic');
// JWT
require('./../utils/auth/strategies/jwt');

router.get('/token', async (req, res, next) => {
  passport.authenticate('basic', (error, user) => {
    try {
      if (error || !user) {
        next(boom.unauthorized());
      }

      const { email, _id: sub } = user;
      const payload = {
        email,
        sub
      };

      req.login(user, { session: false }, async error => {
        if (error) {
          next(error);
        }

        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '30d'
        });

        res.status(200).json({
          message: 'User Authenticated',
          data: { token }
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

router.post(
  '/register',
  validation(UserSchema.createOne),
  async (req, res, next) => {
    try {
      await UserService.createOne(req.body);

      res.status(201).json({
        message: '¡Usuario registrado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/login', async (req, res, next) => {
  passport.authenticate('basic', (error, user = null) => {
    try {
      if (error && !user) {
        return next(
          boom.badRequest('¡Nombre de usuario o contraseña incorrecto!')
        );
      }

      return res.status(200).json({
        message: '¡Usuario obtenido!',
        data: {
          isAdmin: user.isAdmin,
          _id: user._id,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.post(
  '/forgot',
  validation(AuthSchema.forgot),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const userFound = await UserService.getOne({ email });

      const resetPasswordToken = require('crypto')
        .randomBytes(32)
        .toString('hex');
      const resetPasswordExpires = Date.now() + 3600000; // 1 hour

      const userUpdated = await UserService.updateOne(
        { _id: userFound._id },
        {
          resetPasswordToken,
          resetPasswordExpires
        }
      );

      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: config.nodemailEmail,
          pass: config.nodemailPassword
        }
      });

      var mailOptions = {
        to: email,
        from: config.nodemailEmail,
        subject: 'Apuntus reiniciar contraseña',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://api.timbre.devlights/auth/reset/' +
          resetPasswordToken +
          '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      await smtpTransport.sendMail(mailOptions);

      res.status(200).json({
        message: 'Te enviamos un mail para que recuperes tu contraseña'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/reset/:resetPasswordToken', async (req, res, next) => {
  try {
    const { resetPasswordToken } = req.params;
    const resetPasswordExpires = Date.now();

    const userFound = await UserService.getOne(
      {
        resetPasswordToken,
        resetPasswordExpires: { $gte: resetPasswordExpires }
      },
      ['email', 'username']
    );

    if (!userFound) {
      return next(boom.badRequest('Tu token expiro'));
    }

    res.status(200).json({
      data: userFound,
      message: 'Usuario recuperado'
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/reset/:resetPasswordToken',
  validation(AuthSchema.reset),
  async (req, res, next) => {
    try {
      const { resetPasswordToken } = req.params;
      const { password } = req.body;
      const resetPasswordExpires = Date.now();

      const userFound = await UserService.getOne(
        {
          resetPasswordToken,
          resetPasswordExpires: { $gte: resetPasswordExpires }
        },
        ['email']
      );

      if (!userFound) {
        return next(boom.badRequest('Tu token expiro'));
      }

      await UserService.updateOne(
        { _id: userFound._id },
        { password, resetPasswordExpires }
      );

      res.status(200).json({
        message: '¡Contraseña actualizada!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

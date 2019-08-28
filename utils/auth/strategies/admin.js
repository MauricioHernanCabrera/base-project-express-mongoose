const passport = require('passport');
const boom = require('@hapi/boom');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../../../config');
const { UserService } = require('./../../../services');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (tokenPayload, cb) => {
      try {
        const filter = { email: tokenPayload.email };

        const user = await UserService.getOne(filter, [
          'email',
          'password',
          '_id',
          'isAdmin'
        ]);

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        if (user.isAdmin) {
          return cb(
            boom.unauthorized('Necesitas ser admin para realizar esta accion'),
            false
          );
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

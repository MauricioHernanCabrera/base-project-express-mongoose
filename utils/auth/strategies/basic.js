const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { UserService } = require('./../../../services');

passport.use(
  new BasicStrategy(async function(username, password, cb) {
    const UserService = new UserService();

    try {
      const filter = {
        username
      };
      const user = await UserService.getUser(filter);
      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);

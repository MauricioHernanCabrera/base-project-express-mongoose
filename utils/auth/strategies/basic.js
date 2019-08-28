const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { UserService } = require('./../../../services');

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    try {
      const filter = { email };

      console.log(email, password);
      const user = await UserService.getOne(filter, [
        'email',
        'password',
        '_id',
        'isAdmin'
      ]);

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

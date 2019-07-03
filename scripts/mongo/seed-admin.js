const bcrypt = require('bcrypt');
const { config } = require('../../config');
const { UserService } = require('./../../services');
const chalk = require('chalk');
const mongoose = require('mongoose');
const UserService = new UserService();

function buildAdminUser(password) {
  return {
    password,
    username: config.authAdminUsername,
    email: config.authAdminEmail
  };
}

async function hasAdminUser() {
  const filter = {
    username: config.authAdminUsername
  };

  const adminUser = await UserService.getUser(filter);
  return adminUser && adminUser.username;
}

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10);
  const user = await UserService.createUser({
    data: buildAdminUser(hashedPassword)
  });
  return user._id;
}

async function initDb() {
  const MONGO_URI = `mongodb://${config.dbHost}/${config.dbName}`;
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  });
}

async function seedAdmin() {
  try {
    await initDb();

    if (await hasAdminUser()) {
      console.log(chalk.yellow('Admin user already exists'));
      return process.exit(1);
    }

    const adminUserId = await createAdminUser();
    console.log(chalk.green('Admin user created with id:', adminUserId));
    return process.exit(0);
  } catch (error) {
    console.log('Error');
    console.log(chalk.red(error));
    process.exit(1);
  }
}

seedAdmin();

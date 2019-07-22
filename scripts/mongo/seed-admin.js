const bcrypt = require('bcrypt');
const { config } = require('../../config');
const { UserService } = require('./../../services');
const chalk = require('chalk');
const { initDB } = require('./../../utils/db');

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

  const adminUser = await UserService.getOne(filter);
  return adminUser && adminUser.username;
}

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10);
  const user = await UserService.createOne({
    data: buildAdminUser(hashedPassword)
  });
  return user._id;
}

async function seedAdmin() {
  try {
    await initDB();

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

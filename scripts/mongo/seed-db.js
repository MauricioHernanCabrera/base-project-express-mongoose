const { initDB } = require('./../../utils/db');

(async function() {
  try {
    await initDB();
  } catch (error) {
    console.log(error);
  }
  return process.exit(0);
})();

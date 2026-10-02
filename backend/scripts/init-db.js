const { initializeTables } = require('../src/models/createTables');
const pool = require('../src/config/db');
const logger = require('../src/utils/logger');

async function run() {
  try {
    console.log('Initializing database tables on connected database...');
    await initializeTables();
    console.log('Tables reinitialized successfully!');
  } catch (error) {
    console.error('Error reinitializing database tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();

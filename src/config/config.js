const dotenv = require('dotenv');

let envFile;

if (process.env.NODE_ENV === 'test') {
  envFile = dotenv.config({ path: '.env.test' });
} else {
  envFile = dotenv.config();
}

if (!envFile) {
  throw new Error('.env not found');
}

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

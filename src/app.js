const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// Link relationships and connect DB
require('./db');

const routes = require('./routes');

const app = express();

app.use(bodyParser.json());

// Secure headers
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Open route endpoint for status
app.get('/status', (req, res) => {
  res.status(200).send();
});

// All routes behind v1
app.use('/v1/', routes);

// Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.errorMessage || 'Server Error';
  res.status(statusCode).json({ message });
});

module.exports = app;

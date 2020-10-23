/* eslint-disable func-names */
const fs = require('fs');

exports.writeFilePromise = async (location, data) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(location, data, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

exports.readFilePromise = async (location) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(location, function (err, data) {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

exports.deleteFilePromise = async (location) => {
  return new Promise(function (resolve, reject) {
    fs.unlink(location, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

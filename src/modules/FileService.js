const filesUtil = require('../util/files');

module.exports = () => {
  function writeFile(location, data) {
    return filesUtil.writeFilePromise(location, data);
  }

  function readFile(location) {
    return filesUtil.readFilePromise(location);
  }

  function deleteFile(location) {
    return filesUtil.deleteFilePromise(location);
  }

  return {
    writeFile,
    readFile,
    deleteFile,
  };
};

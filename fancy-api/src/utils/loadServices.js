const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../services');

/**
 * Loads all services into express server
 * @param {Object} app - Express application
 * @returns {Promise} - Resolves when all services are loaded
 */
module.exports = async (app) => {
  const files = await fs.promises.readdir(dir);
  console.log(`${files.length} services found!`);
  files.forEach((file) => {
    const { onLoad = () => {}, baseUrl = '/', router } = require(path.join(
      dir,
      file,
    ));

    app.use(baseUrl, router);
    onLoad();
  });
};

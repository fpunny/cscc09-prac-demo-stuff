const fs = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, '../services');

/**
 * Loads all services into express server
 * @param {Object} app - Express application
 * @returns {Promise} - Resolves when all services are loaded
 */
module.exports = async app => {
    const files = await fs.readdir(dir);
    console.log(`${files.length} services found!`);
    files.forEach(file => {
        const {
            onLoad = () => {},
            baseUrl = '/',
            router,
        } = require(path.join(dir, file));

        app.use(baseUrl, router);
        onLoad();
    });
}
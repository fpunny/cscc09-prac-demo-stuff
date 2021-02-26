const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.write(`This is the images get endpoint`);
  res.end();
})

module.exports = {
  baseUrl: '/images',
  onLoad: () => {
    console.log(`Images service has loaded!`);
  },
  router,
};

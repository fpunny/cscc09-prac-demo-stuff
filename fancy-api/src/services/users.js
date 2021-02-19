const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.write(`This is the users get endpoint`);
    res.end();
});

module.exports = {
    baseUrl: '/users',
    onLoad: () => {
        console.log(`Users service has loaded!`);
    },
    router,
};
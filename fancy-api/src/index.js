const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.write(`This is the root endpoint`);
  res.end();
});

const serviceLoader = require('./utils/loadServices');
serviceLoader(app).then(() => {
  app.listen(3000, () => {
    console.log(
      `Server is running on port 3000 (And all services are loaded!)`,
    );
  });
});

console.log(`Server is running... But haven't opened its port yet!`);

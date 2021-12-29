const express = require('express');
const getData = require('./repos/get');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors());
app.get('/:index', async (req, res) => {
  console.log('REQUEST GET');
  const key = req.params.index;
  console.log(key);
  res.json({
    value: await getData(key),
  });
});
app.get('/', (req, res) => {
  console.log('GET');
  res.json({
    status: 'OK',
    message: 'This is FriendBorHood Backend. you made a GET request.',
  });
});

const PORT_NUMBER = process.env.PORT || 8085;
const server = app.listen(PORT_NUMBER);
console.log(`the server has started on port: ${PORT_NUMBER} !`);
module.exports = server;

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors());

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

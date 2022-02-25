const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.get('/', (req, res) => {
  console.log('GET');

  res.json({
    message: 'Welcome to FriendBorHood API! 🐿️',
  });
});
app.use('/user', require('./user'));

const PORT_NUMBER = process.env.PORT || 3000;
app.listen(PORT_NUMBER);
console.log(`the server has started on port: ${PORT_NUMBER} !`);

const express = require('express');
const cors = require('cors');
const getUser = require('./repos/get');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://friendborhood.herokuapp.com',
}));
app.get('/', (req, res) => {
  console.log('GET');

  res.json({
    message: 'Welcome to FriendBorHood API! 🐿️',
  });
});

app.get('/users/:userId', async (req, res) => {
  console.log('try get user');
  const { userId } = req.params;
  console.log(`user id: ${userId}`);
  const user = await getUser(userId);
  if (!user) {
    res.status(404).send(`User with id ${userId} was not found.`);
    return;
  }
  res.json({
    data: user,
  });
});

const PORT_NUMBER = process.env.PORT || 3000;
app.listen(PORT_NUMBER);
console.log(`the server has started on port: ${PORT_NUMBER} `);

const express = require('express');
const cors = require('cors');
const getUser = require('./repos/get');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.get('/', (req, res) => {
  console.log('GET');

  res.json({
    status: 'OK',
    message: 'This is FriendBorHood Backend. you made a GET request.',
  });
});

app.get('/users/:userId', async (req, res) => {
  console.log('GET User By ID : ');
  const { userId } = req.params;
  console.log(userId);
  const user = await getUser(userId);
  console.log(user);
  res.json({
    status: 'OK',
    data: user,
  });
});

const PORT_NUMBER = process.env.PORT || 8085;
app.listen(PORT_NUMBER);
console.log(`the server has started on port: ${PORT_NUMBER} !`);

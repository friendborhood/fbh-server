const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());


let dataMap = new Map();
dataMap.set('omer','ahla');
dataMap.set('daniel','panda');
dataMap.set('arzi','manga');


// will be in use later
app.post('/endPoint', (req, res) => {
    console.log(req.body);
  dataMap.set(req.body.key,req.body.value);
  res.json({
    status: 'OK',
  });
});

app.get('/endPoint/:index', (req, res) => {
  console.log("REQUEST GET");
    const key = req.params.index;
    console.log(key);
  res.json({
    value:dataMap.get(key),
  });
});

app.get('/', (req, res) => {
    console.log('GET');
  res.json({
    status: 'OK',
    message: 'This is FriendBorHood Backend. you made a GET request.'
  });
});

  const PORT_NUMBER = process.env.PORT || 8085;
  const server = app.listen(PORT_NUMBER);
  console.log(`the server has started on port: ${PORT_NUMBER} !`);
module.exports = server;
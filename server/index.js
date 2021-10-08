const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let dataMap = new Map();
dataMap.set('omer',4);

app.post('/endPoint', (req, res) => {
    console.log(req.body);
  dataMap.set(req.body.key,req.body.value);
  res.json({
    status: 'OK',
  });
});

app.get('/endPoint', (req, res) => {
    //console.log(req);
  res.json({
    status:'200',
    value:dataMap.get(req.query.key),
  });
});

  const server = app.listen(3001);
  console.log('listeneing');
  
  

module.exports = server;
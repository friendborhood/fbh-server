const express = require('express');
const ngrok = require('ngrok');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const { mainModule } = require('process');
const { default: axios } = require('axios');
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
const main = () => {
  console.log('hi');
  //let i = 120;
  //while(i > 0){
  //axios.get('https://3e9d-206-189-30-76.ngrok.io/endPoint/omer');
  //i-=1;
  
}
  const PORT_NUMBER = 3001;
  const server = app.listen(PORT_NUMBER);
  const url = ngrok.connect({ port: PORT_NUMBER });
  console.log(url);
  console.log(`the server has started on port: ${PORT_NUMBER} !`);
  main(url);
module.exports = server;
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
const logger = require('../logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FriendBorHood API! 🐿️',
  });
});
app.use('/user', require('./user'));
app.use('/item', require('./item'));
app.use('/offer', require('./offer'));

const PORT_NUMBER = process.env.PORT || 3000;
app.listen(PORT_NUMBER);
logger.info(`the server has started on port: ${PORT_NUMBER} !`);

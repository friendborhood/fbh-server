import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import bodyParser from 'body-parser';
import swaggerDocument from '../../swagger.json';
import categories from './categories';
import logger from '../logger';
import { authMiddleware } from '../auth';
import user from './user';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json', limit: '50mb' }));
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
app.use('/categories', authMiddleware, categories);
app.use('/user', user);
app.use('/item', authMiddleware, require('./item'));
app.use(['/offer', '/offers'], authMiddleware, require('./offer'));

const PORT_NUMBER = process.env.PORT || 3000;
app.listen(PORT_NUMBER);
logger.info(`the server has started on port: ${PORT_NUMBER} !`);

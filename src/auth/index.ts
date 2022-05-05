import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../logger';

dotenv.config();

const PRIVATE_KEY = process.env.AUTH_ACCESS_SECRET_KEY;
const LOGIN_SECRET = process.env.API_KEY;
export const validateLoginAuth = (userApiKey, providedUserName) => {
  let authSuccess = false;
  try {
    const isVerified = jwt.verify(userApiKey, LOGIN_SECRET);
    if (!isVerified) {
      return false;
    }
    const { userName: decodedUserName } = jwt.decode(userApiKey);
    if (decodedUserName === providedUserName) {
      authSuccess = true;
    }
  } catch (e) {
    logger.error('error with verifying login ', e);
  }
  return authSuccess;
};
export const encodeToJwt = (dataToEncode) => jwt.sign(dataToEncode, PRIVATE_KEY);
const getTokenFromHeaders = (headers) => {
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    return headers.authorization.split(' ')[1];
  }
  return false;
};
export const authMiddleware = (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.status(401).send({ message: 'no token or invalid token provided' });
  }
  try {
    const verified = jwt.verify(token, PRIVATE_KEY);
    if (!verified) {
      return res.status(403).send({ message: 'bad token provided' });
    }
    const { userName } = jwt.decode(token);
    req.userName = userName;
  } catch (e) {
    logger.error(e);
    return res.status(403).send({ message: e.message });
  }

  return next();
};

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { findByName } from '../models/user';
import logger from '../logger';

dotenv.config();
const { GOOGLE_CLIENT_ID } = process.env;
const PRIVATE_KEY = process.env.AUTH_ACCESS_SECRET_KEY;
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
    const { userName } : any = jwt.decode(token);
    req.userName = userName;
    logger.info(`auth validated for user ${req.userName}`);
  } catch (e) {
    logger.error(e);
    return res.status(403).send({ message: e.message });
  }

  return next();
};
export const adminMiddleWare = async (req, res, next) => {
  const { userName } = req;
  logger.info(`validating that ${userName} is admin`);
  const { isAdmin } = await findByName(userName);
  if (!isAdmin) {
    logger.warn(`${userName} is not admin and tried to use admin method`);
    return res.status(403).send({ message: 'you dont have permissions to run this method' });
  }
  logger.info(`validated admin auth successfully for ${userName}`);
  return next();
};
const extractUserNameFromGmail = (gmail) => {
  const leftSideOfEmail = gmail.split('@')[0];
  const userNameAfterRemoveNonAlphaNum = leftSideOfEmail.replace(/[^a-z0-9]/gi, '');
  return userNameAfterRemoveNonAlphaNum;
};

export const verifyGoogle = async (token, providedUserName) => {
  let successAuth = false;
  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    const userNameFromToken = extractUserNameFromGmail(email);
    if (userNameFromToken === providedUserName) {
      logger.info('google auth success', userNameFromToken);
      successAuth = true;
    } else {
      logger.error('provided user name does not match google user name');
    }
  } catch (e) {
    logger.error(e.message);
  }
  return successAuth;
};

import jwt from 'jsonwebtoken';
import { getSecretKeyForUser } from '~/server/connectors/mongo';
import { getCookie } from 'h3';

const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE;

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token');
    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = jwt.decode(token) as { email: string; role: string };
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const uniqueSecretKey = await getSecretKeyForUser(decodedToken.email);
    if (!uniqueSecretKey) {
      throw new Error('Unauthorized');
    }

    jwt.verify(token as string, `${SECRET_KEY_BASE}${uniqueSecretKey}`);
    return {
      success: true,
      email: decodedToken.email,
      role: decodedToken.role ,
      token : decodedToken
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      message: 'Unauthorized'
    };
  }

  
});
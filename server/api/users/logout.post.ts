import { setCookie, readBody } from 'h3'; 
import { setSecretKeyForUser } from '~/server/connectors/mongo';
import jwt from 'jsonwebtoken';

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
      if (decodedToken.email) {
        await setSecretKeyForUser(decodedToken.email, '');
      }

      setCookie(event, 'auth_token', token, {
        maxAge: 0,
        path: '/',
        sameSite: 'none',
        secure: true
        }); 
        return {
            success: true,


        };
    } catch (error) {
      console.error('Error logging out:', error);
      return { message: 'Error logging out' };
    }
})
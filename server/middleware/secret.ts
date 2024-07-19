// Middleware that runs on every request to the backend

import jwt from 'jsonwebtoken';
import { getSecretKeyForUser } from '~/server/connectors/mongo';
import { getCookie } from 'h3';


const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE;
// const authorized_routes = [ //Might need to be used later
//   '/login',
//   '/',
// ]

export default defineEventHandler(async (event) => {
  try {
    
    const currentRoute = event.node.req.url;
    console.log('current route', { currentRoute })
    if (!currentRoute) {
      throw new Error('Route path is undefined');

    }
    // if (authorized_routes.includes(currentRoute)) {
    //   return;
    // }

    const token = getCookie(event, 'auth_token');
    if (! token )  {
      throw new Error('No token provided');
    }

    const decodedToken = jwt.decode(token) as { email: string; role: string };
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const uniqueSecretKey = await getSecretKeyForUser(decodedToken.email); // dans mongo.ts
    if (!uniqueSecretKey) {
      throw new Error('Unauthorized');
    }

    jwt.verify(token as string, `${SECRET_KEY_BASE}${uniqueSecretKey}`);

    event.context.user = { email: decodedToken.email, role: decodedToken.role };

  } catch (error) {
    console.error('Error verifying token:', error);
  }
});



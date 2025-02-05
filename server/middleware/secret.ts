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
    

    // Get the current route of the incoming request
    const currentRoute = event.node.req.url;
    console.log('current route', { currentRoute })

    // Check if the route is defined, if not, throw an error
    if (!currentRoute) {
      throw new Error('Route path is undefined');
    }

    // Optional logic to exclude certain routes from token verification (not used for the moment)
    // if (authorized_routes.includes(currentRoute)) {
    //   return;
    // }

    // Get the 'auth_token' cookie from the request
    const token = getCookie(event, 'auth_token');
    if (! token )  {
      throw new Error('No token provided');
    }

    // Decode the JWT token to extract the email and role of the current user    
    const decodedToken = jwt.decode(token) as { email: string; role: string };
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    // Fetch the unique secret key for the user from the database based on their email
    const uniqueSecretKey = await getSecretKeyForUser(decodedToken.email); // dans mongo.ts
    if (!uniqueSecretKey) {
      throw new Error('Unauthorized');
    }

    // Verify the JWT token to avoid tampering
    jwt.verify(token as string, `${SECRET_KEY_BASE}${uniqueSecretKey}`);

    // If everything is valid, add user information to the event context
    event.context.user = { email: decodedToken.email, role: decodedToken.role };

  } catch (error) {
    console.error('Error verifying token:', error);
  }
});



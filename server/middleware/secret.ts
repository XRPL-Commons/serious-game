// Middleware that runs on every request to the backend

import jwt from 'jsonwebtoken';
import { getSecretKeyForUser } from '~/server/connectors/mongo';
import { getCookie } from 'h3';
import { provide, ref } from 'vue'



const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE;
const authorized_routes = [
  '/api/users/login',
  '/api/classrooms/',
  '/api/users/verify',
  '/api/users/logout',
  '/login',
]

export default defineEventHandler(async (event) => {
  try {
    
    const currentRoute = event.node.req.url;
    console.log('current route', { currentRoute })
    if (!currentRoute) {
      throw new Error('Route path is undefined');

    }
    

    if (currentRoute === '/login' || currentRoute === '/') {
      
      return; // No need to check token for unprotected routes or login route
    }

    if (authorized_routes.includes(currentRoute)) {
      return;
    }

    const token = getCookie(event, 'auth_token');
    if (token === undefined )  {
      event.node.res.statusCode = 401;
      event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/; SameSite=None; Secure`);
      return { message: 'Unauthorized because token is now undefined' };
    }

      console.log('Mon token est ce qui suit :', { token })
      

    const decodedToken = jwt.decode(token) as { email: string; role: string };
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    console.log('Mon token decodé est ce qui suit :', { decodedToken })

    const uniqueSecretKey = await getSecretKeyForUser(decodedToken.email); // dans mongo.ts
    if (!uniqueSecretKey) {
      throw new Error('Unauthorized');
    }
    if (decodedToken.role === 'admin') {
      return;
    }

    jwt.verify(token as string, `${SECRET_KEY_BASE}${uniqueSecretKey}`);

    // Set the user object in the event context
    event.context.user = { email: decodedToken.email, role: decodedToken.role };

    console.log( 'Decoded token role is ' + `/${decodedToken.role}` )
    console.log( 'currentRoute is ' + currentRoute )


    // Blocking access to pages that require a higher role than the user's role and also blocks access to Api different from the login one 
    if (!currentRoute.startsWith(`/${decodedToken.role}`) && currentRoute !== '/api/users/login')  {                 
      event.node.res.statusCode = 403;
      //event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/; SameSite=None; Secure`); //Maybe too much 
      return { message: 'Forbidden because you have the wrong role hehe ' };
    }
    // provide('token', token)



  } catch (error) {
    console.error('Error verifying token:', error);
    event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/; SameSite=None; Secure`);
    return { message: 'Unauthorized' };
  }
});



// Use to verify if the user can access the /teacher/classroom URL


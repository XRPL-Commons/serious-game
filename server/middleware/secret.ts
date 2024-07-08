// Middleware that runs on every request to the backend

import jwt from 'jsonwebtoken';
import { getSecretKeyForUser } from '~/server/connectors/mongo';
import { getCookie } from 'h3';

const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE;
const authorized_routes = [
  '/api/users/login',
  '/login',
]

export default defineEventHandler(async (event) => {
  try {
    const currentRoute = event.node.req.url;
    if (!currentRoute) {
      throw new Error('Route path is undefined');
    }

    // const protectedRoutes = [
    //   /^\/admin\/.*$/,   // Matches all routes under /admin/
    //   /^\/teacher\/.*$/  // Matches all routes under /teacher/
    // ];
    // const isProtectedRoute = protectedRoutes.some(routeRegex => routeRegex.test(currentRoute));

    // if (!isProtectedRoute || currentRoute === '/login') {
    //   return; // No need to check token for unprotected routes or login route
    // }

    if (authorized_routes.includes(currentRoute)) {
      return;
    }

    const token = getCookie(event, 'auth_token');
    console.log("Mon token est :", { token });
    if (token === undefined) {
      event.node.res.statusCode = 401;
      event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/`);
      return { message: 'Unauthorized' };
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

    if (currentRoute.startsWith('/admin') && decodedToken.role !== 'admin') {
      event.node.res.statusCode = 403;
      event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/`);
      return { message: 'Forbidden' };
    }

    event.context.user = { email: decodedToken.email, role: decodedToken.role };

  } catch (error) {
    console.error('Error verifying token:', error);
    event.node.res.setHeader('Set-Cookie', `auth_token=; Max-Age=0; Path=/`);
    return { message: 'Unauthorized' };
  }
});



// Use to verify if the user can access the /teacher/classroom URL


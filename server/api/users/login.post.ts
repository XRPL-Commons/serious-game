import { LoginUser, setSecretKeyForUser } from '~/server/connectors/mongo';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { setCookie, readBody } from 'h3'; 

// Read the secret key base from the environment variables
const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE;

/**
 * API endpoint handler for user login.
 */

export default defineEventHandler(async (event) => {
  try {
    // Read the email and password from the body
    const { email, password } = await readBody(event);

    // Call the mongo function to authenticate the user
    const result = await LoginUser({ email, password });

    // If the user is authenticated, generate a unique secret key for the session
    if (result) {
      const secretKey = randomBytes(64).toString('hex');
      await setSecretKeyForUser(email, secretKey);

      // Generate a JWT token with the user's email and role, signed with the secret key and the secret key base
      const token = jwt.sign(
        { email, role: result.role },
        `${SECRET_KEY_BASE}${secretKey}`,
        { expiresIn: '1h' }
      );

      // Set the cookie with proper attributes
      setCookie(event, 'auth_token', token, { 
        maxAge: 3600, //1h cookie 
        httpOnly: true, 
        path: '/', 
        sameSite: 'none', 
        secure: true 
      });

      // Return success with user details
      const report = {
        success: true,
        role: result.role,
        email: result.email,
        name: result.name,
      };
      return report;

    } else {
      // if authentication fails
      return {
        success: false,
        message: 'Wrong username or password',
      };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
});

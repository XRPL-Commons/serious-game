# Serious Game Starter

Docs :
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
Nuxt UI : https://ui.nuxt.com/

## Setup

In the root of your project, create a file named .env. This file will contain the environment variables necessary for the application to function correctly.

Add environment variables:

In the .env file, add the following lines, replacing <your_mongo_uri> and <your_secret_key_base> with your respective values:

MONGO_URI=<your_mongo_uri>
SECRET_KEY_BASE=<your_secret_key_base>

'MONGO_URI': The connection URI to your MongoDB database. For example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority

SECRET_KEY_BASE: A base secret key used for generating and verifying JWT tokens. This key should be a complex and secure string to ensure the security of your tokens. You can generate a secure key using the following Python command:

```python

# Generating a secret key
import os
print(os.urandom(64).hex())``


# Now make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
````

## Running the app

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Structure of the project : 

.  // Root directory of the project
├── app.vue  // Main application component
├── components  // Directory containing reusable Vue components
│   ├── Admin  // Components related to the admin functionality
│   │   ├── AddUser.vue  // Component for adding a new user
│   │   └── Navbar.vue  // Navigation bar component for the admin section
│   ├── ColorMode.vue  // Component for managing color mode (dark/light theme)
│   ├── Student  // Components related to the student functionality
│   │   └── Navbar.vue  // Navigation bar component for the student section
│   └── Teacher  // Components related to the teacher functionality
│       ├── AddClassroom.vue  // Component for adding a new classroom
│       ├── AddStudent.vue  // Component for adding a new student
│       └── Navbar.vue  // Navigation bar component for the teacher section
├── layouts  // Directory for layout components that define the structure of various pages
│   ├── admin.vue  // Layout component for the admin section
│   ├── default.vue  // Default layout component for general pages
│   ├── student.vue  // Layout component for the student section
│   └── teacher.vue  // Layout component for the teacher section
├── nuxt.config.ts  // Configuration file for Nuxt.js
├── package.json  // Metadata file for the project, including dependencies and scripts
├── package-lock.json  // Lockfile for package management, ensuring consistent installs
├── pages  // Directory containing page components that map to routes
│   ├── 1test.vue  // Test page component
│   ├── 2test.vue  // Another test page component
│   ├── admin  // Directory for admin-related pages
│   │   └── index.vue  // Index page for the admin section
│   ├── index.vue  // Main index page of the application
│   ├── login.vue  // Login page component
│   ├── routes.vue  // Component for handling routes (possibly a routes overview page)
│   ├── student  // Directory for student-related pages
│   │   └── index.vue  // Index page for the student section
│   └── teacher  // Directory for teacher-related pages
│       ├── index.vue  // Index page for the teacher section
│       └── [name]  // Dynamic route directory for teacher-related pages
│           ├── config.vue  // Configuration page for a specific classroom
│           └── index.vue  // Index page for a specific classroom
├── README.md  // Readme file with information about the project
├── server  // Server-side code directory
│   ├── api  // API endpoints directory
│   │   ├── classrooms  // Endpoints related to classroom management
│   │   │   ├── index.delete.ts  // Endpoint for deleting classrooms
│   │   │   ├── index.get.ts  // Endpoint for fetching classrooms
│   │   │   ├── index.post.ts  // Endpoint for creating classrooms
│   │   │   ├── [name].delete.ts  // Endpoint for deleting a specific classroom
│   │   │   ├── [name].get.ts  // Endpoint for fetching a specific classroom
│   │   │   └── [name].post.ts  // Endpoint for updating a specific classroom
│   │   ├── jeu  // Endpoints related to the game functionality
│   │   │   ├── big-send-memo.post.ts  // Endpoint for sending a big memo
│   │   │   ├── index.post.ts  // Endpoint for creating a game instance
│   │   │   ├── index.put.ts  // Endpoint for updating a game instance
│   │   │   ├── oldest-transaction.put.ts  // Endpoint for updating the oldest transaction
│   │   │   ├── reset-game-stages.post.ts  // Endpoint for resetting game stages
│   │   │   ├── send-memo.post.ts  // Endpoint for sending a memo
│   │   │   ├── transactions  // Endpoints related to game transactions
│   │   │   │   └── [soluce_account].get.ts  // Endpoint for fetching transactions for a specific account
│   │   │   └── update-multiple-stages.put.ts  // Endpoint for updating multiple game stages
│   │   ├── test  // Test endpoints directory
│   │   │   ├── index.get.ts  // Endpoint for getting test data
│   │   │   ├── index.post.ts  // Endpoint for posting test data
│   │   │   └── transactions  // Endpoints related to test transactions
│   │   │       └── [soluce_account].ts  // Endpoint for test transactions of a specific account
│   │   ├── [...].ts  // Catch-all endpoint (wildcard route)
│   │   └── users  // Endpoints related to user management
│   │       ├── index.delete.ts  // Endpoint for deleting users
│   │       ├── index.get.ts  // Endpoint for fetching users
│   │       ├── index.post.ts  // Endpoint for creating users
│   │       ├── login.post.ts  // Endpoint for user login
│   │       ├── logout.post.ts  // Endpoint for user logout
│   │       └── verify.get.ts  // Endpoint for verifying user token
│   ├── client.ts  // Client-side initialization script
│   ├── connectors  // Directory for database connectors
│   │   └── mongo.ts  // MongoDB connector
│   ├── middleware  // Middleware functions for the server
│   │   ├── log.ts  // Middleware for logging requests
│   │   └── secret.ts  // Middleware for handling secrets
│   ├── plugins  // Server-side plugins
│   │   └── startup.ts  // Plugin for startup tasks
│   ├── tsconfig.json  // TypeScript configuration file for the server
│   └── utils.ts  // Utility functions for the server
├── tailwind.config.ts  // Configuration file for Tailwind CSS
├── ToDo.md  // Markdown file listing tasks to be done
├── tsconfig.json  // TypeScript configuration file for the project


Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# additional package dependencies

```sudo apt-get update
sudo apt-get install libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

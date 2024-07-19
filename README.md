# Serious Game Starter

Docs :
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

Nuxt UI : https://ui.nuxt.com/

# Setup

## 1) Clone the repository

```bash
git clone https://github.com/XRPL-Commons/serious-game.git
```

## 2) Now make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
````

## Generating a secret key

Here is how you can generate a secret key which will be later required , using a python compiler.
```python
import os
print(os.urandom(64).hex())
```

## Add environment variables:

In the root of your project, create a file named .env. This file will contain the environment variables necessary for the application to function correctly.

In the .env file, add the following lines, replacing <your_mongo_uri> and <your_secret_key_base> with your respective values:

```bash
MONGO_URI=<your_mongo_uri>
SECRET_KEY_BASE=<your_secret_key_base>
```

'MONGO_URI': The connection URI to your MongoDB database. For example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority

SECRET_KEY_BASE: A base secret key used for generating and verifying JWT tokens. This key should be a complex and secure string to ensure the security of your tokens. You can generate a secure key using the following 


## Running the app

Now that you are setup you can start the development server : o
1) Open your browser on `http://localhost:3000`
2) Type in a terminal at the root of the project the following command : 

```bash
# npm
npm run dev
OR
npm run luc

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

# API Endpoints

Classrooms

    GET /api/classrooms - Fetch all classrooms
    POST /api/classrooms - Create a new classroom
    DELETE /api/classrooms - Delete all classrooms
    GET /api/classrooms/:name - Fetch a specific classroom
    POST /api/classrooms/:name - Update a specific classroom
    DELETE /api/classrooms/:name - Delete a specific classroom

Game

    POST /api/jeu - Create a game instance
    PUT /api/jeu - Update a game instance
    PUT /api/jeu/oldest-transaction - Update the oldest transaction
    POST /api/jeu/reset-game-stages - Reset game stages
    POST /api/jeu/send-memo - Send a memo
    PUT /api/jeu/update-multiple-stages - Update multiple game stages
    GET /api/jeu/transactions/:soluce_account - Fetch transactions for a specific account

Test

    GET /api/test - Fetch test data
    POST /api/test - Post test data
    GET /api/test/transactions/:soluce_account - Fetch test transactions for a specific account

Users

    GET /api/users - Fetch all users
    POST /api/users - Create a new user
    DELETE /api/users - Delete all users
    POST /api/users/login - User login
    POST /api/users/logout - User logout
    GET /api/users/verify - Verify user token
    

# Structure of the project : 
Generated using : 
```bash
tree -I 'file1|file2|file3' > structure.txt
```
This command will ignore file1,file2,file3 and output the structure to structure.txt.

```javascript
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

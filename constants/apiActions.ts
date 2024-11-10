// ~/constants/apiActions.ts

// ApiAction interface for consistency across API actions
export interface Action {
    name: string;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    // Peut servir 
    // requiresAuth?: boolean
}

// Centralized object for all API actions
export const actions: Action[] = [
    // -----------------
    // Classrooms API
    // -----------------
    {
        name: 'getClassrooms',
        path: '/api/classrooms',
        method: 'GET',
    },
    {
        name: 'createClassroom',
        path: '/api/classrooms',
        method: 'POST',
    },
    {
        name: 'deleteClassroom',
        path: '/api/classrooms',
        method: 'DELETE',
    },
    {
        name: 'GetClassroomStudents',
        path: '/api/classrooms/:name',
        method: 'GET',
    },
    {
        name: 'addStudentToClassroom',
        path: '/api/classrooms/:name',
        method: 'POST', // Adds a student to a classroom
    },
    {
        name: 'removeStudentFromClassroom',
        path: '/api/classrooms/:name',
        method: 'DELETE', // Deletes a student from a classroom
    },

    // -----------------
    // Game API
    // -----------------
    {
        name: 'createGame',
        path: '/api/jeu',
        method: 'POST',
    },
    {
        name: 'updateGame',
        path: '/api/jeu',
        method: 'PUT',
    },
    {
        name: 'updateOldestTransaction',
        path: '/api/jeu/oldest-transaction',
        method: 'PUT',
    },
    {
        name: 'resetGameStages',
        path: '/api/jeu/reset-game-stages',
        method: 'POST',
    },
    {
        name: 'sendMemo',
        path: '/api/jeu/send-memo',
        method: 'POST',
    },
    {
        name: 'updateMultipleStages',
        path: '/api/jeu/update-multiple-stages',
        method: 'PUT',
    },
    {
        name: 'getTransactionsForAccount',
        path: '/api/jeu/transactions/:soluce_account',
        method: 'GET',
    },

    // -----------------
    // Test API
    // -----------------
    {
        name: 'getTestData',
        path: '/api/test',
        method: 'GET',
    },
    {
        name: 'postTestData',
        path: '/api/test',
        method: 'POST',
    },
    {
        name: 'getTestTransactionsForAccount',
        path: '/api/test/transactions/:soluce_account',
        method: 'GET',
    },

    // -----------------
    // Users API
    // -----------------
    {
        name: 'getUsers', // Get users based on the role
        path: '/api/users',
        method: 'GET',
    },
    {
        name: 'createUser',
        path: '/api/users',
        method: 'POST',
    },
    {
        name: 'deleteUser',
        path: '/api/users', // Suppression d'un utilisateur 
        method: 'DELETE',
    },
    {
        name: 'login',
        path: '/api/users/login',
        method: 'POST',
    },
    {
        name: 'logout',
        path: '/api/users/logout',
        method: 'POST',
    },
    {
        name: 'verify',
        path: '/api/users/verify',
        method: 'GET',
    },
];



export default actions;

export const callApi = async (actionName: string, body?: any) => {
    try {
      console.log(`Calling API for action: ${actionName}`); // Log the action name
      
      const action = actions.find(a => a.name === actionName);
      if (!action) throw new Error(`Action "${actionName}" not found`);
  
      console.log(`Found action:`, action); // Log the found action object
  
      const response = await fetch(action.path, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
  
      // Log the response
      console.log(`Response from API (${actionName}):`, response);
  
      if (!response.ok) {
        console.error(`API Error: ${response.statusText}`);
        throw new Error(`API Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log(`API result for ${actionName}:`, result);
  
      return result;
    } catch (error) {
      console.error(`Error with ${actionName}:`, error);
      throw error;
    }
  };
  
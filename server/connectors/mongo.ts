import { MongoClient, ObjectId } from 'mongodb'
// avoir une db albers pour que ça fonctionne.
const uri = process.env.MONGO_URI || ''
const client = new MongoClient(uri)
const defaultDB = 'serious-game'

export const DB = async () => {
  await client.connect()
  return client.db(defaultDB)
}
  // Retrieves the secret key for a user based on their email.
  export async function getSecretKeyForUser(email: string): Promise<string | null> {
  await client.connect()
  const Users = await GetCollection('users')
  const userSecret = await Users.findOne({ email });
  return userSecret ? userSecret.secretKey : null;
}

// Sets or updates the secret key for a user based on their email.
export async function setSecretKeyForUser(email: string, secretKey: string) {
  await client.connect() // En partant du principe que l'adresse mail est unique
  const Users = await GetCollection('users')
  await Users.updateOne(
    { email },
    { $set: { secretKey } },
    { upsert: true }
  );
}

export interface User {
  email: string;
  name: string;
  password: string;
  role: string;
  secretKey: string | null;
}

// Returns a MongoDB collection based on the given collection name.
export const GetCollection = async (collectionName: string) => {
  await client.connect()
  return client.db(defaultDB).collection(collectionName)
}

// Logs in a user by verifying their email and password.
export const LoginUser = async ({ email, password }: { email: string, password: string }) => {
  try {
    const Users = await GetCollection('users') //est-ce que l'user existe
    const result = await Users.findOne({ email, password })
    return result
  } catch (error) {
    console.error('Error login in User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

// Adds a new user to the 'users' collection after generating a slug for their name.
export const AddUser = async (userInfo: User) => {
  try {
    userInfo.name = generateSlug(userInfo.name)
    const Users = await GetCollection('users')
    const result = await Users.insertOne({ ...userInfo })
    return result
  } catch (error) {
    console.error('Error deleting User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

// Deletes a user from the 'users' collection by their email.
export const DeleteUser = async (email: string) => {
  try {
    const Users = await GetCollection('users')
    const result = await Users.deleteOne({ email })
    return result
  } catch (error) {
    console.error('Error deleting User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

// Lists all users with their name, email, and role from the 'users' collection.
export const ListUsers = async () => {
  try {
    const Users = await GetCollection('users')
    const result = await Users.find({}).project({ name:1, email: 1, role: 1 }).toArray()
    return result
  } catch (error) {
    console.error('Error listing User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

// Lists users based on the provided teacher's email
export const ListUsersTeacher = async (TeacherEmail: string) => { // a définir la logique 
  try {
    const Users = await GetCollection('users')
    const result = await Users.find({}).project({ name:1, email: 1, role: 1 }).toArray()
    return result
  } catch (error) {
    console.error('Error listing User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}
export const ListUsersStudent = async (studentEmail: string) => {
  try {
    const classroomsCollection = await GetCollection('classrooms');
    const classrooms = await classroomsCollection.find({}).toArray();

    for (const classroom of classrooms) {
      const students = classroom.students;
      const student = students.find((s) => s.email === studentEmail);

      if (student && student.account) {
        const result = {
          classroomName: classroom.classroomName,
          seed: student.account.seed, // Assuming student.account has seed and classicAddress
          classicAddress: student.account.classicAddress,
        };
        return result;
      }
    }
    return null; 
  } catch (error) {
    console.error('Error finding student:', error);
    throw error; // Rethrow or handle as needed
  }
};

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  createdAt: Date;
}

// Lists classrooms, optionally filtered by the teacher's email.
export const ListClassrooms = async (Mail?: string) => {
  try {
    const Classrooms = await GetCollection('classrooms'); // Obtient la collection 'classrooms'
    if (Mail) {
      const result = await Classrooms.find({ teacherMail: Mail }).toArray(); // Récupère toutes les classrooms avec certains champs projetés
      return result;
    }
    else {
    const result = await Classrooms.find().toArray(); // Récupère toutes les classrooms avec certains champs projetés
    return result;
    }

  } catch (error) {
    console.error('Error listing Classrooms:', error);
    throw error; // Rethrow ou handle as needed
  } finally {
    // await client.close(); // Considère quand fermer la connexion selon le cas d'utilisation de votre application
  }
};

// Retrieves the students from a specific classroom by its name.
export const GetClassroomStudents = async (Name: string) => {
  try {
    const Classrooms = await GetCollection('classrooms');
    const classroom = await Classrooms.findOne({ classroomName : Name });
    return classroom ? classroom.students : null;
  } catch (error) {
    console.error('Error fetching classroom students:', error);
    throw error;
  }
};

// Adds a student to a specific classroom.
export async function AddStudentToClassroom(classroomName: string, student: any) {
  const classrooms = await GetCollection('classrooms');

  try {
    student.name = generateSlug(student.name)
    const result = await classrooms.updateOne(
      { classroomName },
      { $push: { students: student } }
    );
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    throw error;
  }
}

// Removes a student from a classroom based on their email.
export async function DeleteUserFromClassroom(email: string) {
  const classrooms = await GetCollection('classrooms');

  try {
    const result = await classrooms.updateOne(
      { 'students.email': email },
      { $pull: { students: { email } } }
    );
  } catch (error) {
    console.error('Error deleting user from classroom:', error);
  }
}
export const generateSlug = (projectName: String) => {
  if (!projectName){
    return ''
  } 
  return projectName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Adds a new classroom to the 'classrooms' collection with a generated slug and current date.
export const AddClassroom = async (classroomInfo: Omit<Classroom, 'id' | 'createdAt'>) => {
  try {
    classroomInfo.classroomName = generateSlug(classroomInfo.classroomName)
    const Classrooms = await GetCollection('classrooms'); // Obtient la collection 'classrooms'
    const result = await Classrooms.insertOne({ 
      ...classroomInfo, 
      createdAt: new Date() // Ajoute la date de création actuelle
    });
    return result;
  } catch (error) {
    console.error('Error adding Classroom:', error);
    throw error; // Rethrow ou handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
};

// Deletes a classroom by its name from the 'classrooms' collection.
export const DeleteClassroom = async (name: string) => {
  try {
    const Classrooms = await GetCollection('classrooms')
    const result = await Classrooms.deleteOne({ classroomName: name }) 
    return result
  } catch (error) {
    console.error('Error deleting Classroom:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

// Updates a student's accounts (primary and solution accounts) in a classroom.
export const UpdateStudentAccounts = async (email: string, account: any, solution_account: any) => {
  const Classrooms = await GetCollection('classrooms');

  try {
    const result = await Classrooms.updateOne(
      { 'students.email': email },
      {
        $set: {
          'students.$.account': account,
          'students.$.solution_account': solution_account
        }
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error('Failed to update student accounts');
    }
  } catch (error) {
    console.error('Error updating student accounts:', error);
    throw error;
  }
};

// Updates a student's oldest transaction value in a classroom.
export const UpdateStudentOldestTransaction = async (email: string, oldestTransaction: number | null) => {
  const Classrooms = await GetCollection('classrooms');

  try {
    const result = await Classrooms.updateOne(
      { 'students.email': email },
      {
        $set: {
          'students.$.oldestTransaction': oldestTransaction
        }
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error('Failed to update student oldest transaction');
    }
  } catch (error) {
    console.error('Error updating student oldest transaction:', error);
    throw error;
  }
};

// Updates a student's game stages in a classroom.
export const UpdateStudentGameStages = async (email: string, gameStages: any[]) => {
  const Classrooms = await GetCollection('classrooms');
  await Classrooms.updateOne(
    { 'students.email': email },
    { $set: { 'students.$.gameStages': gameStages } },
    { upsert: true }
  );
};

// Resets a student's game stages in a classroom.
export const ResetStudentGameStages = async (email: string) => {
  const Classrooms = await GetCollection('classrooms');
  await Classrooms.updateOne(
    { 'students.email': email },
    {
      $unset: {
        'students.$.gameStages': ""
      }
    }
  );
};

// Resets all student's accounts in a classroom.
export const ResetStudentAccounts = async (Name: string) => {
  const Classrooms = await GetCollection('classrooms');
  const classroom = await Classrooms.findOne({ classroomName: Name });

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  for (const student of classroom.students) {
    try {
      await Classrooms.updateOne(
        { 'students.email': student.email },
        {
          $unset: {
            'students.$.account': "",
            'students.$.solution_account': "",
            'students.$.rank': "",
            'students.$.oldestTransaction': ""
          }
        }
      );
    } catch (error) {
      console.error(`Error resetting account for student ${student.email}:`, error);
    }
  }
};

// Updates ranks for all students in a classroom based on their oldest transaction values.
export const UpdateRanks = async (classroomName: string) => {
  try {
    // Get the classrooms collection
    const classroomsCollection = await GetCollection('classrooms');
    const classroom = await classroomsCollection.findOne({ classroomName });
    if (!classroom) {
      throw new Error('Classroom non trouvée');
    }

    // Sort students by oldest transaction value
    classroom.students.sort((a, b) => a.oldestTransaction - b.oldestTransaction);

    // Update ranks for each student
    classroom.students.forEach((student, index) => {
      student.rank = index + 1;
    });

    // Update the students in the database
    await classroomsCollection.updateOne(
      { classroomName },
      { $set: { students: classroom.students } }
    );
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw error;
  }
};


export default {
  AddUser,
  DB,
  DeleteUser,
  ListUsers,
  LoginUser,
  MongoClient,
  setSecretKeyForUser,
  GetClassroomStudents,
  AddStudentToClassroom,
  ListUsersTeacher,
  ListUsersStudent,
  ListClassrooms,
  AddClassroom,
  DeleteClassroom,
  ResetStudentGameStages,
  UpdateStudentAccounts,
  UpdateStudentOldestTransaction,
  UpdateStudentGameStages,
  UpdateRanks,
}
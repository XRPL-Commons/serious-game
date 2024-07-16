import { MongoClient, ObjectId } from 'mongodb'
// avoir une db albers pour que ça fonctionne.
const uri = process.env.MONGO_URI || ''
const client = new MongoClient(uri)
const defaultDB = 'serious-game'

export const DB = async () => {
  await client.connect()
  return client.db(defaultDB)
}
export async function getSecretKeyForUser(email: string): Promise<string | null> {
  await client.connect()
  const Users = await GetCollection('users')
  const userSecret = await Users.findOne({ email });
  return userSecret ? userSecret.secretKey : null;
}

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

export const GetCollection = async (collectionName: string) => {
  await client.connect()
  return client.db(defaultDB).collection(collectionName)
}

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

export const AddUser = async (userInfo: User) => {
  try {
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

export const ListUsers = async () => {
  try {
    const Users = await GetCollection('users')
    const result = await Users.find({}).project({ name:1, email: 1, role: 1 }).toArray()
    console.log('listed users:'+  result)
    return result
  } catch (error) {
    console.error('Error listing User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}

export const ListUsersTeacher = async (TeacherEmail: string) => { // a définir la logique 
  try {
    const Users = await GetCollection('users')
    const result = await Users.find({}).project({ name:1, email: 1, role: 1 }).toArray()
    console.log('listed users:'+  result)
    return result
  } catch (error) {
    console.error('Error listing User:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    // await client.close(); // Consider when to close the connection based on your app's use case
  }
}


export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  createdAt: Date;
}

export const ListClassrooms = async (Mail?: string) => {
  try {
    const Classrooms = await GetCollection('classrooms'); // Obtient la collection 'classrooms'
    if (Mail) {
      console.log("mail dans list classrooms", Mail)
      const result = await Classrooms.find({ teacherMail: Mail }).toArray(); // Récupère toutes les classrooms avec certains champs projetés
      console.log('listed classrooms:'+  result)
      return result;
    }
    else {
    const result = await Classrooms.find().toArray(); // Récupère toutes les classrooms avec certains champs projetés
    console.log('listed classrooms de admin:'+  result)
    return result;
    }

  } catch (error) {
    console.error('Error listing Classrooms:', error);
    throw error; // Rethrow ou handle as needed
  } finally {
    // await client.close(); // Considère quand fermer la connexion selon le cas d'utilisation de votre application
  }
};

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

export async function AddStudentToClassroom(classroomName: string, student: any) {
  const classrooms = await GetCollection('classrooms');

  try {
    const result = await classrooms.updateOne(
      { classroomName },
      { $push: { students: student } }
    );

    if (result.modifiedCount !== 1) {
      throw new Error('Failed to add student to classroom');
    }

    console.log(`Added student to classroom ${classroomName}`);
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    throw error;
  }
}

export async function DeleteUserFromClassroom(email: string) {
  const classrooms = await GetCollection('classrooms');

  try {
    const result = await classrooms.updateOne(
      { 'students.email': email },
      { $pull: { students: { email } } }
    );
    console.log(`Deleted user ${email} from classroom`);
  } catch (error) {
    console.error('Error deleting user from classroom:', error);
  }
}


export const AddClassroom = async (classroomInfo: Omit<Classroom, 'id' | 'createdAt'>) => {
  try {
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
  ListClassrooms,
  AddClassroom,
  DeleteClassroom
}
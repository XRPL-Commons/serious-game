import { ListClassrooms, Classroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  // if (event?.context?.user?.role !== 'admin') {
  //   // If the user is not an admin, return an unauthorized response
  //   event.node.res.statusCode = 403; // Forbidden
  //   return { message: 'Forbidden' };
  // }


// ICI VERIF POUR AFFICHER UNIQUELMENT MES CLASSROOMS OU TOUTES LES CLASSROOMS SI JE SUIS ADMIN


  console.log("Je suis dans /api/classrooms/index.get.ts", event.context)
  return ListClassrooms()
})
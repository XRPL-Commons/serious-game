import { AddClassroom, Classroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {

  const classroomInfo = await readBody(event) //ToDo : check input (name, email, password, role) is correct si jamais je fais un curl malicious sur le back je pex choisir le role ??

  return AddClassroom(classroomInfo) //ToDo : empecher que n'importe qui ajoute des users, donc il faut bloquer l'accès à l'url /admin/users, bloquer l'ajout d'admin...
})
import { AddUser, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  
  // Check si la personne a le role admin 
  if (!event.context.user || event.context.user.role !== 'admin') {
    event.node.res.statusCode = 403;
    return { message: 'Forbidden' };
  }
  const userInfo = await readBody(event) //ToDo : check input (name, email, password, role) is correct si jamais je fais un curl malicious sur le back je pex choisir le role ??

  return AddUser(userInfo) //ToDo : empecher que n'importe qui ajoute des users, donc il faut bloquer l'accès à l'url /admin/users, bloquer l'ajout d'admin...
})
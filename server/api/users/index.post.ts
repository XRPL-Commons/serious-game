import { AddUser, User } from '~/server/connectors/mongo'

/**
 * API endpoint handler to add a new user.
 */

export default defineEventHandler(async (event) => {

  const userInfo = await readBody(event) //ToDo : check input (name, email, password, role) is correct si jamais je fais un curl malicious sur le back je pex choisir le role ??

  return AddUser(userInfo) //ToDo : empecher que n'importe qui ajoute des users, donc il faut bloquer l'accès à l'url /admin/users, bloquer l'ajout d'admin...
})
import { GetCollection, AddUser } from "../connectors/mongo"

// Define the default admin user
const defaultAdmin = {
  name: 'Luc Bocahut',
  email: 'luc@xrpl-commons.org',
  password: 'SeriousGameAdmin',
}

// @ts-ignore
export default defineNitroPlugin(async (nitroApp) => {
  console.log('running startup...')
  // create admin user if he doesnt exist

  const Users = await GetCollection('users')
  const adminInfo = await Users.findOne({ email: defaultAdmin.email })
  if (!adminInfo) {
    // create admin user
    const result = await AddUser({
      ...defaultAdmin,
      role: 'admin',
      secretKey: null})
  }

})
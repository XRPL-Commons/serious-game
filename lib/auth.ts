// User roles:
//    - reader (no credentials)
//    - contributor (can propose new projects and edits to existing projects)
//       x owner (can edit a specific project)
//    - admin (can approve changes from contributors)

interface userIntoType {
  role: String
}

export const useAuth = (userInfo: userIntoType) => {
  console.log({ userInfo })
  if (!userInfo) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized!' })
  }
  return {
    isReader: true,
    isContributor: userInfo.role === 'contributor' || userInfo.role === 'admin',
    isAdmin: userInfo.role === 'admin'
  }
} 
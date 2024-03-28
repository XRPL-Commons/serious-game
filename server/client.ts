// this is meant to be imported on the client to interact with the server api
// all client side functions will be defined here

const actions = [
  {
    name: 'checkSecret',
    path: '/api/secret',
    method: 'POST'
  },
  {
    name: 'createNFT',
    path: '/api/art/create',
    method: 'POST',
    secretRequired: true
  },
  {
    name: 'listCollection',
    path: '/api/art',
    method: 'GET',
    secretRequired: true
  }
]

const api: any = {}
actions.forEach(action => {
  api[action.name] = async (props: any) => {
    const result = await fetch(action.path, {
      method: action.method,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(props)
    })
    return result.json()
  }
})
export default api
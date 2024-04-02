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
  },
  {
    name: 'createAlbers',
    path: '/api/art',
    method: 'POST',
    secretRequired: true
  }
]

type Headers = {
  [key: string]: string;
}

const api: any = {}
actions.forEach(action => {
  api[action.name] = async (props: any) => {
    const headers: Headers = {
      'content-type': 'application/json'
    }
    const secret = localStorage.getItem('mag_secret')

    if (action.secretRequired) {
      if (!secret) {
        throw new Error('secret is required')
      }
      headers['x-secret'] = secret
    }
    const result = await fetch(action.path, {
      method: action.method,
      headers,
      body: JSON.stringify(props)
    })
    return result.json()
  }
})
export default api
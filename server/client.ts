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

    let url = action.path;
    let body = undefined;
    let queryString = '';
    if (action.method === 'GET' && props && Object.keys(props).length) {
      // Ensure values are converted to strings to satisfy encodeURIComponent's expected parameter types
      queryString = Object.entries(props).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`).join('&');
      url = `${url}?${queryString}`;
    } else if (action.method !== 'GET') {
      body = JSON.stringify(props);
    }

    const result = await fetch(url, {
      method: action.method,
      headers,
      ...(body ? { body } : {})
    });
    return result.json();
  }
})
export default api
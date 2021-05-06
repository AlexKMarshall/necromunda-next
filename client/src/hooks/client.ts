type ClientOptions<ReqBody> = RequestInit & {
  data?: ReqBody
}

const API_BASE_URL = 'http://localhost:3000/'

export function client<ReqBody>(
  endpoint: string,
  { data, headers: customHeaders, ...options }: ClientOptions<ReqBody> = {}
) {
  const headers: ClientOptions<ReqBody>['headers'] = {}
  if (data) {
    headers['content-type'] = 'application/json'
  }

  const fetchOptions = {
    method: data ? 'POST' : 'GET',
    body: data && JSON.stringify(data),
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...options,
  }

  return fetch(`${API_BASE_URL}${endpoint}`, fetchOptions)
}

import { apiBaseUrl } from 'config'

type ClientOptions<ReqBody> = RequestInit & {
  data?: ReqBody
}

export async function client<ReqBody>(
  endpoint: string,
  { data, headers: customHeaders, ...options }: ClientOptions<ReqBody> = {}
): Promise<unknown> {
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

  
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, fetchOptions)
    const responseData = await response.json()
    if (!response.ok) {
      const error = new HTTPClientError(response.status, data)
      error.status = response.status
      error.body = data
      throw error
    }
    return responseData
  } 

class HTTPClientError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super()
    this.status = status;
    this.body = body;
  }
}

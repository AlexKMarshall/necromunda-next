import { apiBaseUrl } from 'config'

type ClientOptions<ReqBody> = RequestInit & {
  data?: ReqBody
}

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

  return fetch(`${apiBaseUrl}/${endpoint}`, fetchOptions)
}

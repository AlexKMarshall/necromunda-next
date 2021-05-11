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

  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, fetchOptions)
    const data = await response.json()
    if (!response.ok) {
      const error: CustomError = new Error()
      error.status = response.status
      error.body = data
      throw error
    }
    return data
  } catch (e) {
    throw e
  }
}

interface CustomError extends Error {
  [key: string]: any
}

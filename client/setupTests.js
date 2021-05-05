import '@testing-library/jest-dom/extend-expect'
import { server } from './src/test/mocks/server'

process.env.DEBUG_PRINT_LIMIT = 1500

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})

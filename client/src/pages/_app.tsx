import { AppProps } from 'next/app'
import Link from 'next/link'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Reset as ResetStyles, Global as GlobalStyles } from 'styles'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../test/mocks')
}

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/admin">
              <a>Admin</a>
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
      <ResetStyles />
      <GlobalStyles />
    </QueryClientProvider>
  )
}

export default App

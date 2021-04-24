import "../styles/globals.css";
import { AppProps } from "next/app";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../test/mocks");
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
    </>
  );
}

export default App;

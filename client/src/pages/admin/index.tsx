import Link from 'next/link'

export default function Admin() {
  return (
    <>
      <h1>Admin</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/factions">
              <a>Factions</a>
            </Link>
            <Link href="/admin/fighter-categories">
              <a>Fighter Categories</a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

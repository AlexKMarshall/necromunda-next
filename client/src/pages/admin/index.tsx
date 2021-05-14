import Link from 'next/link'

export default function Admin(): JSX.Element {
  return (
    <>
      <h1>Admin</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/factions">
              <a>Factions</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/fighter-categories">
              <a>Fighter Categories</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/fighter-types">
              <a>Fighter Types</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/traits">
              <a>Traits</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/skill-types">
              <a>Skill Types</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/skills">
              <a>Skills</a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

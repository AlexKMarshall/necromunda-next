import { Column, useTable } from 'react-table'
import styled from 'styled-components'

interface DataTableProps<T extends {}> {
  columns: Column<T>[]
  data: T[]
}

export function DataTable<T extends {}>({ columns, data }: DataTableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <Wrapper {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} data-testid="table-body">
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
              ))}
            </Tr>
          )
        })}
      </tbody>
    </Wrapper>
  )
}

export const Wrapper = styled.table`
  border-collapse: collapse;
  border-spacing: unset;
  border-color: var(--blue-grey-500);
  border: 1px solid;

  & td + td,
  th + th {
    border-left: 1px solid;
  }
`

export const Td = styled.td`
  padding: var(--s-3);
`
export const Th = styled.th`
  padding: var(--s-3);
`

export const Tr = styled.tr`
  &:nth-child(odd) {
    background-color: var(--blue-grey-900);
    color: var(--blue-grey-50);
    border-color: var(--blue-grey-50);
  }
`

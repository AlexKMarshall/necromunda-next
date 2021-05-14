import { Column, useTable } from 'react-table'
import styled from 'styled-components'
import { AnyObject } from 'types'

interface DataTableProps<T extends AnyObject> {
  columns: Column<T>[]
  data: T[]
}

export function DataTable<T extends AnyObject>({
  columns,
  data,
}: DataTableProps<T>): JSX.Element {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <Wrapper {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          // key is coming from prop getter
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // key is coming from prop getter
              // eslint-disable-next-line react/jsx-key
              <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} data-testid="table-body">
        {rows.map((row) => {
          prepareRow(row)
          return (
            // key is coming from prop getter
            // eslint-disable-next-line react/jsx-key
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                // key is coming from prop getter
                // eslint-disable-next-line react/jsx-key
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

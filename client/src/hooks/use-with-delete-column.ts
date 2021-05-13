import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { DeletableItem } from 'types'

interface RenderDeleteButtonProps {
  id: string
  name: string
  key: string
}

interface UseWithDeleteColumnProps<T extends DeletableItem> {
  columns: Column<T>[]
  renderDeleteButton: (props: RenderDeleteButtonProps) => JSX.Element
}

export function useWithDeleteColumn<T extends DeletableItem>({
  columns,
  renderDeleteButton,
}: UseWithDeleteColumnProps<T>): Column<T>[] {
  return useMemo(
    () => [
      ...columns,
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<T> }) =>
          renderDeleteButton({
            id: original.id,
            name: original.name,
            key: original.id,
          }),
      },
    ],
    [columns]
  )
}

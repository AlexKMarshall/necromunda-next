import { useCallback, useMemo } from 'react'
import { UseMutationResult } from 'react-query'
import { Column, Row } from 'react-table'
import { DeletableItem } from 'types'
import { DeleteButton } from 'components/lib'

interface UseWithDeleteColumnProps<T extends DeletableItem> {
  columns: Column<T>[]
  deleteHook: (id: string) => UseMutationResult<unknown, unknown, void, unknown>
  DeleteButtonComponent: typeof DeleteButton
}

export function useWithDeleteColumn<T extends DeletableItem>({
  columns,
  deleteHook,
  DeleteButtonComponent,
}: UseWithDeleteColumnProps<T>): Column<T>[] {
  return useMemo(
    () => [
      ...columns,
      {
        Header: 'Actions',
        accessor: 'id' as const,
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }: { row: Row<T> }) => {
          const mutation = deleteHook(original.id)
          const { getButtonProps } = useDeleteButton({
            onDeleteClick: mutation.mutate,
            label: `Delete ${original.name}`,
            id: original.id,
          })

          return <DeleteButtonComponent {...getButtonProps()} />
        },
      },
    ],
    [DeleteButtonComponent, columns, deleteHook]
  )
}

type UseDeleteButtonProps = {
  onDeleteClick: () => unknown
  label: string
  id: string
}

function useDeleteButton({ onDeleteClick, label, id }: UseDeleteButtonProps) {
  const getButtonProps = useCallback(
    () => ({
      'aria-label': label,
      onClick: onDeleteClick,
      key: id,
    }),
    [id, label, onDeleteClick]
  )

  return { getButtonProps }
}

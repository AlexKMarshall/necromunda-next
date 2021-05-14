import { UseMutationResult } from 'react-query'
import { Column } from 'react-table'
import { DeleteButton, DataTable } from 'components/lib'
import { useWithDeleteColumn } from 'hooks/use-with-delete-column'
import { DeletableItem } from 'types'

type AdminTableProps<T extends DeletableItem> = {
  columns: Column<T>[]
  data: T[]
  deleteHook: (id: string) => UseMutationResult<unknown, unknown, void, unknown>
}

export function AdminTable<T extends DeletableItem>({
  columns,
  data,
  deleteHook,
}: AdminTableProps<T>): JSX.Element {
  const augmentedColumns = useWithDeleteColumn({
    columns,
    deleteHook,
    DeleteButtonComponent: DeleteButton,
  })

  return <DataTable columns={augmentedColumns} data={data} />
}

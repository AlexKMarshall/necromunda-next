import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, useTable } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateTraitDto, createTraitDtoSchema, Trait } from 'schemas'
import { useQueryTraits, useCreateTrait, useDeleteTrait } from 'hooks/traits'
import { H1, H2, Stack } from 'components/lib'
import { Input, Table, Td, Th, Tr } from 'styles/admin'

export default function Traits() {
  const query = useQueryTraits()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<Trait> }) => (
          <DeleteTraitButton
            traitId={original.id}
            traitName={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: query.traits })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Traits</H1>
      <button onClick={openForm}>Add Trait</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Trait</H2>
          <AddTraitForm onSubmit={closeForm} />
        </Stack>
      </Dialog>
      <Table {...getTableProps()}>
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
      </Table>
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteTraitButtonProps {
  traitId: Trait['id']
  traitName: Trait['name']
}

function DeleteTraitButton({ traitId, traitName }: DeleteTraitButtonProps) {
  const mutation = useDeleteTrait(traitId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {traitName}
    </button>
  )
}

interface AddTraitFormProps {
  onSubmit?: () => void
}

function AddTraitForm({ onSubmit }: AddTraitFormProps) {
  const mutation = useCreateTrait()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTraitDto>({
    resolver: zodResolver(createTraitDtoSchema),
  })
  const nameId = useId()
  const nameErrorId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((trait) => {
        mutation.mutate(trait)
        onSubmit?.()
      })}
    >
      <Stack variant="small">
        <label htmlFor={nameId}>Name:</label>
        <Input
          id={nameId}
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={!!errors.name ? nameErrorId : ''}
        />
        {!!errors.name && (
          <span role="alert" id={nameErrorId}>
            {errors.name.message}
          </span>
        )}
      </Stack>
      <button type="submit">Add trait</button>
    </Stack>
  )
}

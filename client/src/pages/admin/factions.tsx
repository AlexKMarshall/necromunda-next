import { useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, useTable } from 'react-table'
import styled from 'styled-components'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateFactionDto, createFactionDtoSchema, Faction } from 'schemas'
import { useQueryFactions } from 'hooks/factions'
import { H1, H2, Stack } from 'components/lib'
import { Input, Table, Td, Th, Tr } from 'styles/admin'

function useCreateFaction() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      return fetch('http://localhost:3000/factions', {
        method: 'POST',
        body: JSON.stringify(faction),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factions')
      },
    }
  )
  return mutation
}

function useDeleteFaction(factionId: Faction['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return fetch(`http://localhost:3000/factions/${factionId}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factions')
      },
    }
  )
  return mutation
}

export default function Factions() {
  const query = useQueryFactions()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<Faction> }) => (
          <DeleteFactionButton
            factionId={original.id}
            factionName={original.name}
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
  } = useTable({ columns, data: query.factions })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Factions</H1>
      <button onClick={openForm}>Add Faction</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Faction</H2>
          <AddFactionForm onSubmit={closeForm} />
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
        <tbody {...getTableBodyProps()}>
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
    </Stack>
  )
}

interface DeleteFactionButtonProps {
  factionId: Faction['id']
  factionName: Faction['name']
}

function DeleteFactionButton({
  factionId,
  factionName,
}: DeleteFactionButtonProps) {
  const mutation = useDeleteFaction(factionId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {factionName}
    </button>
  )
}

interface AddFactionFormProps {
  onSubmit?: () => void
}

function AddFactionForm({ onSubmit }: AddFactionFormProps) {
  const mutation = useCreateFaction()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFactionDto>({
    resolver: zodResolver(createFactionDtoSchema),
  })
  const nameId = useId()
  const nameErrorId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
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
      <button type="submit">Add faction</button>
    </Stack>
  )
}

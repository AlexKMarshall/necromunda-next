import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import { useId } from 'react-aria'
import {
  CreateFactionDto,
  createFactionDtoSchema,
  factionSchema,
} from 'schemas'
import { H1, Stack } from 'components/lib'

function useQueryFactions() {
  const query = useQuery('factions', async () => {
    const response = await fetch('/factions')
    const data = await response.json()
    return factionSchema.array().parse(data)
  })

  const factions = query.data ?? []
  return { ...query, factions }
}

function useCreateFaction() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      return fetch('/factions', {
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

export default function Factions() {
  const query = useQueryFactions()
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

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      { Header: 'Id', accessor: 'id' as const },
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

  return (
    <Stack>
      <H1>Factions</H1>
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
      <Stack
        as="form"
        onSubmit={handleSubmit((faction) => mutation.mutate(faction))}
      >
        <Stack variant="small">
          <label htmlFor={nameId}>Name</label>
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
    </Stack>
  )
}

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: unset;
  border-color: var(--blue-grey-500);
  border: 1px solid;

  & td + td,
  th + th {
    border-left: 1px solid;
  }
`

const Td = styled.td`
  padding: var(--s-3);
`
const Th = styled.th`
  padding: var(--s-3);
`

const Tr = styled.tr`
  &:nth-child(odd) {
    background-color: var(--blue-grey-900);
    color: var(--blue-grey-50);
    border-color: var(--blue-grey-50);
  }
`

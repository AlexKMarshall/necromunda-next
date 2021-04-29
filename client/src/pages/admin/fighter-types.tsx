import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, useTable, Column } from 'react-table'
import styled from 'styled-components'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFighterTypeDto,
  createFighterTypeDtoSchema,
  FighterStats,
  FighterType,
  fighterTypeSchema,
} from 'schemas'
import { H1, H2, Stack } from 'components/lib'
import { useQueryFactions } from 'hooks/factions'
import { useQueryFighterCategories } from 'hooks/fighter-categories'

const QUERY_KEY_FIGHTER_TYPES = 'fighterTypes'

function useQueryFighterTypes() {
  const query = useQuery(QUERY_KEY_FIGHTER_TYPES, async () => {
    const response = await fetch('http://localhost:3000/fighter-types')
    const data = await response.json()
    return fighterTypeSchema.array().parse(data)
  })

  const fighterTypes = query.data ?? []
  return { ...query, fighterTypes }
}

function useCreateFighterType() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (fighterType: CreateFighterTypeDto) => {
      return fetch('http://localhost:3000/fighter-types', {
        method: 'POST',
        body: JSON.stringify(fighterType),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_FIGHTER_TYPES)
      },
    }
  )
  return mutation
}

function useDeleteFighterType(fighterTypeId: FighterType['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return fetch(
        `http://localhost:3000/fighter-categories/${fighterTypeId}`,
        {
          method: 'DELETE',
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_FIGHTER_TYPES)
      },
    }
  )
  return mutation
}

export default function FighterTypes() {
  const query = useQueryFighterTypes()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  type FighterTypeColumn = Column<typeof query.fighterTypes[number]>
  const columns = useMemo<FighterTypeColumn[]>(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      { Header: 'Cost', accessor: 'cost' as const },
      { Header: 'Faction', accessor: (row) => row.faction.name },
      {
        Header: 'Fighter Category',
        accessor: (row) => row.fighterCategory.name,
      },
      { Header: 'M', accessor: ({ fighterStats }) => fighterStats.movement },
      {
        Header: 'WS',
        accessor: ({ fighterStats }) => fighterStats.weaponSkill,
      },
      {
        Header: 'BS',
        accessor: ({ fighterStats }) => fighterStats.ballisticSkill,
      },
      { Header: 'S', accessor: ({ fighterStats }) => fighterStats.strength },
      { Header: 'T', accessor: ({ fighterStats }) => fighterStats.toughness },
      { Header: 'W', accessor: ({ fighterStats }) => fighterStats.wounds },
      { Header: 'I', accessor: ({ fighterStats }) => fighterStats.initiative },
      { Header: 'A', accessor: ({ fighterStats }) => fighterStats.attacks },
      { Header: 'LD', accessor: ({ fighterStats }) => fighterStats.initiative },
      { Header: 'CL', accessor: ({ fighterStats }) => fighterStats.cool },
      { Header: 'WIL', accessor: ({ fighterStats }) => fighterStats.will },
      {
        Header: 'INT',
        accessor: ({ fighterStats }) => fighterStats.intelligence,
      },

      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<FighterType> }) => (
          <DeleteFighterTypeButton
            fighterTypeId={original.id}
            fighterTypeName={original.name}
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
  } = useTable({ columns, data: query.fighterTypes })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Fighter Types</H1>
      <button onClick={openForm}>Add Fighter Type</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Fighter Type</H2>
          <AddFighterTypeForm onSubmit={closeForm} />
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

interface DeleteFighterTypeButtonProps {
  fighterTypeId: FighterType['id']
  fighterTypeName: FighterType['name']
}

function DeleteFighterTypeButton({
  fighterTypeId,
  fighterTypeName,
}: DeleteFighterTypeButtonProps) {
  const mutation = useDeleteFighterType(fighterTypeId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {fighterTypeName}
    </button>
  )
}

const blankFighterStats = {
  id: '',
  movement: 0,
  weaponSkill: 0,
  ballisticSkill: 0,
  strength: 0,
  toughness: 0,
  wounds: 0,
  initiative: 0,
  attacks: 0,
  leadership: 0,
  cool: 0,
  will: 0,
  intelligence: 0,
}
const placeholderFighterStatsArray = [blankFighterStats]

interface AddFighterTypeFormProps {
  onSubmit?: () => void
}

function AddFighterTypeForm({ onSubmit }: AddFighterTypeFormProps) {
  const mutation = useCreateFighterType()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateFighterTypeDto>({
    resolver: zodResolver(createFighterTypeDtoSchema),
  })

  const nameFieldId = useId()
  const nameErrorFieldId = useId()
  const costFieldId = useId()
  const costErrorFieldId = useId()
  const { factions } = useQueryFactions()
  const factionFieldId = useId()
  const factionErrorFieldId = useId()
  const { fighterCategories } = useQueryFighterCategories()
  const fighterCategoryFieldId = useId()
  const fighterCategoryErrorFieldId = useId()

  const columns = useMemo<Column<FighterStats>[]>(
    () => [
      {
        Header: 'M',
        accessor: 'movement',
        Cell: () => (
          <input
            {...register('fighterStats.movement', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'WS',
        accessor: 'weaponSkill',
        Cell: () => (
          <input
            {...register('fighterStats.weaponSkill', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'BS',
        accessor: 'ballisticSkill',
        Cell: () => (
          <input
            {...register('fighterStats.ballisticSkill', {
              valueAsNumber: true,
            })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'S',
        accessor: 'strength',
        Cell: () => (
          <input
            {...register('fighterStats.strength', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'T',
        accessor: 'toughness',
        Cell: () => (
          <input
            {...register('fighterStats.toughness', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'W',
        accessor: 'wounds',
        Cell: () => (
          <input
            {...register('fighterStats.wounds', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'I',
        accessor: 'initiative',
        Cell: () => (
          <input
            {...register('fighterStats.initiative', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'A',
        accessor: 'attacks',
        Cell: () => (
          <input
            {...register('fighterStats.attacks', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'LD',
        accessor: 'leadership',
        Cell: () => (
          <input
            {...register('fighterStats.leadership', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'CL',
        accessor: 'cool',
        Cell: () => (
          <input
            {...register('fighterStats.cool', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'WIL',
        accessor: 'will',
        Cell: () => (
          <input
            {...register('fighterStats.will', { valueAsNumber: true })}
            style={{ width: '2rem' }}
          />
        ),
      },
      {
        Header: 'INT',
        accessor: 'intelligence',
        Cell: () => (
          <input
            {...register('fighterStats.intelligence', { valueAsNumber: true })}
            style={{ width: '2rem' }}
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
  } = useTable({ columns, data: placeholderFighterStatsArray })

  return (
    <Stack
      as="form"
      onSubmit={(e: any) => {
        const watchAll = watch()
        console.log(watchAll)
        console.log(errors)
        handleSubmit((fighterType) => {
          mutation.mutate(fighterType)
          onSubmit?.()
        })(e)
      }}
    >
      <Stack variant="small">
        <label htmlFor={nameFieldId}>Name:</label>
        <Input
          id={nameFieldId}
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={!!errors.name ? nameErrorFieldId : ''}
        />
        {!!errors.name && (
          <span role="alert" id={nameErrorFieldId}>
            {errors.name.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={costFieldId}>Cost:</label>
        <Input
          id={costFieldId}
          {...register('cost', { valueAsNumber: true })}
          aria-invalid={!!errors.cost}
          aria-describedby={!!errors.cost ? costErrorFieldId : ''}
        />
        {!!errors.cost && (
          <span role="alert" id={costErrorFieldId}>
            {errors.cost.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={factionFieldId}>Faction:</label>
        <select
          id={factionFieldId}
          {...register('faction.id')}
          aria-invalid={!!errors.faction?.id}
          aria-describedby={!!errors.faction?.id ? factionErrorFieldId : ''}
        >
          <option value="">Please select</option>
          {factions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {!!errors.faction?.id && (
          <span role="alert" id={factionErrorFieldId}>
            {errors.faction.id.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={fighterCategoryFieldId}>Fighter Category:</label>
        <select
          id={fighterCategoryFieldId}
          {...register('fighterCategory.id')}
          aria-invalid={!!errors.fighterCategory?.id}
          aria-describedby={
            !!errors.fighterCategory?.id ? fighterCategoryErrorFieldId : ''
          }
        >
          <option value="">Please select</option>
          {fighterCategories.map((fc) => (
            <option key={fc.id} value={fc.id}>
              {fc.name}
            </option>
          ))}
        </select>
        {!!errors.fighterCategory?.id && (
          <span role="alert" id={fighterCategoryErrorFieldId}>
            {errors.fighterCategory.id.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </Th>
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

      <button type="submit">Add fighter type</button>
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
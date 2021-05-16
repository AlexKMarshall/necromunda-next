/* eslint-disable react/display-name */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'
import {
  CreateFighterTypeDto,
  createFighterTypeDtoSchema,
  FighterType,
} from 'schemas'
import {
  DataTable,
  H1,
  H2,
  SelectField,
  Stack,
  TextField,
} from 'components/lib'
import { useQueryFactions } from 'hooks/factions'
import { useQueryFighterCategories } from 'hooks/fighter-categories'
import {
  useQueryFighterTypes,
  useDeleteFighterType,
  useCreateFighterType,
} from 'hooks/fighter-types'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'
import { useMemo } from 'react'
import { useId } from '@react-aria/utils'

const fighterTypeColumns: Column<FighterType>[] = [
  { Header: 'Name', accessor: 'name' as const },
  { Header: 'Cost', accessor: 'cost' as const },
  { Header: 'Faction', accessor: (row) => row.faction.name },
  {
    Header: 'Fighter Category',
    accessor: (row) => row.fighterCategory.name,
  },
  {
    Header: <span aria-label="Movement">M</span>,
    id: 'm',
    accessor: ({ fighterStats }) => fighterStats.movement,
  },
  {
    Header: <span aria-label="Weapon skill">WS</span>,
    id: 'ws',
    accessor: ({ fighterStats }) => fighterStats.weaponSkill,
  },
  {
    Header: <span aria-label="Ballistic skill">BS</span>,
    id: 'bs',
    accessor: ({ fighterStats }) => fighterStats.ballisticSkill,
  },
  {
    Header: <span aria-label="strength">S</span>,
    id: 's',
    accessor: ({ fighterStats }) => fighterStats.strength,
  },
  {
    Header: <span aria-label="toughness">T</span>,
    id: 't',
    accessor: ({ fighterStats }) => fighterStats.toughness,
  },
  {
    Header: <span aria-label="wounds">W</span>,
    id: 'w',
    accessor: ({ fighterStats }) => fighterStats.wounds,
  },
  {
    Header: <span aria-label="initiative">I</span>,
    id: 'i',
    accessor: ({ fighterStats }) => fighterStats.initiative,
  },
  {
    Header: <span aria-label="attacks">A</span>,
    id: 'a',
    accessor: ({ fighterStats }) => fighterStats.attacks,
  },
  {
    Header: <span aria-label="leadership">LD</span>,
    id: 'ld',
    accessor: ({ fighterStats }) => fighterStats.leadership,
  },
  {
    Header: <span aria-label="cool">CL</span>,
    id: 'cl',
    accessor: ({ fighterStats }) => fighterStats.cool,
  },
  {
    Header: <span aria-label="will">WIL</span>,
    id: 'wil',
    accessor: ({ fighterStats }) => fighterStats.will,
  },
  {
    Header: <span aria-label="intelligence">INT</span>,
    id: 'int',
    accessor: ({ fighterStats }) => fighterStats.intelligence,
  },
]

export default function FighterTypes(): JSX.Element {
  const query = useQueryFighterTypes()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  return (
    <Stack>
      <H1>Fighter Types</H1>
      <button onClick={openModal}>Add Fighter Type</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Fighter Type</H2>
          <AddFighterTypeForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <AdminTable
        columns={fighterTypeColumns}
        data={query.fighterTypes}
        deleteHook={useDeleteFighterType}
      />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}
interface AddFighterTypeFormProps {
  onSubmit?: () => void
}

function AddFighterTypeForm({ onSubmit }: AddFighterTypeFormProps) {
  const mutation = useCreateFighterType()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFighterTypeDto>({
    resolver: zodResolver(createFighterTypeDtoSchema),
  })

  const queryFactions = useQueryFactions()
  const queryCategories = useQueryFighterCategories()

  const mId = useId()
  const wsId = useId()
  const bsId = useId()
  const sId = useId()
  const tId = useId()
  const wId = useId()
  const iId = useId()
  const aId = useId()
  const ldId = useId()
  const clId = useId()
  const wilId = useId()
  const intId = useId()

  const statsColumns = useMemo(
    () => [
      {
        Header: (
          <div id={mId}>
            <span aria-hidden>M</span>
            <VisuallyHidden>Movement</VisuallyHidden>
          </div>
        ),
        id: 'm',
        accessor: 'movement' as const,
        Cell: () => (
          <input
            {...register('fighterStats.movement', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={mId}
          />
        ),
      },
      {
        Header: (
          <div id={wsId}>
            <span aria-hidden>WS</span>
            <VisuallyHidden>Weapon Skill</VisuallyHidden>
          </div>
        ),
        accessor: 'weaponSkill' as const,
        id: 'ws',
        Cell: () => (
          <input
            {...register('fighterStats.weaponSkill', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={wsId}
          />
        ),
      },
      {
        Header: (
          <div id={bsId}>
            <span aria-hidden>BS</span>
            <VisuallyHidden>Ballistic Skill</VisuallyHidden>
          </div>
        ),
        id: 'bs',
        accessor: 'ballisticSkill' as const,
        Cell: () => (
          <input
            {...register('fighterStats.ballisticSkill', {
              valueAsNumber: true,
            })}
            style={{ width: '2rem' }}
            aria-labelledby={bsId}
          />
        ),
      },
      {
        Header: (
          <div id={sId}>
            <span aria-hidden>S</span>
            <VisuallyHidden>Strength</VisuallyHidden>
          </div>
        ),
        id: 's',
        accessor: 'strength' as const,
        Cell: () => (
          <input
            {...register('fighterStats.strength', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={sId}
          />
        ),
      },
      {
        Header: (
          <div id={tId}>
            <span aria-hidden>T</span>
            <VisuallyHidden>Toughness</VisuallyHidden>
          </div>
        ),
        id: 't',
        accessor: 'toughness' as const,
        Cell: () => (
          <input
            {...register('fighterStats.toughness', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={tId}
          />
        ),
      },
      {
        Header: (
          <div id={wId}>
            <span aria-hidden>W</span>
            <VisuallyHidden>Wounds</VisuallyHidden>
          </div>
        ),
        id: 'w',
        accessor: 'wounds' as const,
        Cell: () => (
          <input
            {...register('fighterStats.wounds', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={wId}
          />
        ),
      },
      {
        Header: (
          <div id={iId}>
            <span aria-hidden>I</span>
            <VisuallyHidden>Initiative</VisuallyHidden>
          </div>
        ),
        id: 'i',
        accessor: 'initiative' as const,
        Cell: () => (
          <input
            {...register('fighterStats.initiative', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={iId}
          />
        ),
      },
      {
        Header: (
          <div id={aId}>
            <span aria-hidden>A</span>
            <VisuallyHidden>Attacks</VisuallyHidden>
          </div>
        ),
        id: 'a',
        accessor: 'attacks' as const,
        Cell: () => (
          <input
            {...register('fighterStats.attacks', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={aId}
          />
        ),
      },
      {
        Header: (
          <div id={ldId}>
            <span aria-hidden>LD</span>
            <VisuallyHidden>Leadership</VisuallyHidden>
          </div>
        ),
        id: 'ld',
        accessor: 'leadership' as const,
        Cell: () => (
          <input
            {...register('fighterStats.leadership', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={ldId}
          />
        ),
      },
      {
        Header: (
          <div id={clId}>
            <span aria-hidden>CL</span>
            <VisuallyHidden>Cool</VisuallyHidden>
          </div>
        ),
        id: 'cl',
        accessor: 'cool' as const,
        Cell: () => (
          <input
            {...register('fighterStats.cool', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={clId}
          />
        ),
      },
      {
        Header: (
          <div id={wilId}>
            <span aria-hidden>WIL</span>
            <VisuallyHidden>Will</VisuallyHidden>
          </div>
        ),
        id: 'wil',
        accessor: 'will' as const,
        Cell: () => (
          <input
            {...register('fighterStats.will', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={wilId}
          />
        ),
      },
      {
        Header: (
          <div id={intId}>
            <span aria-hidden>INT</span>
            <VisuallyHidden>Intelligence</VisuallyHidden>
          </div>
        ),
        id: 'int',
        accessor: 'intelligence' as const,
        Cell: () => (
          <input
            {...register('fighterStats.intelligence', { valueAsNumber: true })}
            style={{ width: '2rem' }}
            aria-labelledby={intId}
          />
        ),
      },
    ],
    [
      aId,
      bsId,
      clId,
      iId,
      intId,
      ldId,
      mId,
      register,
      sId,
      tId,
      wId,
      wilId,
      wsId,
    ]
  )

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((fighterType) => {
        mutation.mutate(fighterType)
        onSubmit?.()
      })}
    >
      <TextField
        label="Name:"
        hasError={!!errors.name}
        errorMessage={errors.name?.message}
        inputProps={register('name')}
      />
      <TextField
        label="Cost:"
        hasError={!!errors.name}
        errorMessage={errors.name?.message}
        inputProps={register('cost', { valueAsNumber: true })}
      />
      <SelectField
        label="Faction:"
        selectProps={register('faction.id')}
        hasError={!!errors.faction?.id}
        errorMessage={errors.faction?.id?.message}
        isLoading={queryFactions.isLoading}
        options={queryFactions.factions.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      />
      <SelectField
        label="Category:"
        selectProps={register('fighterCategory.id')}
        hasError={!!errors.fighterCategory?.id}
        errorMessage={errors.fighterCategory?.id?.message}
        isLoading={queryCategories.isLoading}
        options={queryCategories.fighterCategories.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      />
      <Stack variant="small">
        <DataTable columns={statsColumns} data={placeholderFighterStatsArray} />
      </Stack>
      <button type="submit">Add fighter type</button>
    </Stack>
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

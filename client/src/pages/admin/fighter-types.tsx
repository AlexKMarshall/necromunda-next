import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFighterTypeDto,
  createFighterTypeDtoSchema,
  FighterType,
} from 'schemas'
import { H1, H2, SelectField, Stack, TextField } from 'components/lib'
import { useQueryFactions } from 'hooks/factions'
import { useQueryFighterCategories } from 'hooks/fighter-categories'
import {
  useQueryFighterTypes,
  useDeleteFighterType,
  useCreateFighterType,
} from 'hooks/fighter-types'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'

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
      <TextField
        label="Movement:"
        hasError={!!errors.fighterStats?.movement}
        errorMessage={errors.fighterStats?.movement?.message}
        inputProps={register('fighterStats.movement', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Weapon Skill:"
        hasError={!!errors.fighterStats?.weaponSkill}
        errorMessage={errors.fighterStats?.weaponSkill?.message}
        inputProps={register('fighterStats.weaponSkill', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Ballistic Skill:"
        hasError={!!errors.fighterStats?.ballisticSkill}
        errorMessage={errors.fighterStats?.ballisticSkill?.message}
        inputProps={register('fighterStats.ballisticSkill', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Strength:"
        hasError={!!errors.fighterStats?.strength}
        errorMessage={errors.fighterStats?.strength?.message}
        inputProps={register('fighterStats.strength', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Toughness:"
        hasError={!!errors.fighterStats?.toughness}
        errorMessage={errors.fighterStats?.toughness?.message}
        inputProps={register('fighterStats.toughness', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Wounds:"
        hasError={!!errors.fighterStats?.wounds}
        errorMessage={errors.fighterStats?.wounds?.message}
        inputProps={register('fighterStats.wounds', { valueAsNumber: true })}
      />
      <TextField
        label="Initiative:"
        hasError={!!errors.fighterStats?.initiative}
        errorMessage={errors.fighterStats?.initiative?.message}
        inputProps={register('fighterStats.initiative', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Attacks:"
        hasError={!!errors.fighterStats?.attacks}
        errorMessage={errors.fighterStats?.attacks?.message}
        inputProps={register('fighterStats.attacks', { valueAsNumber: true })}
      />
      <TextField
        label="Leadership:"
        hasError={!!errors.fighterStats?.leadership}
        errorMessage={errors.fighterStats?.leadership?.message}
        inputProps={register('fighterStats.leadership', {
          valueAsNumber: true,
        })}
      />
      <TextField
        label="Cool:"
        hasError={!!errors.fighterStats?.cool}
        errorMessage={errors.fighterStats?.cool?.message}
        inputProps={register('fighterStats.cool', { valueAsNumber: true })}
      />
      <TextField
        label="Will:"
        hasError={!!errors.fighterStats?.will}
        errorMessage={errors.fighterStats?.will?.message}
        inputProps={register('fighterStats.will', { valueAsNumber: true })}
      />
      <TextField
        label="Intelligence:"
        hasError={!!errors.fighterStats?.intelligence}
        errorMessage={errors.fighterStats?.intelligence?.message}
        inputProps={register('fighterStats.intelligence', {
          valueAsNumber: true,
        })}
      />
      <button type="submit">Add fighter type</button>
    </Stack>
  )
}

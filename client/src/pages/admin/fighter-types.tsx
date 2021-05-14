import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFighterTypeDto,
  createFighterTypeDtoSchema,
  FighterType,
} from 'schemas'
import { H1, H2, Stack, TextInput } from 'components/lib'
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

  const factionFieldId = useId()
  const factionErrorFieldId = useId()
  const categoryFieldId = useId()
  const categoryErrorFieldId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((fighterType) => {
        mutation.mutate(fighterType)
        onSubmit?.()
      })}
    >
      <TextInput
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <TextInput
        label="Cost:"
        error={errors.name}
        registration={register('cost', { valueAsNumber: true })}
      />

      <Stack variant="small">
        <label htmlFor={factionFieldId}>Faction:</label>
        <select
          id={factionFieldId}
          {...register('faction.id')}
          aria-invalid={!!errors.faction?.id}
          aria-describedby={errors.faction?.id ? factionErrorFieldId : ''}
        >
          {queryFactions.isLoading ? (
            <option key="factions-loading" value="">
              Loading...
            </option>
          ) : (
            <>
              <option key="factions-empty" value="">
                Please select
              </option>
              {queryFactions.factions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </>
          )}
        </select>
        {!!errors.faction?.id && (
          <span role="alert" id={factionErrorFieldId}>
            {errors.faction.id.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={categoryFieldId}>Category:</label>

        <select
          id={categoryFieldId}
          {...register('fighterCategory.id')}
          aria-invalid={!!errors.fighterCategory?.id}
          aria-describedby={
            errors.fighterCategory?.id ? categoryErrorFieldId : ''
          }
        >
          {queryCategories.isLoading ? (
            <option key="categories-loading" value="">
              Loading...
            </option>
          ) : (
            <>
              <option key="categories-empty" value="">
                Please select
              </option>
              {queryCategories.fighterCategories.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </>
          )}
        </select>
        {!!errors.fighterCategory?.id && (
          <span role="alert" id={categoryErrorFieldId}>
            {errors.fighterCategory.id?.message}
          </span>
        )}
      </Stack>

      <TextInput
        label="Movement:"
        error={errors.fighterStats?.movement}
        registration={register('fighterStats.movement', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Weapon Skill:"
        error={errors.fighterStats?.weaponSkill}
        registration={register('fighterStats.weaponSkill', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Ballistic Skill:"
        error={errors.fighterStats?.ballisticSkill}
        registration={register('fighterStats.ballisticSkill', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Strength:"
        error={errors.fighterStats?.strength}
        registration={register('fighterStats.strength', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Toughness:"
        error={errors.fighterStats?.toughness}
        registration={register('fighterStats.toughness', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Wounds:"
        error={errors.fighterStats?.wounds}
        registration={register('fighterStats.wounds', { valueAsNumber: true })}
      />
      <TextInput
        label="Initiative:"
        error={errors.fighterStats?.initiative}
        registration={register('fighterStats.initiative', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Attacks:"
        error={errors.fighterStats?.attacks}
        registration={register('fighterStats.attacks', { valueAsNumber: true })}
      />
      <TextInput
        label="Leadership:"
        error={errors.fighterStats?.leadership}
        registration={register('fighterStats.leadership', {
          valueAsNumber: true,
        })}
      />
      <TextInput
        label="Cool:"
        error={errors.fighterStats?.cool}
        registration={register('fighterStats.cool', { valueAsNumber: true })}
      />
      <TextInput
        label="Will:"
        error={errors.fighterStats?.will}
        registration={register('fighterStats.will', { valueAsNumber: true })}
      />
      <TextInput
        label="Intelligence:"
        error={errors.fighterStats?.intelligence}
        registration={register('fighterStats.intelligence', {
          valueAsNumber: true,
        })}
      />
      <button type="submit">Add fighter type</button>
    </Stack>
  )
}

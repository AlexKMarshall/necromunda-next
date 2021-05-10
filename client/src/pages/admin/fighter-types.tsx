import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, Column } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFighterTypeDto,
  createFighterTypeDtoSchema,
  FighterType,
} from 'schemas'
import { DataTable, H1, H2, Stack } from 'components/lib'
import { useQueryFactions } from 'hooks/factions'
import { useQueryFighterCategories } from 'hooks/fighter-categories'
import { Input } from 'styles/admin'
import {
  useQueryFighterTypes,
  useDeleteFighterType,
  useCreateFighterType,
} from 'hooks/fighter-types'

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

      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<FighterType> }) => (
          <DeleteFighterTypeButton
            fighterTypeId={original.id}
            fighterTypeName={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

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
          <AddFighterTypeForm
            onSubmit={closeForm}
            formLabelId={dialogTitleId}
          />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.fighterTypes} />
      {query.isLoading ? <div>Loading...</div> : null}
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

interface AddFighterTypeFormProps {
  onSubmit?: () => void
  formLabelId: string
}

function AddFighterTypeForm({
  onSubmit,
  formLabelId,
}: AddFighterTypeFormProps) {
  const mutation = useCreateFighterType()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<CreateFighterTypeDto>({
    resolver: zodResolver(createFighterTypeDtoSchema),
  })

  const queryFactions = useQueryFactions()
  const queryCategories = useQueryFighterCategories()

  const nameFieldId = useId()
  const nameErrorFieldId = useId()
  const costFieldId = useId()
  const costErrorFieldId = useId()
  const factionFieldId = useId()
  const factionErrorFieldId = useId()
  const categoryFieldId = useId()
  const categoryErrorFieldId = useId()
  const movementFieldId = useId()
  const movementErrorFieldId = useId()
  const weaponSkillFieldId = useId()
  const weaponSkillErrorFieldId = useId()
  const ballisticSkillFieldId = useId()
  const ballisticSkillErrorFieldId = useId()
  const strengthFieldId = useId()
  const strengthErrorFieldId = useId()
  const toughnessFieldId = useId()
  const toughnessErrorFieldId = useId()
  const woundsFieldId = useId()
  const woundsErrorFieldId = useId()
  const initiativeFieldId = useId()
  const initiativeErrorFieldId = useId()
  const attacksFieldId = useId()
  const attacksErrorFieldId = useId()
  const leadershipFieldId = useId()
  const leadershipErrorFieldId = useId()
  const coolFieldId = useId()
  const coolErrorFieldId = useId()
  const willFieldId = useId()
  const willErrorFieldId = useId()
  const intelligenceFieldId = useId()
  const intelligenceErrorFieldId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((fighterType) => {
        mutation.mutate(fighterType)
        onSubmit?.()
      })}
      aria-labelledby={formLabelId}
      aria-invalid={!isFormValid}
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
            !!errors.fighterCategory?.id ? categoryErrorFieldId : ''
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
      <Stack variant="small">
        <label htmlFor={movementFieldId}>Movement:</label>
        <Input
          id={movementFieldId}
          {...register('fighterStats.movement', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.movement}
          aria-describedby={
            !!errors.fighterStats?.movement ? movementErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.movement && (
          <span role="alert" id={movementErrorFieldId}>
            {errors.fighterStats.movement.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={weaponSkillFieldId}>Weapon Skill:</label>
        <Input
          id={weaponSkillFieldId}
          {...register('fighterStats.weaponSkill', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.weaponSkill}
          aria-describedby={
            !!errors.fighterStats?.weaponSkill ? weaponSkillErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.weaponSkill && (
          <span role="alert" id={weaponSkillErrorFieldId}>
            {errors.fighterStats.weaponSkill.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={ballisticSkillFieldId}>Ballistic Skill:</label>
        <Input
          id={ballisticSkillFieldId}
          {...register('fighterStats.ballisticSkill', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.ballisticSkill}
          aria-describedby={
            !!errors.fighterStats?.ballisticSkill
              ? ballisticSkillErrorFieldId
              : ''
          }
        />
        {!!errors.fighterStats?.ballisticSkill && (
          <span role="alert" id={ballisticSkillErrorFieldId}>
            {errors.fighterStats.ballisticSkill.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={strengthFieldId}>Strength:</label>
        <Input
          id={strengthFieldId}
          {...register('fighterStats.strength', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.strength}
          aria-describedby={
            !!errors.fighterStats?.strength ? strengthErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.strength && (
          <span role="alert" id={strengthErrorFieldId}>
            {errors.fighterStats.strength.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={toughnessFieldId}>Toughness:</label>
        <Input
          id={toughnessFieldId}
          {...register('fighterStats.toughness', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.toughness}
          aria-describedby={
            !!errors.fighterStats?.toughness ? toughnessErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.toughness && (
          <span role="alert" id={toughnessErrorFieldId}>
            {errors.fighterStats.toughness.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={woundsFieldId}>Wounds:</label>
        <Input
          id={woundsFieldId}
          {...register('fighterStats.wounds', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.wounds}
          aria-describedby={
            !!errors.fighterStats?.wounds ? woundsErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.wounds && (
          <span role="alert" id={woundsErrorFieldId}>
            {errors.fighterStats.wounds.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={initiativeFieldId}>Initiative:</label>
        <Input
          id={initiativeFieldId}
          {...register('fighterStats.initiative', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.initiative}
          aria-describedby={
            !!errors.fighterStats?.initiative ? initiativeErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.initiative && (
          <span role="alert" id={initiativeErrorFieldId}>
            {errors.fighterStats.initiative.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={attacksFieldId}>Attacks:</label>
        <Input
          id={attacksFieldId}
          {...register('fighterStats.attacks', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.attacks}
          aria-describedby={
            !!errors.fighterStats?.attacks ? attacksErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.attacks && (
          <span role="alert" id={attacksErrorFieldId}>
            {errors.fighterStats.attacks.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={leadershipFieldId}>Leadership:</label>
        <Input
          id={leadershipFieldId}
          {...register('fighterStats.leadership', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.leadership}
          aria-describedby={
            !!errors.fighterStats?.leadership ? leadershipErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.leadership && (
          <span role="alert" id={leadershipErrorFieldId}>
            {errors.fighterStats.leadership.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={coolFieldId}>Cool:</label>
        <Input
          id={coolFieldId}
          {...register('fighterStats.cool', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.cool}
          aria-describedby={!!errors.fighterStats?.cool ? coolErrorFieldId : ''}
        />
        {!!errors.fighterStats?.cool && (
          <span role="alert" id={coolErrorFieldId}>
            {errors.fighterStats.cool.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={willFieldId}>Will:</label>
        <Input
          id={willFieldId}
          {...register('fighterStats.will', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.will}
          aria-describedby={!!errors.fighterStats?.will ? willErrorFieldId : ''}
        />
        {!!errors.fighterStats?.will && (
          <span role="alert" id={willErrorFieldId}>
            {errors.fighterStats.will.message}
          </span>
        )}
      </Stack>
      <Stack variant="small">
        <label htmlFor={intelligenceFieldId}>Intelligence:</label>
        <Input
          id={intelligenceFieldId}
          {...register('fighterStats.intelligence', { valueAsNumber: true })}
          aria-invalid={!!errors.fighterStats?.intelligence}
          aria-describedby={
            !!errors.fighterStats?.intelligence ? intelligenceErrorFieldId : ''
          }
        />
        {!!errors.fighterStats?.intelligence && (
          <span role="alert" id={intelligenceErrorFieldId}>
            {errors.fighterStats.intelligence.message}
          </span>
        )}
      </Stack>
      <button type="submit">Add fighter type</button>
    </Stack>
  )
}

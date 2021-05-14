import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateSkillDto, createSkillDtoSchema, Skill } from 'schemas'
import { useQuerySkills, useCreateSkill, useDeleteSkill } from 'hooks/skills'
import { H1, H2, Stack, TextInput } from 'components/lib'
import { useQuerySkillTypes } from 'hooks/skill-types'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'

const skillColumns: Column<Skill>[] = [
  { Header: 'Name', accessor: 'name' as const },
  { Header: 'Type', accessor: (row) => row.type.name },
]

export default function Skills(): JSX.Element {
  const query = useQuerySkills()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  return (
    <Stack>
      <H1>Skills</H1>
      <button onClick={openModal}>Add Skills</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Skills</H2>
          <AddSkillForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <AdminTable
        columns={skillColumns}
        data={query.skills}
        deleteHook={useDeleteSkill}
      />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface AddSkillFormProps {
  onSubmit?: () => void
}

function AddSkillForm({ onSubmit }: AddSkillFormProps) {
  const skillTypesQuery = useQuerySkillTypes()
  const mutation = useCreateSkill()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSkillDto>({
    resolver: zodResolver(createSkillDtoSchema),
  })
  const typeId = useId()
  const typeErrorId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
        onSubmit?.()
      })}
    >
      <TextInput
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <Stack variant="small">
        <label htmlFor={typeId}>Type:</label>
        <select
          id={typeId}
          {...register('type.id')}
          aria-invalid={!!errors.type?.id}
          aria-describedby={errors.type ? typeErrorId : ''}
        >
          {skillTypesQuery.isLoading ? (
            <option key="skilltypes-loading" value="">
              Loading...
            </option>
          ) : (
            <>
              <option key="skilltype-empty" value="">
                Please select
              </option>
              {skillTypesQuery.skillTypes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </>
          )}
        </select>
        {!!errors.type && (
          <span role="alert" id={typeErrorId}>
            {errors.type.id?.message}
          </span>
        )}
      </Stack>
      <button type="submit">Add skill type</button>
    </Stack>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateSkillTypeDto,
  createSkillTypeDtoSchema,
  SkillType,
} from 'schemas'
import {
  useQuerySkillTypes,
  useCreateSkillType,
  useDeleteSkillType,
} from 'hooks/skill-types'
import { H1, H2, Stack, TextField } from 'components/lib'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'

const skillTypeColumns: Column<SkillType>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function SkillTypes(): JSX.Element {
  const query = useQuerySkillTypes()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  return (
    <Stack>
      <H1>Skill Types</H1>
      <button onClick={openModal}>Add Skill Type</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Skill Type</H2>
          <AddSkillTypeForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <AdminTable
        columns={skillTypeColumns}
        data={query.skillTypes}
        deleteHook={useDeleteSkillType}
      />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface AddSkillTypeFormProps {
  onSubmit?: () => void
}

function AddSkillTypeForm({ onSubmit }: AddSkillTypeFormProps) {
  const mutation = useCreateSkillType()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSkillTypeDto>({
    resolver: zodResolver(createSkillTypeDtoSchema),
  })

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
        onSubmit?.()
      })}
    >
      <TextField
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <button type="submit">Add skill type</button>
    </Stack>
  )
}

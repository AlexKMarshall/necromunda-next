import { useId } from 'react-aria'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import styled from 'styled-components'
import { Stack } from 'components/lib'

type TextInputProps = {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function TextInput({
  label,
  error,
  registration,
}: TextInputProps): JSX.Element {
  const inputId = useId()
  const errorId = useId()
  return (
    <Stack variant="small">
      <label htmlFor={inputId}>{label}</label>
      <Input
        id={inputId}
        {...registration}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : ''}
      />
      {!!error && (
        <span role="alert" id={errorId}>
          {error.message}
        </span>
      )}
    </Stack>
  )
}

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

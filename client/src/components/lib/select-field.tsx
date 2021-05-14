import { useId } from 'react-aria'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { Stack } from 'components/lib'

type SelectFieldProps = {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
  isLoading: boolean
  options: { value: string; label?: string }[]
}

export function SelectField({
  label,
  error,
  registration,
  isLoading,
  options,
}: SelectFieldProps): JSX.Element {
  const inputId = useId()
  const errorId = useId()
  return (
    <Stack variant="small">
      <label htmlFor={inputId}>{label}</label>
      <select
        id={inputId}
        {...registration}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : ''}
      >
        {isLoading ? (
          <option key={`${inputId}-loading`} value="">
            Loading...
          </option>
        ) : (
          <>
            <option key={`${inputId}-pleaseSelect`} value="">
              Please select
            </option>
            {options.map(({ value, label: optionLabel }) => (
              <option key={`${inputId}${value}`} value={value}>
                {optionLabel}
              </option>
            ))}
          </>
        )}
      </select>
      {!!error && (
        <span role="alert" id={errorId}>
          {error.message}
        </span>
      )}
    </Stack>
  )
}

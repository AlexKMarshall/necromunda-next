import { useId } from 'react-aria'
import { Required } from 'utility-types'
import React, { useCallback } from 'react'
import { Stack } from 'components/lib'
import { SelectOption } from 'types'
import { useFieldError, useFieldLabel } from 'hooks/form-field'

type SelectFieldProps = {
  label: string
  options: SelectOption[]
  hasError?: boolean
  errorMessage?: string
  selectProps?: SelectProps
  isLoading?: boolean
}

export function SelectField({
  label,
  hasError = false,
  errorMessage = '',
  selectProps,
  options,
  isLoading = false,
}: SelectFieldProps): JSX.Element {
  const { getLabelProps, getErrorProps, getFieldControlProps, fieldId } =
    useFormFieldSelect({
      label,
      hasError,
      errorMessage,
    })

  return (
    <FormField
      labelProps={{ ...getLabelProps() }}
      errorProps={{ ...getErrorProps() }}
      hasError={hasError}
    >
      <select {...getFieldControlProps(selectProps)}>
        {isLoading ? (
          <option key={`${fieldId}-loading`} value="" disabled>
            Loading...
          </option>
        ) : (
          <>
            <option key={`${fieldId}-pleaseSelect`} value="">
              Please select
            </option>
            {options.map(({ value, label: optionLabel }) => (
              <option key={`${fieldId}${value}`} value={value}>
                {optionLabel}
              </option>
            ))}
          </>
        )}
      </select>
    </FormField>
  )
}

type LabelProps = Required<
  React.ComponentPropsWithoutRef<'label'>,
  'htmlFor' | 'children'
>
type ErrorProps = Required<
  React.ComponentPropsWithoutRef<'span'>,
  'id' | 'children'
>
type FormFieldProps = {
  labelProps: LabelProps
  errorProps: ErrorProps
  children: React.ReactNode
  hasError: boolean
}

function FormField({
  labelProps: { htmlFor, ...labelProps },
  errorProps,
  children,
  hasError,
}: FormFieldProps) {
  return (
    <Stack variant="small">
      <label {...labelProps} htmlFor={htmlFor} />
      {children}
      {hasError && <span {...errorProps} />}
    </Stack>
  )
}

function useFormFieldSelect({
  label,
  hasError = false,
  errorMessage,
}: {
  label: string
  hasError: boolean
  errorMessage?: string
}) {
  const { getErrorProps, errorId } = useFieldError({ errorMessage })
  const { getFieldControlProps, fieldId } = useSelectFieldControl({
    hasError,
    errorId,
  })
  const { getLabelProps } = useFieldLabel({ fieldId, label })

  return { getLabelProps, getErrorProps, getFieldControlProps, fieldId }
}

type SelectProps = React.ComponentPropsWithRef<'select'>

function useSelectFieldControl({
  hasError,
  errorId,
}: {
  hasError: boolean
  errorId: string
}) {
  const fieldId = useId()
  const getFieldControlProps = useCallback(
    (fieldProps: SelectProps = {}) => ({
      ...fieldProps,
      id: fieldId,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : '',
      defaultValue: '',
    }),
    [errorId, fieldId, hasError]
  )
  return { getFieldControlProps, fieldId }
}

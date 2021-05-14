import { useId } from 'react-aria'
import { Required } from 'utility-types'
import React, { useCallback } from 'react'
import { Stack } from 'components/lib'
import { SelectOption } from 'types'

type SelectFieldProps = {
  label: string
  options: SelectOption[]
  hasError?: boolean
  errorMessage?: string
  selectProps?: React.ComponentPropsWithRef<'select'>
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
  errorMessage = '',
}: {
  label: string
  hasError: boolean
  errorMessage?: string
}) {
  const fieldId = useId()
  const errorId = useId()

  const getLabelProps = useCallback(
    (labelProps?: React.ComponentPropsWithoutRef<'label'>) => ({
      ...labelProps,
      htmlFor: fieldId,
      children: label,
    }),
    [fieldId, label]
  )
  const getErrorProps = useCallback(
    (errorProps?: React.ComponentPropsWithoutRef<'span'>) => ({
      ...errorProps,
      role: 'alert',
      id: errorId,
      children: errorMessage ?? '',
    }),
    [errorId, errorMessage]
  )
  const getFieldControlProps = useCallback(
    (fieldProps?: FieldControlProps) => ({
      ...fieldProps,
      id: fieldId,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : '',
      defaultValue: '',
    }),
    [errorId, fieldId, hasError]
  )

  return { getLabelProps, getErrorProps, getFieldControlProps, fieldId }
}

type FieldControlProps = React.ComponentPropsWithRef<'select'>

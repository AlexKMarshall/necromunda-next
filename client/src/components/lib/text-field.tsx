import { useId } from 'react-aria'
import styled from 'styled-components'
import { Stack } from 'components/lib'
import { Required } from 'utility-types'
import React, { useCallback } from 'react'
import { useFieldError, useFieldLabel } from 'hooks/form-field'

type TextFieldProps = {
  label: string
  hasError: boolean
  errorMessage?: string
  inputProps?: InputProps
}

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

export function TextField({
  label,
  hasError,
  errorMessage,
  inputProps,
}: TextFieldProps): JSX.Element {
  const { getLabelProps, getErrorProps, getFieldControlProps } =
    useFormFieldInput({
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
      <Input {...getFieldControlProps(inputProps)} />
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

function useFormFieldInput({
  label,
  hasError = false,
  errorMessage,
}: {
  label: string
  hasError?: boolean
  errorMessage?: string
}) {
  const { getErrorProps, errorId } = useFieldError({ errorMessage })
  const { getFieldControlProps, fieldId } = useInputFieldControl({
    hasError,
    errorId,
  })
  const { getLabelProps } = useFieldLabel({ fieldId, label })

  return { getLabelProps, getErrorProps, getFieldControlProps }
}

type InputProps = React.ComponentPropsWithRef<'input'>

function useInputFieldControl({
  hasError,
  errorId,
}: {
  hasError: boolean
  errorId: string
}) {
  const fieldId = useId()
  const getFieldControlProps = useCallback(
    (fieldProps: InputProps = {}) => ({
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

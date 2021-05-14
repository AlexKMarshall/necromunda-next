import { useId } from 'react-aria'
import styled from 'styled-components'
import { Stack } from 'components/lib'
import { Required } from 'utility-types'
import React, { useCallback } from 'react'

type TextFieldProps = {
  label: string
  hasError: boolean
  errorMessage?: string
  inputProps: InputProps
}

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

type InputProps = React.ComponentPropsWithRef<'input'>

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
      children: errorMessage ?? null,
    }),
    [errorId, errorMessage]
  )
  const getFieldControlProps = useCallback(
    (fieldProps?: FieldControlProps) => ({
      ...fieldProps,
      id: fieldId,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : '',
    }),
    [errorId, fieldId, hasError]
  )

  return { getLabelProps, getErrorProps, getFieldControlProps }
}

type FieldControlProps = React.ComponentPropsWithRef<'input'>

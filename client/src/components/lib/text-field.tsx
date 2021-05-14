import { useId } from 'react-aria'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import styled from 'styled-components'
import { Stack } from 'components/lib'
import { Required } from 'utility-types'
import React, { useCallback } from 'react'

type TextFieldProps = {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

export function TextField({
  label,
  error,
  registration,
}: TextFieldProps): JSX.Element {
  const { getLabelProps, getErrorProps, getFieldControlProps } =
    useFormFieldInput({
      label,
      error,
    })

  return (
    <FormField
      labelProps={{ ...getLabelProps() }}
      errorProps={{ ...getErrorProps() }}
      error={error}
    >
      <Input {...getFieldControlProps({ ...registration })} />
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
  error?: FieldError
}

function FormField({
  labelProps: { htmlFor, ...labelProps },
  errorProps,
  children,
  error,
}: FormFieldProps) {
  return (
    <Stack variant="small">
      <label {...labelProps} htmlFor={htmlFor} />
      {children}
      {!!error && <span {...errorProps} />}
    </Stack>
  )
}

function useFormFieldInput({
  label,
  error,
}: {
  label: string
  error?: FieldError
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
      children: error?.message ?? null,
    }),
    [error?.message, errorId]
  )
  const getFieldControlProps = useCallback(
    (fieldProps?: FieldControlProps) => ({
      ...fieldProps,
      id: fieldId,
      'aria-invalid': !!error,
      'aria-describedby': error ? errorId : '',
    }),
    [error, errorId, fieldId]
  )

  return { getLabelProps, getErrorProps, getFieldControlProps }
}

type FieldControlProps = React.ComponentPropsWithRef<'input'>

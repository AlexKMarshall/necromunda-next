import React, { useCallback } from 'react'
import { useId } from 'react-aria'
import { Required } from 'utility-types'

export type UseFieldLabelProps = {
  fieldId: string
  label: string
}
type LabelProps = React.ComponentPropsWithoutRef<'label'>
type UseFieldLabelReturn = {
  getLabelProps: (
    props?: LabelProps
  ) => Required<LabelProps, 'htmlFor' | 'children'>
}

export function useFieldLabel({
  fieldId,
  label,
}: UseFieldLabelProps): UseFieldLabelReturn {
  const getLabelProps = useCallback<UseFieldLabelReturn['getLabelProps']>(
    (labelProps) => ({
      ...labelProps,
      htmlFor: fieldId,
      children: label,
    }),
    [fieldId, label]
  )
  return { getLabelProps }
}

export type UseFieldErrorProps = {
  errorMessage?: string
}
type SpanProps = React.ComponentPropsWithoutRef<'span'>
type UseFieldErrorReturn = {
  getErrorProps: (
    props?: SpanProps
  ) => Required<SpanProps, 'role' | 'id' | 'children'>
  errorId: string
}

export function useFieldError({
  errorMessage = '',
}: UseFieldErrorProps = {}): UseFieldErrorReturn {
  const errorId = useId()
  const getErrorProps = useCallback<UseFieldErrorReturn['getErrorProps']>(
    (errorProps) => ({
      ...errorProps,
      role: 'alert',
      id: errorId,
      children: errorMessage,
    }),
    [errorId, errorMessage]
  )

  return { getErrorProps, errorId }
}

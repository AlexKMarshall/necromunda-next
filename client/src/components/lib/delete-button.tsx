type DeleteButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  'aria-label': string
}

export function DeleteButton(props: DeleteButtonProps): JSX.Element {
  return (
    <button type="button" {...props}>
      Delete
    </button>
  )
}

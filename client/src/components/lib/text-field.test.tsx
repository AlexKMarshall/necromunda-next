import { render, screen, userEvent } from 'test/utils'
import faker from 'faker'
import { TextField } from '.'

test('can type into field', () => {
  const label = faker.lorem.word()
  const textEntry = faker.lorem.words()
  render(<TextField label={label} hasError={false} />)

  const input = screen.getByLabelText(label)
  userEvent.type(input, textEntry)

  expect(input).toHaveValue(textEntry)
})

test('field that hasError displays error message', () => {
  const label = faker.lorem.word()
  const errorMessage = faker.lorem.words()

  const { rerender } = render(<TextField label={label} hasError={false} />)

  const input = screen.getByLabelText(label)
  expect(input).toBeValid()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(input).toHaveDescription('')

  rerender(
    <TextField label={label} hasError={true} errorMessage={errorMessage} />
  )

  expect(input).toBeInvalid()
  expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
  expect(input).toHaveDescription(errorMessage)
})

import { render, screen, userEvent, within } from 'test/utils'
import faker from 'faker'
import { SelectField } from '.'
import { SelectOption } from 'types'

function buildSelectOption(
  overrides: Partial<SelectOption> = {}
): SelectOption {
  return {
    value: faker.datatype.uuid(),
    label: faker.commerce.color(),
    ...overrides,
  }
}

test('can select an option', () => {
  const label = faker.commerce.department()
  const options = [
    buildSelectOption(),
    buildSelectOption(),
    buildSelectOption(),
  ]
  const chosenOption = options[1]

  render(<SelectField label={label} options={options} />)

  const select = screen.getByLabelText(label)
  userEvent.selectOptions(select, screen.getByText(chosenOption.label))

  expect(select).toHaveDisplayValue(chosenOption.label)
  expect(select).toHaveValue(chosenOption.value)
})

test('shows loading state', () => {
  const label = faker.commerce.department()
  const options = [buildSelectOption()]

  const { rerender } = render(
    <SelectField label={label} options={options} isLoading />
  )

  const select = screen.getByLabelText(label)
  const loadingIndicator = within(select).getByRole('option', {
    name: /loading/i,
  })

  expect(loadingIndicator).toBeInTheDocument()
  expect(loadingIndicator).toBeDisabled()
  expect(select).toHaveDisplayValue(/loading/i)
  expect(screen.getAllByRole('option')).toHaveLength(1)
  expect(screen.queryByText(options[0].label)).not.toBeInTheDocument()

  rerender(<SelectField label={label} options={options} isLoading={false} />)

  expect(
    screen.queryByRole('option', { name: /loading/i })
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('option', { name: options[0].label })
  ).toBeInTheDocument()
})

test('field that hasError displays error message', () => {
  const label = faker.lorem.word()
  const errorMessage = faker.lorem.words()

  const { rerender } = render(
    <SelectField options={[]} label={label} hasError={false} />
  )

  const select = screen.getByLabelText(label)
  expect(select).toBeValid()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(select).toHaveDescription('')

  rerender(
    <SelectField
      label={label}
      options={[]}
      hasError={true}
      errorMessage={errorMessage}
    />
  )

  expect(select).toBeInvalid()
  expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
  expect(select).toHaveDescription(errorMessage)
})

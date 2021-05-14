import { render as rtlRender, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'

const Providers: React.ComponentType = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

type renderParams = Parameters<typeof rtlRender>
type renderResult = ReturnType<typeof rtlRender>

function render(
  ui: renderParams[0],
  options: renderParams[1] = {}
): renderResult {
  return rtlRender(ui, { wrapper: Providers, ...options })
}

/** Pass this a header row element to get back a function
 *  that you can call with a data row element to get back
 *  a further function that you can call with a header cell
 *  to get back the cell in the row you're looking at for that column
 *
 *  Essentially a curried version of getCellValue(headerRow, dataRow, columnHeader)
 */
function buildGetCellValueFactory(headerRow: HTMLElement): (dataRow: HTMLElement) => (headerCell: HTMLElement) => HTMLElement {
  const headerCellsArray = within(headerRow).getAllByRole('columnheader')
  function getColIndex(headerCell: HTMLElement) {
    return headerCellsArray.indexOf(headerCell)
  }

  return function getCellValueFactory(dataRow: HTMLElement) {
    const dataCells = within(dataRow).getAllByRole('cell')
    return function getCellValue(headerCell: HTMLElement): HTMLElement {
      const colIndex = getColIndex(headerCell)
      return dataCells[colIndex]
    }
  }
}

export * from '@testing-library/react'
export { render, userEvent, buildGetCellValueFactory }

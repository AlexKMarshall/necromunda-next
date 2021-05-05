import { render, screen } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import Factions from '../pages/admin/factions'

const queryClient = new QueryClient()

const Providers: React.ComponentType = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Factions', () => {
  it('renders without crashing', () => {
    render(<Factions />, { wrapper: Providers })

    screen.debug()
  })
})

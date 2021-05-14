import { render, screen } from '@testing-library/react'
import App from '../pages/index'

describe('app', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Welcome to Next.js!' })
    ).toBeInTheDocument()
  })
})

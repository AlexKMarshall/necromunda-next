import styled from 'styled-components'

interface StackProps {
  readonly variant?: 'regular' | 'small'
}

export const Stack = styled.div<StackProps>`
  --space-regular: var(--s1);
  --space-small: var(--s-1);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--space-${(p) => p.variant ?? 'regular'});
`

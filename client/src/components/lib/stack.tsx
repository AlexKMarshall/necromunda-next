import styled from 'styled-components'

export const Stack = styled.div`
  --space: var(--s1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  & > * + * {
    margin-top: var(--space);
  }
`

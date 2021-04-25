import { createGlobalStyle } from 'styled-components'

export const Global = createGlobalStyle`
  /* Scale */
  :root {
    --ratio: 1.25;
    --s-5: calc(var(--s-4) / var(--ratio));
    --s-4: calc(var(--s-3) / var(--ratio));
    --s-3: calc(var(--s-2) / var(--ratio));
    --s-2: calc(var(--s-1) / var(--ratio));
    --s-1: calc(var(--s0) / var(--ratio));
    --s0: 1rem;
    --s1: calc(var(--s0) * var(--ratio));
    --s2: calc(var(--s1) * var(--ratio));
    --s3: calc(var(--s2) * var(--ratio));
    --s4: calc(var(--s3) * var(--ratio));
    --s5: calc(var(--s4) * var(--ratio));
  }

  /* Colors */
  :root {
    --blue-grey-50: #eceff1;
    --blue-grey-100: #cfd8dc;
    --blue-grey-200: #b0bec5;
    --blue-grey-300: #90a4ae;
    --blue-grey-400: #78909c;
    --blue-grey-500: #607d8b;
    --blue-grey-600: #546e7a;
    --blue-grey-700: #455a64;
    --blue-grey-800: #37474f;
    --blue-grey-900: #263238;
  }
`

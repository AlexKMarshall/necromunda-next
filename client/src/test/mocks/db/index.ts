import { factory, primaryKey } from '@mswjs/data'
import faker from 'faker'

export const db = factory({
  faction: {
    id: primaryKey(faker.datatype.uuid),
    name: () => faker.lorem.word(),
  },
})

// export * as faction from './faction'

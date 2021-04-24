import { rest } from 'msw'

export const handlers = [
  rest.get('/gangs', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ gangs: 'Some data from gangs' }))
  }),
]

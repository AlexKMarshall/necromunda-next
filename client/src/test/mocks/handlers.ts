import { rest } from 'msw'
import { db } from './db'
import { CreateFactionDto } from 'schemas'

export const handlers = [
  rest.get('/factions', (req, res, ctx) => {
    const factions = db.faction.getAll()

    return res(ctx.status(200), ctx.json(factions))
  }),
  rest.post<CreateFactionDto>('/factions', (req, res, ctx) => {
    const { name } = req.body
    const faction = db.faction.create({ name })

    return res(ctx.status(201), ctx.json(faction))
  }),
  rest.get('/gangs', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ gangs: 'Some data from gangs' }))
  }),
]

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { server } = require('./server')
  server.listen()
}

export {}

if (process.env.NODE_ENV === 'test') {
  const { server } = require('./server')
  server.listen()
}

export {}

const fastify = require('./index')

const server = async () => {
  try {
    console.log('Now listening on port 3000 ...')
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    fastify.log.error(addr)
    process.exit(1)
  }
}
server()

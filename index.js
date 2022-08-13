const app = require('fastify')()
const axios = require('axios')

app.get('/:address', async (request, reply) => {
  const { address } = request.params
  const validAddr = /^0x[a-fA-F0-9]{40}$/.test(address)
  if (!validAddr) return reply.code(400).send({ error: 'NON_ADDR' })

  const poapScan = 'https://frontend.poap.tech/actions/scan'
  const { data: poaps } = await axios.get(`${poapScan}/${address}`)
  const eventImgs = poaps.map((p) => p?.event?.image_url)
  return { data: eventImgs }
})

app.get('/', async (request, reply) => {
  return { status: 'OK' }
})

module.exports = app

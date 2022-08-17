const app = require('fastify')()
const axios = require('axios')
const sharp = require('sharp')

app.get('/:address', async (request, reply) => {
  const { address } = request.params
  const validAddr = /^0x[a-fA-F0-9]{40}$/.test(address)
  if (!validAddr) return reply.code(400).send({ error: 'NON_ADDR' })

  const poapScan = 'https://frontend.poap.tech/actions/scan'
  const { data: poaps } = await axios.get(`${poapScan}/${address}`)
  const imgUrls = poaps
    .slice(0, 4)
    .map((p) => axios.get(p?.event?.image_url, { responseType: 'arraybuffer' }))

  const rawImgs = await Promise.all(imgUrls)
  const toResize = rawImgs.map((i) => sharp(i.data).resize(150, 150).toBuffer())

  const eventImgs = await Promise.all(toResize)

  const compImg = await sharp({
    create: {
      width: eventImgs.length * 150,
      height: 150,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(eventImgs.map((i, n) => ({ input: i, top: 0, left: n * 150 })))
    .toFormat('jpeg')
    .toBuffer({ resolveWithObject: true })

  reply.type('image/jpeg').send(compImg.data)
})

app.get('/', async (_request, _reply) => {
  return { status: 'OK' }
})

module.exports = app

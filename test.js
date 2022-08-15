const app = require('./index')

const test = async () => {
  const res = await app.inject({
    method: 'GET',
    url: `/${process.env.TEST_ADDRESS}`,
  })
  console.log(res.json())
}
test()

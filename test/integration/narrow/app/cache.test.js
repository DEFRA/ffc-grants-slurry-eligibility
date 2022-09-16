describe('Cache test', () => {
  const server = require('../../../../app/server')
  const cache = require('../../../../app/cache')

  const key = 'testKey'
  const setValue = 'testValue'

  beforeAll(() => {
    cache.initialise(server)
  })

  beforeEach(async () => {
    await server.start()
  })

  test('initialise cache more than once throws an error', () => {
    expect(() => cache.initialise(server)).toThrow()
  })

  test('set and retrieve value from desirability score cache', async () => {
    await cache.setDesirabilityScore(key, setValue)
    const getValue = await cache.getDesirabilityScore(key)

    expect(getValue).toEqual(setValue)
  })

  test('remove desirability score when it exists', async () => {
    await cache.setDesirabilityScore(key, setValue)
    await cache.removeDesirabilityScore(key)

    const getValue = await cache.getDesirabilityScore(key)
    expect(getValue).toEqual(setValue)
  })

  test('remove desirability score when it doesnt exist', async () => {
    await cache.removeDesirabilityScore(key)

    const getValue = await cache.getDesirabilityScore(key)
    expect(getValue).toEqual(null)
  })

  afterEach(async () => {
    await server.stop()
  })
})

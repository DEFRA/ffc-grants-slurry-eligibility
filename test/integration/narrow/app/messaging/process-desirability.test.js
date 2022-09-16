describe('Process desirability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Successful path', async () => {
    const processDesirability = require('../../../../../app/messaging/process-desirability')

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.removeDesirabilityScore.mockResolvedValue(true)

    const msg = {
      body: {
        desirabilityAnswers: 'lorem ipsum'
      },
      correlationId: 7357
    }

    processDesirability(msg)

    expect(cacheMock.removeDesirabilityScore).toHaveBeenCalled()
  })

  test('Error path', async () => {
    const processDesirability = require('../../../../../app/messaging/process-desirability')

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.removeDesirabilityScore = jest.fn(() => { throw Error })

    const msg = {
      body: {
        desirabilityAnswers: 'lorem ipsum'
      },
      correlationId: 7357
    }

    const appInsightsMock = require('../../../../../app/services/app-insights')
    jest.mock('../../../../../app/services/app-insights')
    appInsightsMock.logException = jest.fn()

    processDesirability(msg)

    expect(cacheMock.removeDesirabilityScore).toThrow()
  })
})

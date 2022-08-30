describe('Desirability score', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
    console.error = jest.fn()
  })

  test('Successful path', async () => {
    const desirabilityScore = require('../../../../../app/messaging/desirability-score')

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.setDesirabilityScore = jest.fn(() => { })
    const msg = {
      body: {
        correlationId: 7357
      },
      desirabilityScoreMsg: 'lorem ipsum'
    }
    const desirabilityScoreReceiver = {
      completeMessage: jest.fn()
    }

    desirabilityScore(msg, desirabilityScoreReceiver)

    expect(console.log).toHaveBeenCalledWith(msg.body, 'desirabilityScoreMsg')
    expect(cacheMock.setDesirabilityScore).toHaveBeenCalled()
  })

  test('Error path', async () => {
    const desirabilityScore = require('../../../../../app/messaging/desirability-score')

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.setDesirabilityScore = jest.fn(() => { throw Error })

    const appInsightsMock = require('../../../../../app/services/app-insights')
    appInsightsMock.logException = jest.fn()

    const msg = {
      body: {
        correlationId: 7357
      },
      desirabilityScoreMsg: 'lorem ipsum'
    }
    const desirabilityScoreReceiver = {
      abandonMessage: jest.fn()
    }

    desirabilityScore(msg, desirabilityScoreReceiver)

    await desirabilityScoreReceiver.abandonMessage(msg)

    expect(console.log.mock.calls[0]).toEqual([{ correlationId: 7357 }, 'desirabilityScoreMsg'])

    expect(console.error.mock.calls[0]).toEqual(['Unable to process desirability score message'])

    expect(appInsightsMock.logException).toHaveBeenCalled()
    expect(desirabilityScoreReceiver.abandonMessage).toHaveBeenCalled()
  })
})

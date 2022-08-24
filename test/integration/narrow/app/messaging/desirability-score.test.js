describe('Desirability score', () => {
  beforeAll(() => {
    console.log = jest.fn()
  })

  test('Successful path', async () => {
    const desirabilityScore = require('../../../../../app/messaging/desirability-score')

    const cacheMock = jest.mock('../../../../../app/cache')
    cacheMock.setDesirabilityScore = jest.fn(() => { })
    const msg = {
      body: {
        correlationId: 7357
      },
      desirabilityScoreMsg: 'lorem ipsum'
    }
    const desirabilityScoreReceiver = {
      completeMessage: jest.fn(msg => { })
    }

    desirabilityScore(msg, desirabilityScoreReceiver)

    expect(console.log).toHaveBeenCalledWith(msg.body, 'desirabilityScoreMsg')
    expect(cacheMock.setDesirabilityScore).toHaveBeenCalled()
    expect(desirabilityScoreReceiver.completeMessage).toHaveBeenCalled()
  })

  test('Error path', async () => {
    const desirabilityScore = require('../../../../../app/messaging/desirability-score')

    const cacheMock = jest.mock('../../../../../app/cache')
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
    expect(console.log.mock.calls[1]).toEqual('[TypeError: Cannot read property \'set\' of undefined]')
    expect(console.log.mock.calls[2]).toEqual([{ correlationId: 7357 }, 'desirabilityScoreMsg'])
    expect(appInsightsMock.logException).toHaveBeenCalled()
    expect(desirabilityScoreReceiver.abandonMessage).toHaveBeenCalled()
  })
})

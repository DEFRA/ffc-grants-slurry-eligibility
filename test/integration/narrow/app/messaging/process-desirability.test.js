describe('Process desirability', () => {
  test('Successful path', async () => {
    const log = jest.fn()
    global.console.log = log
    const processDesirability = require('../../../../../app/messaging/process-desirability')

    const cacheMock = jest.mock('../../../../../app/cache')
    cacheMock.removeDesirabilityScore = jest.fn(message => { })

    const createMessageMock = jest.mock('../../../../../app/messaging/create-desirability-msg', msg => 'create message return')

    const sendCalculateScoreMock = jest.mock('../../../../../app/messaging/senders')

    const msg = {
      body: {
        desirabilityAnswers: 'lorem ipsum'
      },
      correlationId: 7357
    }

    processDesirability(msg)

    expect(cacheMock.removeDesirabilityScore).toHaveBeenCalled()
    expect(createMessageMock).toHaveBeenCalled()
    expect(log).toHaveBeenCalled()
    expect(sendCalculateScoreMock).toHaveBeenCalled()
    log.mockReset()
  })

  test('Error path', async () => {
    const error = jest.fn()
    global.console.error = error

    const processDesirability = require('../../../../../app/messaging/process-desirability')

    const cacheMock = jest.mock('../../../../../app/cache')
    cacheMock.removeDesirabilityScore = jest.fn(() => { throw Error })

    const msg = {
      body: {
        desirabilityAnswers: 'lorem ipsum'
      },
      correlationId: 7357
    }

    const appInsightsMock = jest.mock('../../../../../app/services/app-insights')
    appInsightsMock.logException = jest.fn()

    processDesirability(msg)

    expect(cacheMock.removeDesirabilityScore).toThrow()
    expect(error).toHaveBeenCalledTimes(2)
    expect(appInsightsMock.logException).toHaveBeenCalled()
    error.mockReset()
  })
})

describe('Process submission', () => {
  const msg = {
    body: {
      submissionDetails: 'lorem ipsum'
    },
    correlationId: 7357
  }

  test('Successful path', async () => {
    const log = jest.fn()
    global.console.log = log
    const processSubmission = require('../../../../../app/messaging/process-submission')

    const contactDetailsReceiver = jest.mock()
    contactDetailsReceiver.completeMessage = jest.fn()

    const cacheMock = jest.mock('../../../../../app/cache')
    cacheMock.getSubmissionScore = jest.fn(message => { })

    const createMessageMock = jest.mock('../../../../../app/messaging/create-submission-msg')

    const sendersMock = jest.mock('../../../../../app/messaging/senders')
    const sendDesirabilitySubmittedMock = sendersMock.sendDesirabilitySubmitted

    processSubmission(msg)

    expect(cacheMock.getDesirabilityScore).toHaveBeenCalled()
    expect(log).toHaveBeenCalled()
    expect(createMessageMock).toHaveBeenCalled()
    expect(sendDesirabilitySubmittedMock).toHaveBeenCalled()
    expect(contactDetailsReceiver.completeMessage).toHaveBeenCalled()
    log.mockReset()
  })

  test('Error path', async () => {
    const error = jest.fn()
    global.console.error = error

    const processSubmission = require('../../../../../app/messaging/process-Submission')
    processSubmission.completeMessage = jest.fn()

    const contactDetailsReceiver = jest.mock()
    contactDetailsReceiver.abandonMessage = jest.fn()

    const cacheMock = jest.mock('../../../../../app/cache')
    cacheMock.getDesirabilityScore = jest.fn(() => { throw Error })

    const appInsightsMock = jest.mock('../../../../../app/services/app-insights')
    appInsightsMock.logException = jest.fn()

    processSubmission(msg,)

    expect(cacheMock.getDesirabilityScore).toThrow()
    expect(error).toHaveBeenCalled()
    expect(appInsightsMock.logException).toHaveBeenCalled()
    error.mockReset()
  })
})

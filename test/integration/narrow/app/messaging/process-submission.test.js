describe('Process submission', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const msg = {
    body: {
      submissionDetails: 'lorem ipsum'
    },
    correlationId: 7357
  }

  test('Successful path', async () => {
    const processSubmission = require('../../../../../app/messaging/process-submission')

    const contactDetailsReceiver = jest.mock()
    contactDetailsReceiver.completeMessage = jest.fn()

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.getDesirabilityScore.mockResolvedValue(true)

    const createMessageMock = require('../../../../../app/messaging/create-submission-msg')
    jest.mock('../../../../../app/messaging/create-submission-msg')
    createMessageMock.mockReturnValue(true)

    const { sendDesirabilitySubmitted } = require('../../../../../app/messaging/senders')
    jest.mock('../../../../../app/messaging/senders')

    sendDesirabilitySubmitted.mockResolvedValue(true)

    processSubmission(msg, contactDetailsReceiver)

    expect(cacheMock.getDesirabilityScore).toHaveBeenCalled()
  })

  test('Error path', async () => {
    const processSubmission = require('../../../../../app/messaging/process-submission')
    processSubmission.completeMessage = jest.fn()

    const contactDetailsReceiver = jest.mock()
    contactDetailsReceiver.abandonMessage = jest.fn()

    const cacheMock = require('../../../../../app/cache')
    jest.mock('../../../../../app/cache')
    cacheMock.getDesirabilityScore = jest.fn(() => { throw Error })

    const appInsightsMock = require('../../../../../app/services/app-insights')
    jest.mock('../../../../../app/services/app-insights')
    appInsightsMock.logException = jest.fn()

    processSubmission(msg, contactDetailsReceiver)

    expect(cacheMock.getDesirabilityScore).toThrow()
  })
})

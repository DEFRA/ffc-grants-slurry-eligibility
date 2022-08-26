describe('Reciever', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Elligibility', async () => {
    const { MessageReceiver } = require('ffc-messaging')

    jest.mock('ffc-messaging')

    const mocksubscribe = jest.fn()
    MessageReceiver.prototype.subscribe = mocksubscribe

    const eligibilityAnswersReceivedMock = jest.fn((msg, reciever) => { })

    const { startEligibilityAnswersReceiver } = require('../../../../../app/messaging/receivers')

    startEligibilityAnswersReceiver(eligibilityAnswersReceivedMock)

    expect(mocksubscribe).toHaveBeenCalled()
  })

  test('Contact details', async () => {
    const { MessageReceiver } = require('ffc-messaging')

    jest.mock('ffc-messaging')

    const mocksubscribe = jest.fn()
    MessageReceiver.prototype.subscribe = mocksubscribe

    const contactDetailsReceivedMock = jest.fn((msg, reciever) => { })

    const { startContactDetailsReceiver } = require('../../../../../app/messaging/receivers')

    startContactDetailsReceiver(contactDetailsReceivedMock)

    expect(mocksubscribe).toHaveBeenCalled()
  })
})

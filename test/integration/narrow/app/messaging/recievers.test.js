describe('Reciever', () => {
  test('Elligibility', async () => {
    const Messaging = jest.mock('ffc-messaging')
    const messageReceiverMock = (cfg, action) => {
      action()
      return {
        subscribe: jest.fn()
      }
    }
    Messaging.MessageReceiver = messageReceiverMock

    const eligibilityAnswersReceivedMock = jest.fn((msg, reciever) => { })

    const { startEligibilityAnswersReceiver } = require('../../../../../app/messaging/receivers')

    startEligibilityAnswersReceiver(eligibilityAnswersReceivedMock)

    expect(eligibilityAnswersReceivedMock).toHaveBeenCalled()
    expect(messageReceiverMock.subscribe).toHaveBeenCalled()
  })

  test('Contact details', async () => {
    const Messaging = jest.mock('ffc-messaging')
    const messageReceiverMock = (cfg, action) => {
      action()
      return {
        subscribe: jest.fn()
      }
    }
    Messaging.MessageReceiver = messageReceiverMock

    const contactDetailsReceivedMock = jest.fn((msg, reciever) => { })

    const { startContactDetailsReceiver } = require('../../../../../app/messaging/receivers')

    startContactDetailsReceiver(contactDetailsReceivedMock)

    expect(contactDetailsReceivedMock).toHaveBeenCalled()
    expect(messageReceiverMock.subscribe).toHaveBeenCalled()
  })
})

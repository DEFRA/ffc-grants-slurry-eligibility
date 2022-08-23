const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let eligibilityAnswersReceiver

let contactDetailsReceiver
let desirabilityScoreReceiver

async function stop () {
  await eligibilityAnswersReceiver.closeConnection()
  await contactDetailsReceiver.closeConnection()
  await desirabilityScoreReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  startEligibilityAnswersReceiver: async function (eligibilityAnswersReceived) {
    const updateAction = msg => eligibilityAnswersReceived(msg, eligibilityAnswersReceiver)
    eligibilityAnswersReceiver = new MessageReceiver(msgCfg.eligibilityAnswersQueue, updateAction)
    await eligibilityAnswersReceiver.subscribe()
  },
  startContactDetailsReceiver: async function (contactDetailsReceived) {

    const updateAction = msg => contactDetailsReceived(msg, contactDetailsReceiver)
    contactDetailsReceiver = new MessageReceiver(msgCfg.contactDetailsQueue, updateAction)
    await contactDetailsReceiver.subscribe()
  }
}

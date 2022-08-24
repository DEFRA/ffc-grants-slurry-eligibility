const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')
const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')

const desirabilitySubmittedSender = new MessageSender(msgCfg.desirabilitySubmittedTopic)

async function stop () {
  await desirabilitySubmittedSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, msgType, correlationId) {
  const msg = {
    body: msgData,
    type: msgType,
    source: msgCfg.msgSrc,
    correlationId
  }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  sendCalculateScore: async function (calculateScoreData, correlationId) {
    await sendMsg(
      calculateScoreData,
      msgCfg.calculateScoreMsgType,
      correlationId
    )
  },
  sendDesirabilitySubmitted: async function (desirabilitySubmittedData, correlationId) {
    await sendMsg(
      desirabilitySubmittedSender,
      desirabilitySubmittedData,
      msgCfg.desirabilitySubmittedMsgType,
      correlationId
    )
    await protectiveMonitoringServiceSendEvent(correlationId, 'FTF-DATA-SUBMITTED', '0703')
  }
}

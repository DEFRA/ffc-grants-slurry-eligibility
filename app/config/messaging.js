const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

module.exports = {
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  desirabilityScoreSubscription: {
    address: process.env.DESIRABILITY_SCORE_SUBSCRIPTION_ADDRESS,
    topic: process.env.DESIRABILITY_SCORE_TOPIC_ADDRESS,
    type: 'subscription',
    ...sharedConfig
  },
  desirabilitySubmittedTopic: {
    address: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
    type: 'topic',
    ...sharedConfig
  },
  desirabilitySubmittedMsgType: `${msgTypePrefix}.slurry.desirability.notification`,
  calculateScoreMsgType: `${msgTypePrefix}.slurry.desirability.calculate`,
  msgSrc: 'ffc-grants-slurry-eligibility'
}

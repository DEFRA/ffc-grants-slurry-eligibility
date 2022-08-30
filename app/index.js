const server = require('./server')
const receivers = require('./messaging/receivers')
const processSubmissionAction = require('./messaging/process-submission')
const cache = require('./cache')

const init = async () => {
  receivers.startContactDetailsReceiver(processSubmissionAction)
  cache.initialise(server)
  require('./services/app-insights').setup()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

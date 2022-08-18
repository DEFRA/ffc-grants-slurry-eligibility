describe('Create submission messages', () => {
  const createSubmissionMsg = require('../../../../../app/messaging/create-submission-msg')
  const testTimeConstant = new Date(2022, 8, 18)
  const todayStr = testTimeConstant.toLocaleDateString('en-GB')

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(testTimeConstant)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('As a farmer', async () => {
    const { expectedOutcomeFarmer, farmerSubmission } = require('./create-submission-msg-test-data')

    const farmerApplicationResult = createSubmissionMsg(farmerSubmission)

    expect(farmerApplicationResult).toEqual(expectedOutcomeFarmer(testTimeConstant, todayStr))
  })

  it('As an agent on a farmers behalf', async () => {
    const { expectedOutcomeAgent, agentSubmissionForFarmer } = require('./create-submission-msg-test-data')

    const farmerApplicationResult = createSubmissionMsg(agentSubmissionForFarmer)

    expect(farmerApplicationResult).toEqual(expectedOutcomeAgent(testTimeConstant, todayStr))
  })
})

describe('Create submission messages', () => {
  const createSubmissionMsg = require('../../../../../app/messaging/create-submission-msg')
  const testTimeConstant = new Date(2022, 8, 18)
  const todayStr = testTimeConstant.toLocaleDateString('en-GB')
  const sixMonthsLater = new Date(testTimeConstant)
  sixMonthsLater.setMonth(testTimeConstant.getMonth() + 6)

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(testTimeConstant)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('As a farmer', async () => {
    const farmerSubmission = require('./farmer-submission')
    const expectedOutcomeFarmer = require('./expected-outcome-farmer')

    const farmerApplicationResult = createSubmissionMsg(farmerSubmission)

    expect(farmerApplicationResult).toEqual(expectedOutcomeFarmer(testTimeConstant, sixMonthsLater, todayStr))
  })

  it('As an agent on a farmers behalf', async () => {
    const agentSubmissionForFarmer = require('./agent-submission-for-farmer')
    const expectedOutcomeAgent = require('./expected-outcome-agent')

    const agentSubmissionForFarmerApplicationResult = createSubmissionMsg(agentSubmissionForFarmer)

    expect(agentSubmissionForFarmerApplicationResult).toEqual(expectedOutcomeAgent(testTimeConstant, sixMonthsLater, todayStr))
  })
})

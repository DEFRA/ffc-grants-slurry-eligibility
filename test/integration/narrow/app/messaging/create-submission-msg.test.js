describe('Desirability score', () => {
  const createSubmissionMsg = require('../../../../../app/messaging/create-submission-msg')
  const testTimeConstant = new Date(2022, 8, 18)

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(testTimeConstant)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should retrieve a desirability score', async () => {
    const todayStr = testTimeConstant.toLocaleDateString('en-GB')

    const { expectedOutcome, farmerSubmission } = require('./create-submission-msg-test-data')

    const farmerApplicationResult = createSubmissionMsg(farmerSubmission)

    expect(farmerApplicationResult).toEqual(expectedOutcome(testTimeConstant, todayStr))
  })
})

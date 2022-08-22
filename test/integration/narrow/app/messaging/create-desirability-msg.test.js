describe('Desirability score', () => {
  const desirability = require('../../../../../app/messaging/create-desirability-msg')

  it('should retrieve a desirability score', async () => {
    const answers = {
      collaboration: 'collaboration answer'
    }

    const result = desirability(answers)

    expect(result.grantScheme.key).toEqual('ADDVAL01')

    result.desirability.questions[0].answers.forEach(questionAndAnswer => {
      expect(questionAndAnswer.input[0].value).toEqual(answers[questionAndAnswer.key])
    })
  })
})
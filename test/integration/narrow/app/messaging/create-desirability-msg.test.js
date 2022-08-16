describe('Desirability score', () => {
  const desirability = require('../../../../../app/messaging/create-desirability-msg')

  it('should retrieve a desirability score', async () => {
    const answers = {
      'products-processed': 'products processed answer',
      'how-adding-value': 'how adding value answer',
      'project-impact': 'project impact answer',
      'future-customers': 'future customers answer',
      collaboration: 'collaboration answer',
      'products-coming-from': 'products coming from answer',
      'processed-sold': 'process sold answer',
      'environmental-impact': 'environmental impact answer'
    }

    const result = desirability(answers)

    expect(result.grantScheme.key).toEqual('ADDVAL01')

    result.desirability.questions[0].answers.forEach(questionAndAnswer => {
      expect(questionAndAnswer.input[0].value).toEqual(answers[questionAndAnswer.key])
    })
  })
})

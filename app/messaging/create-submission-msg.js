const emailConfig = require('../config/email')
const spreadsheetConfig = require('../config/spreadsheet')

function getQuestionScoreBand (questions, questionKey) {
  return questions.filter(question => question.key === questionKey).length > 0
    ? questions.find(question => question.key === questionKey).rating.band
    : ''
}

function generateRow (rowNumber, name, value, bold = false) {
  return {
    row: rowNumber,
    values: ['', name, value],
    bold
  }
}

function calculateBusinessSize (employees, turnover) {
  const employeesNum = Number(employees)
  const turnoverNum = Number(turnover)

  if (employeesNum < 10 && turnoverNum < 1740000) { // €2m turnover
    return 'Micro'
  } else if (employeesNum < 50 && turnoverNum < 8680000) { // €10m turnover
    return 'Small'
  } else if (employeesNum < 250 && turnoverNum < 43410000) { // €50m turnover
    return 'Medium'
  } else {
    return 'Large'
  }
}

function addAgentDetails (agentsDetails) {
  return [
    generateRow(26, 'Agent Surname', agentsDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentsDetails?.firstName ?? ''),
    generateRow(29, 'Agent Address line 1', agentsDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentsDetails?.address2 ?? ''),
    generateRow(31, 'Agent Address line 3', ''),
    generateRow(32, 'Agent Address line 4 (town)', agentsDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentsDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentsDetails?.postcode ?? ''),
    generateRow(35, 'Agent Landline number', agentsDetails?.landlineNumber ?? ''),
    generateRow(36, 'Agent Mobile number', agentsDetails?.mobileNumber ?? ''),
    generateRow(37, 'Agent Email', agentsDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentsDetails?.businessName ?? '')
  ]
}

function generateExcelFilename (scheme, projectName, businessName, referenceNumber, today) {
  const dateTime = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    dateStyle: 'short',
    timeZone: 'Europe/London'
  }).format(today).replace(/\//g, '-')
  return `${scheme}_${projectName}_${businessName}_${referenceNumber}_${dateTime}.xlsx`
}
function getBusinessTypeC53 (businessType) {
  return 'value' ? 'processor' : 'producer'
}

function getProjectItems (projectItems, storage) {
  if (storage.includes('Yes')) {
    projectItems.push('Storage Facilities')
  }
  return projectItems.join('|')
}
function getSpreadsheetDetails (submission, desirabilityScore) {
  console.log('INSIDE SPREADSHEET FORMAT', submission, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  const schemeName = 'Slurry Infrastructure'
  const subScheme = `FTF-${schemeName}`

  return {
    filename: generateExcelFilename(
      subScheme.trim(),
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Slurry Infrastructure/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: [
          generateRow(1, 'Field Name', 'Field Value', true),
          generateRow(2, 'FA or OA', 'Outline Application'),
          generateRow(40, 'Scheme', 'Farming Transformation Fund'),
          generateRow(39, 'Sub scheme', subScheme),
          generateRow(43, 'Theme', 'Slurry Infrastructure'),
          generateRow(90, 'Project type', 'Slurry Infrastructure'),
          generateRow(41, 'Owner', 'RD'),
          generateRow(341, 'Grant Launch Date', ''),
          generateRow(23, 'Status of applicant', submission.legalStatus),
          generateRow(44, 'Project Items', submission.otherItems),
          generateRow(45, 'Location of project (postcode)', submission.farmerDetails.projectPostcode),
          generateRow(376, 'Project Started', submission.projectStart),
          generateRow(342, 'Land owned by Farm', submission.tenancy),
          generateRow(343, 'Tenancy for next 5 years', submission.tenancyLength ?? ''),
          generateRow(55, 'Total project expenditure', String(submission.itemsTotalValue).replace(/,/g, '')),
          generateRow(57, 'Grant rate', '40'),
          generateRow(56, 'Grant amount requested', submission.itemsTotalValue),
          generateRow(345, 'Remaining Cost to Farmer', submission.remainingCosts),
          generateRow(346, 'Planning Permission Status', submission.planningPermission),
          generateRow(49, 'Site of Special Scientific Interest (SSSI)', submission.sSSI ?? ''),
          generateRow(366, 'Date of OA decision', ''),
          generateRow(42, 'Project name', submission.businessDetails.projectName),
          generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'), // sbi is '' if not set so use || instead of ??
          generateRow(7, 'Business name', submission.businessDetails.businessName),
          generateRow(367, 'Annual Turnover', submission.businessDetails.businessTurnover),
          generateRow(22, 'Employees', submission.businessDetails.numberEmployees),
          generateRow(20, 'Business size', calculateBusinessSize(submission.businessDetails.numberEmployees, submission.businessDetails.businessTurnover)),
          generateRow(91, 'Are you an AGENT applying on behalf of your customer', submission.applying === 'Agent' ? 'Yes' : 'No'),
          generateRow(5, 'Surname', submission.farmerDetails.lastName),
          generateRow(6, 'Forename', submission.farmerDetails.firstName),
          generateRow(8, 'Address line 1', submission.farmerDetails.address1),
          generateRow(9, 'Address line 2', submission.farmerDetails.address2),
          generateRow(10, 'Address line 3', ''),
          generateRow(11, 'Address line 4 (town)', submission.farmerDetails.town),
          generateRow(12, 'Address line 5 (county)', submission.farmerDetails.county),
          generateRow(13, 'Postcode (use capitals)', submission.farmerDetails.postcode),
          generateRow(16, 'Landline number', submission.farmerDetails.landlineNumber ?? ''),
          generateRow(17, 'Mobile number', submission.farmerDetails.mobileNumber ?? ''),
          generateRow(18, 'Email', submission.farmerDetails.emailAddress),
          generateRow(89, 'Customer Marketing Indicator', submission.consentOptional ? 'Yes' : 'No'),
          generateRow(368, 'Date ready for QC or decision', todayStr),
          generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
          generateRow(94, 'Current location of file', 'NA Automated'),
          generateRow(92, 'RAG rating', 'Green'),
          generateRow(93, 'RAG date reviewed ', todayStr),
          generateRow(54, 'Electronic OA received date ', todayStr),
          generateRow(370, 'Status', 'Pending RPA review'),
          generateRow(85, 'Full Application Submission Date', (new Date(today.setMonth(today.getMonth() + 6))).toLocaleDateString('en-GB')),
          generateRow(375, 'OA percent', 'placeholder 1'),
          ...addAgentDetails(submission.agentsDetails)
        ]
      }
    ]
  }
}

function getCurrencyFormat (amount) {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, style: 'currency', currency: 'GBP' })
}


function getEmailDetails(submission, desirabilityScore, rpaEmail, isAgentEmail = false) {
  const email = isAgentEmail ? submission.agentsDetails.emailAddress : submission.farmerDetails.emailAddress
  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: rpaEmail || email,
    details: {
      firstName: isAgentEmail ? submission.agentsDetails.firstName : submission.farmerDetails.firstName,
      lastName: isAgentEmail ? submission.agentsDetails.lastName : submission.farmerDetails.lastName,
      referenceNumber: submission.confirmationId,
      overallRating: 'eligibile',
      scoreChance: 'yes',
      legalStatus: submission.legalStatus,
      projectPostcode: submission.farmerDetails.projectPostcode,
      location: submission.inEngland,
      planningPermission: submission.planningPermission,
      projectStart: submission.projectStart,
      tenancy: submission.tenancy,
      isTenancyLength: submission.tenancyLength ? 'Yes' : 'No',
      tenancyLength: submission.tenancyLength ?? ' ',
      projectItems: submission.otherItems,
      projectCost: getCurrencyFormat(submission.itemsTotalValue),
      potentialFunding: getCurrencyFormat(submission.itemsTotalValue),
      remainingCost: submission.remainingCosts,
      projectName: submission.businessDetails.projectName,
      businessName: submission.businessDetails.businessName,
      farmerName: submission.farmerDetails.firstName,
      farmerSurname: submission.farmerDetails.lastName,
      farmerEmail: submission.farmerDetails.emailAddress,
      isAgent: submission.agentsDetails ? 'Yes' : 'No',
      agentName: submission.agentsDetails?.firstName ?? ' ',
      agentSurname: submission.agentsDetails?.lastName ?? ' ',
      agentEmail: submission.agentsDetails?.emailAddress ?? ' ',
      contactConsent: submission.consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      businessType: submission.applicantBusiness
    }
  }
}
function spreadsheet (submission, desirabilityScore) {
  const data = getSpreadsheetDetails(submission, desirabilityScore)
  return data
}

module.exports = function (submission, desirabilityScore) {
  return {
    applicantEmail: getEmailDetails(submission, desirabilityScore, false),
    agentEmail: submission.applying === 'Agent' ? getEmailDetails(submission, desirabilityScore, false, true) : null,
    rpaEmail: spreadsheetConfig.sendEmailToRpa ? getEmailDetails(submission, desirabilityScore, spreadsheetConfig.rpaEmail) : null,
    spreadsheet: spreadsheet(submission, desirabilityScore)
  }
}

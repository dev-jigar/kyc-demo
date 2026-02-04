export const KYC_ADDONS = [
  { label: 'PEP Check', value: 'PEP_CHECK' },
  { label: 'SSN Verification', value: 'SSN_VERIFICATION' },
  {
    label: 'Criminal Background Check',
    value: 'CRIMINAL_BACKGROUND_CHECK',
    metadata: { duration: 'allTime' },
  },
  { label: 'Bank Account Verification', value: 'BANK_ACCOUNT_VERIFICATION' },
  {
    label: 'Bank Statement Retrieval',
    value: 'BANK_STATEMENTS',
    metadata: { duration: 'lastMonth' },
  },
];

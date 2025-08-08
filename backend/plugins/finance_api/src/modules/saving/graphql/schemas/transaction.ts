const fields = `    
    number: String,
    contractId: String,
    payDate: Date,
    payment: Float,
    total: Float,
    balance: Float,
    storedInterest: Float,
    closeAmount: Float,
    transactionTYpe: String
    `;

export const types = `
type SavingTransactionPreInfo {
    ${fields}
}

type SavingTransaction {
    _id: String,
    customerId: String,
    companyId: String,
    invoiceId: String,
    description: String,
    status: String,
    ${fields}
    contract: SavingContract,
    currency: String,
    ebarimt: JSON
}

type SavingTransactionListResponse {
    list: [SavingTransaction],
    totalCount: Float
}
`;

const queryParams = `
contractId: String
customerId: String
companyId: String
startDate: String
endDate: String
ids: [String]
searchValue: String
payDate: String
contractHasnt: String
transactionType: String
description: String
total: Float
`;

export const queries = `
    savingsTransactionMain(${queryParams}): SavingTransactionListResponse
    savingsTransactions(${queryParams}): SavingTransactionListResponse
    clientSavingsTransaction(${queryParams}): [SavingTransaction]
    savingsTransactionDetail(_id: String!): SavingTransaction
`;

const mutationParams = `
    contractId: String,
    customerId: String,
    copmanyId: String,
    invoiceId: String,
    payDate: Date,
    description: String,
    total: Float,
    isManual: Boolean,
    payment: Float
    currency: String,
    isOrganization: Boolean,
    organizationRegister: String,
    transactionType: String
`;

const clientFields = `
    secondaryPassword: String,
    dealtType: String,
    acccountNumber: String,
    accountHolderName: String,
    externalBankName: String,
    ownBankNumebr: String,
    ownBankType: String,
`;

const changeFields = `
  payment: Float,
`;

export const mutations = `
  savingsTransactionsAdd(${mutationParams}): SavingTransaction
  clientSavingsTransactionsAdd(${mutationParams}${clientFields}): SavingTransaction
  savingsTransactionsEdit(_id: String!, ${mutationParams}): SavingTransaction
  savingsTransactionsChange(_id: String!, ${changeFields}): SavingTransaction
  savingsTransactionsRemove(transactionIds: [String]): [String]
`;

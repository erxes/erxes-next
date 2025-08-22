const accountingAdjustInventoryChanged = `
  subscription AccountingAdjustInventoryChanged($adjustId: String!) {
    accountingAdjustInventoryChanged(adjustId: $adjustId) {
       _id
      createdAt
      createdBy
      updatedAt
      modifiedBy

      date
      description
      status
      error
      warning
      beginDate
      successDate
      checkedDate
    }
  }
`;

export default {
  accountingAdjustInventoryChanged,
};

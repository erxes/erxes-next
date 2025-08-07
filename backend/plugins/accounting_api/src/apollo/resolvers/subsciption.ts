const accountingAdjustInventoryChanged = `
  subscription AccountingAdjustInventoryChanged($_id: String!) {
    accountingAdjustInventoryChanged(_id: $_id) {
      type
    }
  }
`;

export default {
  accountingAdjustInventoryChanged,
};

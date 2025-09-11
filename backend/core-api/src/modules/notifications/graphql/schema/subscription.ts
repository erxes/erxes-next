const notificationInserted = `
  subscription notificationInserted($_id: ID!) {
    notificationInserted(_id: $_id) {
      _id
    }
  }
`;

export default {
  notificationInserted,
};

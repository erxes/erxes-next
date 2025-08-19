const conversationMessageInserted = `
  subscription conversationMessageInserted($_id: String!) {
    conversationMessageInserted(_id: $_id) {
      _id
    }
  }
`;

export default {
  conversationMessageInserted,
};

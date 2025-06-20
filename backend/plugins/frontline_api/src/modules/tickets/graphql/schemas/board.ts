export const types = `
  type TicketsBoard @key(fields: "_id") {
    _id: String!
    name: String!
    order: Int
    createdAt: Date
    type: String
    pipelines: [TicketsPipeline]
  }

  type TicketsBoardCount {
    _id: String
    name: String
    count: Int
  }
`;

export const queries = `
  ticketsBoards: [TicketsBoard]
  ticketsBoardCounts: [TicketsBoardCount]
  ticketsBoardGetLast: TicketsBoard
  ticketsBoardDetail(_id: String!): TicketsBoard
  ticketsBoardContentTypeDetail(contentType: String, contentId: String): JSON
  ticketsBoardLogs(action: String, content:JSON, contentId: String): JSON
`;

export const mutations = `
  ticketsBoardsAdd(name: String!): TicketsBoard
  ticketsBoardsEdit(_id: String!, name: String!): TicketsBoard
  ticketsBoardsRemove(_id: String!): JSON
  ticketsBoardItemUpdateTimeTracking(_id: String!, status: String!, timeSpent: Int!, startDate: String): JSON
  ticketsBoardItemsSaveForGanttTimeline(items: JSON, links: JSON): String
`;

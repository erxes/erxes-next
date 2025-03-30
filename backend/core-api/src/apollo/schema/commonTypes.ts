export const CommonTypes = `
    type Coordinate {
        longitude: String
        latitude: String
    }

    type Attachment {
        url: String!
        name: String
        type: String
        size: Float
        duration: Float
    }

    type PdfAttachment {
        pdf: Attachment
        pages: [Attachment]
    }
`;

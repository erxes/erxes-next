import gql from 'graphql-tag';

const segmentFields = `
  _id
  contentType
  name
  description
  subOf
  color
  conditions
  conditionsConjunction
  shouldWriteActivityLog

  config
`;

const fieldsCombinedByContentType = gql(
  `
    query Fields($contentType: String!) {
      fieldsCombinedByContentType(contentType: $contentType)
    }
`,
);

const segments = gql(`
    query Segments($contentTypes: [String]!, $config: JSON, $ids: [String],$excludeIds: [String],$searchValue:String) {
      segments(contentTypes: $contentTypes, config: $config, ids: $ids,excludeIds:$excludeIds,searchValue:$searchValue) {
        _id
        color
        count
        contentType
        description
        name
        subOf
      }
}
`);

const associationTypes = gql(`
  query GetAssociationTypes($contentType: String!) {
    segmentsGetAssociationTypes(contentType: $contentType)
  }
`);

const segmentsGetTypes = gql`
  query SegmentsGetTypes {
    segmentsGetTypes
  }
`;

const propertiesWithFields = gql(`
    query Query($contentType: String!) {
      fieldsCombinedByContentType(contentType: $contentType)
       segmentsGetAssociationTypes(contentType: $contentType)
    }
`);

const segmentDetail = gql`
  query segmentDetail($_id: String) {
    segmentDetail(_id: $_id) {
      ${segmentFields}
      getSubSegments {
        ${segmentFields}
      }
      subSegmentConditions
      {
        ${segmentFields}
      }
    }
  }
`;

export default {
  segments,
  fieldsCombinedByContentType,
  associationTypes,
  propertiesWithFields,
  segmentDetail,
  segmentsGetTypes,
};

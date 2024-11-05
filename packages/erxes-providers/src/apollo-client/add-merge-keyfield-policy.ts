type TypePolicies = {
  [key: string]: {
    merge: boolean;
    keyFields: boolean;
  };
};

export default function addMergeKeyfieldPolicy(
  typePolicies: TypePolicies,
  noIdNestedTypes: string[]
): void {
  const mergeAndNoKeyField = { merge: true, keyFields: false };

  for (const noIdNestedType of noIdNestedTypes) {
    typePolicies[noIdNestedType] = mergeAndNoKeyField;
  }
}

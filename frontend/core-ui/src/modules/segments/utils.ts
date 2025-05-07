import { Path } from 'react-hook-form';

export function startCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // handle camelCase
    .replace(/[_-]+/g, ' ') // handle snake_case and kebab-case
    .toLowerCase() // make everything lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
}

export const groupByType = (fields: any[]) => {
  return fields.reduce((acc, field) => {
    const value = field.value;
    let key;

    if (field.group) {
      key = field.group;
    } else {
      key =
        value && value.includes('.')
          ? value.substr(0, value.indexOf('.'))
          : 'general';

      key = startCase(key);
    }

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(field);

    return acc;
  }, {});
};

type FieldPath = string | number;

export function createFieldNameSafe<T>(
  basePath?: string,
  ...pathParts: FieldPath[]
): Path<T> {
  return [basePath || '', ...pathParts].join('.') as Path<T>;
}

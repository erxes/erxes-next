import { faker } from '@faker-js/faker';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

export type Product = {
  title: string;
  description: string;
  status: 'active' | 'inactive';
  price: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  tags: string[];
  vendor: string;
  type: string;
  code: string;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newProduct = (): Product => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    status: faker.helpers.shuffle<Product['status']>([
      'active',
      'inactive',
    ])[0]!,
    price: faker.commerce.price(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    category: faker.commerce.department(),
    tags: Array.from({ length: 3 }, () => faker.commerce.productAdjective()),
    vendor: faker.company.name(),
    type: faker.commerce.productMaterial(),
    code: faker.string.ulid(),
  };
};

const newPerson = (): Person => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Product[] => {
    const len = lens[depth]!;
    return range(len).map(() => newProduct());
  };

  return makeDataLevel();
}

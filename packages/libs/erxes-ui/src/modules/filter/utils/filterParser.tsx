import { createParser } from 'nuqs';

type FilterState = {
  condition: string;
  state: any;
};

export const filterParser = createParser<FilterState>({
  parse: (query) => {
    const [condition, state] = query.split('|');
    return { condition, state: JSON.parse(state) };
  },
  serialize: (state) => {
    return `${state.condition}|${JSON.stringify(state.state)}`;
  },
});

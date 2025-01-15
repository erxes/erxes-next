import { useSearchParams } from 'react-router';

export function useAddFilter(field: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    filter: searchParams.get(field) ?? '',
    setFilter: (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }
      setSearchParams(params);
    },
  };
}

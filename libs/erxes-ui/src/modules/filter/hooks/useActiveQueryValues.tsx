import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Filter } from 'erxes-ui/modules/filter/types/filter';

export const useActiveQueryValues = (filters: Filter[]) => {
  const location = useLocation();
  const [key, setKey] = useState(location.search);

  useEffect(() => {
    setKey(location.key);
  }, [location]);

  return key;
};

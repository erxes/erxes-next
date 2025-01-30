import { render } from '@testing-library/react';

import ErxesCore from './erxes-core';

describe('ErxesCore', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<ErxesCore />);
    expect(baseElement).toBeTruthy();
  });
  
});

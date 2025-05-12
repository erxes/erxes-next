// .storybook/preview.tsx
import type { Preview } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';

const withApolloMockProvider = (Story: any, context: any) => {
  return (
    <MockedProvider mocks={context.parameters.mocks || []} addTypename={false}>
      <Story />
    </MockedProvider>
  );
};

const preview: Preview = {
  decorators: [withApolloMockProvider],
};

export default preview;

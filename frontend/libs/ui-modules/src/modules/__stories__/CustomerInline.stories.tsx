import type { Meta, StoryObj } from '@storybook/react';
import { CustomerInline } from 'frontend/libs/ui-modules/src/modules/contacts/components/CustomerInline';
import { CUSTOMER_INLINE } from 'frontend/libs/ui-modules/src/modules/contacts/graphql/queries/getInlineCustomer';

const meta: Meta<typeof CustomerInline> = {
  title: 'Modules/Contacts/CustomerInline',
  component: CustomerInline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-[180px] overflow-hidden flex items-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CustomerInline>;

export const Default: Story = {
  args: {
    customer: {
      _id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      primaryEmail: 'jane.doe@example.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '1' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'Jane',
              lastName: 'Doe',
              primaryEmail: 'jane.doe@example.com',
              primaryPhone: '+1234567890',
              avatar: '',
            },
          },
        },
      },
    ],
  },
};

export const WithAvatar: Story = {
  args: {
    customer: {
      _id: '2',
      firstName: 'John',
      lastName: 'Smith',
      primaryEmail: 'john.smith@example.com',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JS',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '2' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'John',
              lastName: 'Smith',
              primaryEmail: 'john.smith@example.com',
              primaryPhone: '+1987654321',
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JS',
            },
          },
        },
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    customerId: 'loading-id',
  },
};

export const LongName: Story = {
  args: {
    customer: {
      _id: '3',
      firstName: 'Alexandria-Cassandra',
      lastName: 'Montgomery-Windsor',
      primaryEmail: 'alexandria@example.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '3' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'Alexandria-Cassandra',
              lastName: 'Montgomery-Windsor',
              primaryEmail: 'alexandria@example.com',
              primaryPhone: '+1122334455',
              avatar: '',
            },
          },
        },
      },
    ],
  },
};

export const WithCustomSize: Story = {
  args: {
    customer: {
      _id: '4',
      firstName: 'Chris',
      lastName: 'Evans',
      primaryEmail: 'chris.evans@example.com',
      avatar: '',
    },
    avatarProps: {
      size: 'lg',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '4' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'Chris',
              lastName: 'Evans',
              primaryEmail: 'chris.evans@example.com',
              primaryPhone: '+1098765432',
              avatar: '',
            },
          },
        },
      },
    ],
  },
};

export const NoAvatar: Story = {
  args: {
    customer: {
      _id: '5',
      firstName: 'NoAvatar',
      lastName: 'User',
      primaryEmail: 'noavatar@example.com',
      avatar: undefined,
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '5' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'NoAvatar',
              lastName: 'User',
              primaryEmail: 'noavatar@example.com',
              primaryPhone: '+1000000000',
              avatar: undefined,
            },
          },
        },
      },
    ],
  },
};

export const OnlyEmail: Story = {
  args: {
    customer: {
      _id: '6',
      firstName: undefined,
      lastName: undefined,
      primaryEmail: 'only@email.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '6' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: undefined,
              lastName: undefined,
              primaryEmail: 'only@email.com',
              primaryPhone: '+1222333444',
              avatar: '',
            },
          },
        },
      },
    ],
  },
};

export const OnlyName: Story = {
  args: {
    customer: {
      _id: '7',
      firstName: 'Only',
      lastName: 'Name',
      primaryEmail: undefined,
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: '7' },
        },
        result: {
          data: {
            customerDetail: {
              firstName: 'Only',
              lastName: 'Name',
              primaryEmail: undefined,
              primaryPhone: '+1555666777',
              avatar: '',
            },
          },
        },
      },
    ],
  },
};

export const Error: Story = {
  args: {
    customerId: 'error-id',
  },
  parameters: {
    mocks: [
      {
        request: {
          query: CUSTOMER_INLINE,
          variables: { _id: 'error-id' },
        },
        error: new window.Error('Failed to fetch customer'),
      },
    ],
  },
};

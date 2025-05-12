import type { Meta, StoryObj } from '@storybook/react';
import { CompanyInline } from 'frontend/libs/ui-modules/src/modules/contacts/components/CompanyInline';
import { COMPANY_INLINE } from 'frontend/libs/ui-modules/src/modules/contacts/graphql/queries/getInlineCompany';

const meta: Meta<typeof CompanyInline> = {
  title: 'Modules/Contacts/CompanyInline',
  component: CompanyInline,
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
type Story = StoryObj<typeof CompanyInline>;

export const Default: Story = {
  args: {
    company: {
      _id: '1',
      primaryName: 'Acme Corporation',
      primaryEmail: 'info@acme.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '1' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '1',
              primaryName: 'Acme Corporation',
              primaryEmail: 'info@acme.com',
              avatar: '',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const WithAvatar: Story = {
  args: {
    company: {
      _id: '2',
      primaryName: 'Globex Corporation',
      primaryEmail: 'contact@globex.com',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GC',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '2' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '2',
              primaryName: 'Globex Corporation',
              primaryEmail: 'contact@globex.com',
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GC',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    companyId: 'loading-id',
  },
};

export const LongName: Story = {
  args: {
    company: {
      _id: '3',
      primaryName:
        'Very Long Company Name That Should Trigger Text Overflow Handling',
      primaryEmail: 'info@verylongcompanyname.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '3' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '3',
              primaryName:
                'Very Long Company Name That Should Trigger Text Overflow Handling',
              primaryEmail: 'info@verylongcompanyname.com',
              avatar: '',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const WithCustomSize: Story = {
  args: {
    company: {
      _id: '4',
      primaryName: 'Tech Solutions',
      primaryEmail: 'hello@techsolutions.com',
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
          query: COMPANY_INLINE,
          variables: { _id: '4' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '4',
              primaryName: 'Tech Solutions',
              primaryEmail: 'hello@techsolutions.com',
              avatar: '',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const NoAvatar: Story = {
  args: {
    company: {
      _id: '5',
      primaryName: 'No Avatar Inc.',
      primaryEmail: 'noavatar@inc.com',
      avatar: undefined,
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '5' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '5',
              primaryName: 'No Avatar Inc.',
              primaryEmail: 'noavatar@inc.com',
              avatar: undefined,
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const OnlyEmail: Story = {
  args: {
    company: {
      _id: '6',
      primaryName: undefined,
      primaryEmail: 'only@email.com',
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '6' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '6',
              primaryName: undefined,
              primaryEmail: 'only@email.com',
              avatar: '',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const OnlyName: Story = {
  args: {
    company: {
      _id: '7',
      primaryName: 'Only Name LLC',
      primaryEmail: undefined,
      avatar: '',
    },
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: '7' },
        },
        result: {
          data: {
            companyDetail: {
              _id: '7',
              primaryName: 'Only Name LLC',
              primaryEmail: undefined,
              avatar: '',
              names: [],
            },
          },
        },
      },
    ],
  },
};

export const Error: Story = {
  args: {
    companyId: 'error-id',
  },
  parameters: {
    mocks: [
      {
        request: {
          query: COMPANY_INLINE,
          variables: { _id: 'error-id' },
        },
        error: new window.Error('Failed to fetch company'),
      },
    ],
  },
};

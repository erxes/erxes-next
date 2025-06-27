import { IconsProvider } from '../icons';
import { IconComponent } from '../icons/components/IconComponent';
import { StoryObj } from '@storybook/react';

export const IconStory = ({ name }: { name?: string }) => (
  <IconsProvider>
    <IconComponent name={name} />
  </IconsProvider>
);

export default {
  title: 'Modules/Icons',
  component: IconStory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

type Story = StoryObj<typeof IconStory>;

export const Default: Story = {};

export const WithCustomIcon: Story = {
  args: {
    name: 'IconAlertCircle',
  },
};

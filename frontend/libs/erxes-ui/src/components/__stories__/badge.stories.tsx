import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from 'erxes-ui/components/badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'muted', 'ghost'],
      description: 'Visual style of the badge',
      defaultValue: 'default',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
      defaultValue: 'md',
    },
    colorSeed: {
      control: 'text',
      description: 'String used to generate consistent colors',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const WithColorSeed: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge colorSeed="product">Product</Badge>
      <Badge colorSeed="service">Service</Badge>
      <Badge colorSeed="lead">Lead</Badge>
      <Badge colorSeed="campaign">Campaign</Badge>
    </div>
  ),
};

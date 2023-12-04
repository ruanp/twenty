import { Meta, StoryObj } from '@storybook/react';

import { ComponentDecorator } from '~/testing/decorators/ComponentDecorator';
import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

import { MobileNavigationDrawer } from '../MobileNavigationDrawer';

const meta: Meta<typeof MobileNavigationDrawer> = {
  title: 'Modules/Navigation/MobileNavigationDrawer',
  component: MobileNavigationDrawer,
};

export default meta;
type Story = StoryObj<typeof MobileNavigationDrawer>;

export const Default: Story = {
  decorators: [
    ComponentDecorator,
    ComponentWithRouterDecorator,
    SnackBarDecorator,
  ],
};

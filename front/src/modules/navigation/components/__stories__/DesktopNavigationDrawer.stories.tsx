import { Meta, StoryObj } from '@storybook/react';

import { ComponentDecorator } from '~/testing/decorators/ComponentDecorator';
import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

import { DesktopNavigationDrawer } from '../DesktopNavigationDrawer';

const meta: Meta<typeof DesktopNavigationDrawer> = {
  title: 'Modules/Navigation/DesktopNavigationDrawer',
  component: DesktopNavigationDrawer,
};

export default meta;
type Story = StoryObj<typeof DesktopNavigationDrawer>;

export const Default: Story = {
  decorators: [
    ComponentDecorator,
    ComponentWithRouterDecorator,
    SnackBarDecorator,
  ],
};

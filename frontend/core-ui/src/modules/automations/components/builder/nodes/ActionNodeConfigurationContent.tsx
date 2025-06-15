import { lazy } from 'react';

const actions: any = {
  delay: lazy(() =>
    import('./actions/delay/components/Delay').then((module) => ({
      default: module.Delay.NodeContent,
    })),
  ),
  setProperty: lazy(() =>
    import('./actions/manageProperties/component/ManageProperties').then(
      (module) => ({
        default: module.ManageProperties.NodeContent,
      }),
    ),
  ),
  sendEmail: lazy(() =>
    import('./actions/sendEmail/components/SendEmail').then((module) => ({
      default: module.SendEmail.NodeContent,
    })),
  ),
};

export const ActionNodeConfigurationContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  const Component = actions[type];

  if (!Component) {
    return null;
  }

  return (
    <div className="px-4 py-2">
      <Component config={config} />
    </div>
  );
};

import { lazy, Suspense } from 'react';

const actions: any = {
  delay: lazy(() =>
    import('../actions/Delay').then((module) => ({
      default: module.NodeContent,
    })),
  ),
  setProperty: lazy(() =>
    import('../actions/ManageProperties').then((module) => ({
      default: module.NodeContent,
    })),
  ),
};

export const ActionNodeContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  const Action = actions[type];

  if (!Action) {
    return null;
  }

  return (
    <div className="px-4 py-2">
      <Action config={config} />
    </div>
  );
};

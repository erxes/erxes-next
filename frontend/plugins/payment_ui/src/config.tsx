// import { IconCurrencyDollar } from '@tabler/icons-react';
// import { IUIConfig } from 'erxes-ui/types';
// import { IconMail, IconStackFront, IconTicket } from '@tabler/icons-react';
// import { lazy, Suspense } from 'react';

// export const CONFIG: IUIConfig = {
//   name: 'payment',
//   icon: IconCurrencyDollar,
//   navigationGroup: {
//     name: 'payment',
//     icon: IconCurrencyDollar,
//     content: () => (
//       <Suspense fallback={<div />}>
//         <h1>hi</h1>
//       </Suspense>
//     ),
//     subGroups: () => (
//       <Suspense fallback={<div />}>
//         <h1>hi</h1>
//       </Suspense>
//     ),
//     actions: () => (
//       <Suspense fallback={<div />}>
//         <h1>hi</h1>
//       </Suspense>
//     ),
//   },
//   modules: [
//     {
//       name: 'payment',
//       icon: IconCurrencyDollar,
//       path: 'payment',
//       hasSettings: true,
//       hasRelationWidget: false,
//       hasFloatingWidget: false,
//     },
//   ],
// };


import { IconMail, IconStackFront, IconTicket } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';


// const FrontlineNavigation = lazy(() =>
//   import('./modules/FrontlineNavigation').then((module) => ({
//     default: module.FrontlineNavigation,
//   })),
// );

// const FrontlineSubGroups = lazy(() =>
//   import('./modules/FrontlineSubGroups').then((module) => ({
//     default: module.FrontlineSubGroups,
//   })),
// );

// const FrontlineActions = lazy(() =>
//   import('./modules/FrontlineActions').then((module) => ({
//     default: module.FrontlineActions,
//   })),
// );

export const CONFIG: IUIConfig = {
  name: 'payment',
  navigationGroup: {
    name: 'payment',
    icon: IconStackFront,
    content: () => (
      <Suspense fallback={<div />}>
        <h1>hi1</h1>
      </Suspense>
    )
  },
  modules: [
    {
      name: 'invoice',
      icon: IconMail,
      path: 'invoice',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },

  ],
};

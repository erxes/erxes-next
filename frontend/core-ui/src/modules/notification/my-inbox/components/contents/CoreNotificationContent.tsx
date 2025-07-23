import { lazy } from 'react';

const BranchNotificationContent = lazy(() =>
  import(
    '@/notification/my-inbox/components/contents/structure/BranchNotificationContent'
  ).then((module) => ({
    default: module.BranchNotificationContent,
  })),
);

const DepartmentNotificationContent = lazy(() =>
  import(
    '@/notification/my-inbox/components/contents/structure/DepartmentNotificationContent'
  ).then((module) => ({
    default: module.DepartmentNotificationContent,
  })),
);

export const CoreNotificationContent = {
  branch: BranchNotificationContent,
  department: DepartmentNotificationContent,
};

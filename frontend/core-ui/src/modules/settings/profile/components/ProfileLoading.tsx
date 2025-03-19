import { SettingsSkeletonLoader } from '../../components/SettingsSkeletonLoader';

const ProfileLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      <SettingsSkeletonLoader className="h-3 w-28" />
      <div className="flex gap-4">
        <SettingsSkeletonLoader className="h-16 w-16" />
        <div className="flex-col gap-2 flex">
          <div className="flex gap-4">
            <SettingsSkeletonLoader className="h-6 w-24" />
            <SettingsSkeletonLoader className="h-6 w-24" />
          </div>
          <SettingsSkeletonLoader className="h-3 w-60" />
        </div>
      </div>
      <SettingsSkeletonLoader className="h-3 w-10" />
      <SettingsSkeletonLoader className="h-3 w-44" />
      <div className="grid grid-cols-2 gap-6 mt-0.5">
        <div className="flex flex-col gap-2">
          <SettingsSkeletonLoader className="h-3 w-28" />
          <SettingsSkeletonLoader className="h-8 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <SettingsSkeletonLoader className="h-3 w-28" />
          <SettingsSkeletonLoader className="h-8 w-full" />
        </div>
      </div>
      <SettingsSkeletonLoader className="h-3 w-10" />
      <SettingsSkeletonLoader className="h-3 w-44" />
      <SettingsSkeletonLoader className="h-8 w-full" />
      <SettingsSkeletonLoader className="h-3 w-16" />
      <SettingsSkeletonLoader className="h-3 w-96" />
      <SettingsSkeletonLoader className="h-3 w-10" />
      <SettingsSkeletonLoader className="h-3 w-40" />

      <div className="flex gap-1">
        <SettingsSkeletonLoader className="h-6 w-9" />
        <SettingsSkeletonLoader className="h-6 w-9" />
        <SettingsSkeletonLoader className="h-6 w-9" />
        <SettingsSkeletonLoader className="h-6 w-9" />
        <SettingsSkeletonLoader className="h-6 w-9" />
        <SettingsSkeletonLoader className="h-6 w-9" />
      </div>
    </div>
  );
};

export { ProfileLoading };

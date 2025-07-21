import { TmsCreateSheet } from '~/modules/tms/components/CreateTmsSheet';

export const EmptyList = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-3 justify-center items-center p-4 w-full max-w-md rounded-lg shadow-lg bg-background">
        <div className="overflow-hidden w-full h-52">
          <img
            src="/assets/images/tourism-empty-state.jpg"
            alt="tourism"
            className="object-cover w-full h-full rounded"
          />
        </div>

        <div className="p-2 text-center">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            Tour management system
          </h2>

          <p className="text-center text-muted-foreground text-sm font-medium leading-[140%] font-inter pb-4">
            A tour management system is software designed to organize and manage
            tourism-related activities. It helps streamline trip planning,
            booking, payment management, customer information, and travel
            schedules.
          </p>

          <TmsCreateSheet />
        </div>
      </div>
    </div>
  );
};

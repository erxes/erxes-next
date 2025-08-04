import BranchCard from '~/modules/pms/components/ui/branchCard';

const PmsBranchList = () => {
  return (
    <div className="h-full grid lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
      <BranchCard />
    </div>
  );
};
export default PmsBranchList;

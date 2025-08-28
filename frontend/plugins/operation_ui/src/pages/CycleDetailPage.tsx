import { CycleDetail } from '@/cycle/components/detail/CycleDetail';
import { useParams } from 'react-router-dom';
import { CycleDetailHeader } from '@/cycle/components/detail/CycleDetailHeader';
export const CycleDetailPage = () => {
  const { cycleId } = useParams();

  if (!cycleId) return null;

  return (
    <>
      <CycleDetailHeader />
      <CycleDetail />
    </>
  );
};

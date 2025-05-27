import { Stages } from './stage/Stages';
import { stages } from '../constants';

export const SalesList = ({}: {}) => {
  return (
    <div className="w-full h-full flex p-3 gap-3 overflow-x-auto overflow-y-hidden">
      {stages.map((stage) => (
        <Stages stage={stage} />
      ))}
    </div>
  );
};

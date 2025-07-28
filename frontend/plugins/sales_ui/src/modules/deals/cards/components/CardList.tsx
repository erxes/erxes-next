import { Card } from '@/deals/cards/components/item/Card';
import { CardsLoading } from '@/deals/components/loading/CardsLoading';
import { IDeal } from '@/deals/types/deals';
import { useDeals } from '@/deals/cards/hooks/useDeals';
import { useInView } from 'react-intersection-observer';

type Props = {
  stageId: string;
};

export const CardList = ({ stageId }: Props) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const { deals, loading: dealsLoading } = useDeals({
    variables: {
      stageId,
    },
    skip: !inView,
    fetchPolicy: 'cache-and-network',
  });

  return (
    <div ref={ref} className="space-y-2">
      {dealsLoading ? (
        <CardsLoading />
      ) : (
        (deals?.list || ([] as IDeal[])).map((deal) => (
          <Card key={deal._id} card={deal} />
        ))
      )}
    </div>
  );
};

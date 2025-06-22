import { Card } from '@/deals/cards/components/item/Card';
import { CardsLoading } from '@/deals/components/loading/CardsLoading';
import { IDeal } from '@/deals/types/deals';
import { useDeals } from '@/deals/cards/hooks/useDeals';

type Props = {
  stageId: string;
};

export const CardList = ({ stageId }: Props) => {
  const { deals, loading: dealsLoading } = useDeals({
    variables: {
      stageId,
    },
  });

  if (dealsLoading) {
    return <CardsLoading />;
  }

  return (deals?.list || ([] as IDeal[])).map((deal) => (
    <Card key={deal._id} card={deal} />
  ));
};

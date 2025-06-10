import { Card } from '@/deals/cards/components/Card';
import { IDeal } from '@/deals/types/deals';
import { Skeleton } from 'erxes-ui';
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
    return <Skeleton />;
  }

  return (deals || ([] as IDeal[]))?.map((deal) => (
    <Card key={deal._id} card={deal} />
  ));
};

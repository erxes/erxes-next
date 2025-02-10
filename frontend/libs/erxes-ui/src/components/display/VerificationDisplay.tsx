import { VALIDATION_STATUS_INFOS } from 'erxes-ui/constants/ValidationStatusInfos';
import { StatusDot } from 'erxes-ui/modules/record-field/meta-inputs/components/VerificationInput';

interface VerificationDisplayProps {
  value: string | null;
}
export const VerificationDisplay = ({ value }: VerificationDisplayProps) => {
  const currentStatus = VALIDATION_STATUS_INFOS.find(
    (info) => info.value === value,
  ) || VALIDATION_STATUS_INFOS[0] ;
  return <StatusDot className={currentStatus?.dotColor}></StatusDot>;
};

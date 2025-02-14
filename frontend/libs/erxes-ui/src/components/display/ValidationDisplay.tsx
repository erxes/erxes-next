import {
  TEmailValidationStatusInfo,
  EmailIconComponents,
} from 'erxes-ui/constants/EmailValidationStatusInfos';
import {
  TPhoneValidationStatusInfo,
  PhoneIconComponents,
} from 'erxes-ui/constants/PhoneValidationStatusInfos';
interface VerificationDisplayProps {
  value: string | null;
  validationInfos: TPhoneValidationStatusInfo | TEmailValidationStatusInfo;
}
export const ValidationDisplay = ({
  value,
  validationInfos,
}: VerificationDisplayProps) => {
  const currentStatus = validationInfos.find((info) => info.value === value);
  const IconComponent =
    PhoneIconComponents[
      currentStatus?.icon as keyof typeof PhoneIconComponents
    ] ||
    EmailIconComponents[
      currentStatus?.icon as keyof typeof EmailIconComponents
    ] ||
    'IconCircleDashed';
  return <IconComponent className={currentStatus?.className} size={16} />;
};

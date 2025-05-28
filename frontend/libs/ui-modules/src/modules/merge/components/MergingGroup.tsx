import { ChoiceboxGroup, ChoiceboxGroupProps } from 'erxes-ui';

export const MergingGroup = ({
  children,
  className,
  direction = 'column',
  spacing = 'default',
  value,
  onValueChange,
  defaultValue,
  ...props
}: ChoiceboxGroupProps) => {
  return (
    <ChoiceboxGroup
      className={className}
      direction={direction}
      spacing={spacing}
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </ChoiceboxGroup>
  );
};

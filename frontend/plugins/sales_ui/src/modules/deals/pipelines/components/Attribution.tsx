import { Combobox, Command, Popover, toast } from 'erxes-ui';

import { IconArrowDown } from '@tabler/icons-react';

type Props = {
  config: { value: string; label: string }[];
  onChange: () => void;
};

const Attribution = ({ config, onChange }: Props) => {
  const onChangeConfig = (conf: string) => {
    if (conf.startsWith(' ')) {
      return toast({
        title: 'Error',
        description:
          "Please make sure the number configuration doesn't start with a space",
        variant: 'destructive',
      });
    }

    onChange();
  };

  const onClickAttribute = (value: string) => {
    const characters = ['_', '-', '/', ' '];

    let changedConfig;

    if (characters.includes(value)) {
      changedConfig = `${config}${value}`;
    } else {
      changedConfig = `${config}{${value}}`;
    }

    onChangeConfig(changedConfig);
  };

  return (
    <Popover>
      <Popover.Trigger asChild>
        <span className="text-sm text-foreground/50 font-semibold flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors duration-200">
          Attribution
          <IconArrowDown size={13} />
        </span>
      </Popover.Trigger>
      <Popover.Content className="p-1">
        <Command shouldFilter={false} onSelect={(e) => e.currentTarget}>
          <Command.List className="p-1 ">
            <Combobox.Empty />
            {config.map(({ value, label }) => (
              <Command.Item
                key={value}
                value={value}
                className={`cursor-pointer text-xs`}
                onSelect={() => onClickAttribute(value)}
              >
                {label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};

export default Attribution;

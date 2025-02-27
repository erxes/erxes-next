import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from 'erxes-ui/components';
import {
  IconBrandFacebookFilled,
  IconX,
  IconBrandTwitter,
  IconWorld,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram,
} from '@tabler/icons-react';
import { CustomerFormType } from './formSchema';

type SocialLink = {
  key: keyof CustomerFormType['links'];
  label: string;
  icon: React.ReactNode;
};

export const CustomerAddLinksFields = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  const onClick = (onChange: (value: any) => void) => {
    onChange(undefined); 
  };

  const handleChange = (onChange: (value: any) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onChange(value === '' ? undefined : value);
  };

  const socialLinks: SocialLink[] = [
    {
      key: 'facebook',
      label: 'FACEBOOK',
      icon: <IconBrandFacebookFilled className="text-primary" />,
    },
    {
      key: 'x',
      label: 'TWITTER',
      icon: <IconBrandTwitter className="text-primary" />,
    },
    {
      key: 'website',
      label: 'WEBSITE',
      icon: <IconWorld className="text-primary" />,
    },
    {
      key: 'discord',
      label: 'DISCORD',
      icon: <IconBrandDiscord className="text-primary" />,
    },
    {
      key: 'github',
      label: 'GITHUB',
      icon: <IconBrandGithub className="text-primary" />,
    },
    {
      key: 'instagram',
      label: 'INSTAGRAM',
      icon: <IconBrandInstagram className="text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {socialLinks.map((socialLink) => (
        <FormField
          key={`links.${socialLink.key}`}
          control={control}
          name={`links.${socialLink.key}` as any}
          render={({ field }) =>{
            return  (
            <FormItem>
              <FormLabel>{socialLink.label}</FormLabel>
              <FormControl>
                <div className="focus-within:shadow-focus rounded-sm transition-all">
                  <div className="flex shadow-xs items-center rounded-sm">
                    <Button
                      size="icon"
                      variant="outline"
                      className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                      disabled
                    >
                      {socialLink.icon}
                    </Button>
                    <Input
                      className="rounded-none focus-visible:shadow-none h-7 shadow-none focus:z-30"
                      {...field}
                      value={field.value || ''}
                      onChange={handleChange(field.onChange)}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="shadow-none border-l rounded-none rounded-r-sm focus:z-30"
                      onClick={() => onClick(field.onChange)}
                    >
                      <IconX className="text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}}
        />
      ))}
    </div>
  );
};
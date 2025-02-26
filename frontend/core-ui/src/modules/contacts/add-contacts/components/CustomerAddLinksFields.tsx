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

export const CustomerAddLinksFields = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  const onClick = (onChange: (value: any) => void) => {
    onChange(undefined); // Clears the input value
  };

  const handleChange = (onChange: (value: any) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onChange(value === '' ? undefined : value); // Don't pass empty values
  };

  return (
    <div className="flex flex-col gap-5">
      <FormField
        key="links.facebook"
        control={control}
        name="links.facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FACEBOOK</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconBrandFacebookFilled className="text-primary" />
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
        )}
      />

      <FormField
        key="links.x"
        control={control}
        name="links.x"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TWITTER</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconBrandTwitter className="text-primary" />
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
        )}
      />

      <FormField
        key="links.website"
        control={control}
        name="links.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WEBSITE</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconWorld className="text-primary" />
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
        )}
      />

      <FormField
        key="links.discord"
        control={control}
        name="links.discord"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DISCORD</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconBrandDiscord className="text-primary" />
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
        )}
      />

      <FormField
        key="links.github"
        control={control}
        name="links.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GITHUB</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconBrandGithub className="text-primary" />
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
        )}
      />

      <FormField
        key="links.instagram"
        control={control}
        name="links.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>INSTAGRAM</FormLabel>
            <FormControl>
              <div className="focus-within:shadow-focus rounded-sm transition-all">
                <div className="flex shadow-xs items-center rounded-sm">
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-none border-r rounded-none rounded-l-sm hover:bg-transparent disabled:opacity-100"
                    disabled
                  >
                    <IconBrandInstagram className="text-primary" />
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
        )}
      />
    </div>
  );
};

import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Textarea,
  SelectCurrency,
  Spinner,
  Dialog,
} from 'erxes-ui';
import { AccountKind, Journal } from '../type/Account';
import { SelectAccountCategory } from './SelectAccountCategory';
import { SelectBranch, SelectDepartment } from 'ui-modules';
import { UseFormReturn } from 'react-hook-form';
import { TAccountForm } from '../type/accountForm';
import { IconX } from '@tabler/icons-react';

export const AccountForm = ({
  form,
  handleSubmit,
  loading,
}: {
  form: UseFormReturn<TAccountForm>;
  handleSubmit: (data: TAccountForm) => void;
  loading: boolean;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="py-4 grid grid-cols-2 gap-5"
      >
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input
                  placeholder="Enter account name"
                  {...field}
                  autoComplete="off"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="code"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Code</Form.Label>
              <Form.Control>
                <Input placeholder="Enter account code" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Category</Form.Label>
              <Form.Control>
                <SelectAccountCategory
                  tabIndex={0}
                  selected={field.value}
                  onSelect={field.onChange}
                  recordId={field.name}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="currency"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Currency</Form.Label>
              <Form.Control>
                <SelectCurrency
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item className="col-span-2">
              <Form.Label>Description</Form.Label>
              <Form.Control>
                <Textarea placeholder="Enter description" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="kind"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Kind</Form.Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Select kind" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {Object.values(AccountKind).map((kind) => (
                    <Select.Item key={kind} value={kind}>
                      {kind.charAt(0).toUpperCase() + kind.slice(1)}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="journal"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Journal</Form.Label>
              <Form.Control>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select journal" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.values(Journal).map((journal) => (
                      <Select.Item key={journal} value={journal}>
                        {journal.charAt(0).toUpperCase() + journal.slice(1)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="branchId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Branch</Form.Label>
              <Form.Control>
                <SelectBranch
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Department</Form.Label>
              <Form.Control>
                <SelectDepartment
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="isTemp"
          render={({ field }) => (
            <Form.Item className="flex flex-row items-center space-x-2 space-y-0 mt-4">
              <Form.Control>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Form.Control>
              <Form.Label variant="peer">Temporary Account</Form.Label>
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="isOutBalance"
          render={({ field }) => (
            <Form.Item className="flex flex-row items-center space-x-2 space-y-0 mt-4">
              <Form.Control>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Form.Control>
              <Form.Label variant="peer">Out of Balance</Form.Label>
            </Form.Item>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4 col-span-2">
          <Button variant="outline" type="button" size="lg">
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? <Spinner /> : 'Save Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const AccountDialog = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Content className="max-w-2xl">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description className="sr-only">
          {description}
        </Dialog.Description>
        <Dialog.Close asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-3"
          >
            <IconX />
          </Button>
        </Dialog.Close>
      </Dialog.Header>
      {children}
    </Dialog.Content>
  );
};

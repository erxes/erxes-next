import { IconPlus, IconX } from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  CurrencyCode,
  Form,
  Input,
  Select,
  Textarea,
  Dialog,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { TAddAccountForm } from '../type/AddAccountForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAccountSchema } from '../constants/addAccountSchema';
import { AccountKind, Journal } from '../type/Account';

export const AddAccount = () => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add Account
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title>Add Account</Dialog.Title>
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
        <AddAccountForm />
      </Dialog.Content>
    </Dialog>
  );
};

const AddAccountForm = () => {
  const form = useForm<TAddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      name: '',
      code: '',
      categoryId: '',
      currency: CurrencyCode.USD,
      description: '',
      kind: AccountKind.ACTIVE,
      journal: Journal.MAIN,
      branchId: '',
      departmentId: '',
      isTemp: false,
      isOutBalance: false,
    },
  });
  return (
    <Form {...form}>
      <form className="py-4 grid grid-cols-2 gap-5">
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input placeholder="Enter account name" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select a category" />
                  </Select.Trigger>
                  <Select.Content>
                    {/* TODO: Add categories from API */}
                    <Select.Item value="category1">Category 1</Select.Item>
                    <Select.Item value="category2">Category 2</Select.Item>
                  </Select.Content>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select currency" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.values(CurrencyCode).map((currency) => (
                      <Select.Item key={currency} value={currency}>
                        {currency}
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
              <Form.Control>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select kind" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.values(AccountKind).map((kind) => (
                      <Select.Item key={kind} value={kind}>
                        {kind.charAt(0).toUpperCase() + kind.slice(1)}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select branch" />
                  </Select.Trigger>
                  <Select.Content>
                    {/* TODO: Add branches from API */}
                    <Select.Item value="branch1">Branch 1</Select.Item>
                    <Select.Item value="branch2">Branch 2</Select.Item>
                  </Select.Content>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select department" />
                  </Select.Trigger>
                  <Select.Content>
                    {/* TODO: Add departments from API */}
                    <Select.Item value="dept1">Department 1</Select.Item>
                    <Select.Item value="dept2">Department 2</Select.Item>
                  </Select.Content>
                </Select>
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
          <Button type="submit" size="lg">
            Save Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

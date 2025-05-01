import { UseFormReturn } from 'react-hook-form';
import { CtaxFormValues, CtaxKind, CtaxStatus } from '../types/CtaxRow';
import {
  Button,
  CurrencyValueInput,
  Dialog,
  Form,
  Input,
  Select,
  Spinner,
} from 'erxes-ui';

export const CtaxForm = ({
  form,
  onSubmit,
  loading,
}: {
  form: UseFormReturn<CtaxFormValues>;
  onSubmit: (data: CtaxFormValues) => void;
  loading: boolean;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5 grid-cols-2 py-3"
      >
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item className="col-span-2">
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="number"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Number</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="kind"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Kind</Form.Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a kind" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {Object.values(CtaxKind).map((kind) => (
                    <Select.Item key={kind} value={kind} className="capitalize">
                      {kind}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="percent"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Percent</Form.Label>
              <Form.Control>
                <Input.Number
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  min={0}
                  max={100}
                />
              </Form.Control>
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="status"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Status</Form.Label>

              <Select value={field.value} onValueChange={field.onChange}>
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a status" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {Object.values(CtaxStatus).map((status) => (
                    <Select.Item
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Form.Item>
          )}
        />
        <Dialog.Footer className="col-span-2 mt-3 gap-2">
          <Dialog.Close asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? <Spinner /> : 'Submit'}
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};

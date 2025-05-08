import { Form, Input, ScrollArea, Textarea } from 'erxes-ui';
import { useStructureDetails } from '../hooks/useStructureDetails';
import { useStructureDetailsForm } from '../hooks/useStructureDetailsForm';
import { useEffect } from 'react';
import { AssignMember } from 'ui-modules';

export const Structure = () => {
  const { structureDetail } = useStructureDetails();
  const {
    methods,
    methods: { control },
  } = useStructureDetailsForm();
  console.log('structureDetail', structureDetail);

  useEffect(() => {
    const currentValues = methods.getValues();

    if (
      structureDetail &&
      JSON.stringify(currentValues) !== JSON.stringify(structureDetail)
    ) {
      methods.reset(structureDetail);
    }
  }, [structureDetail]);

  return (
    <ScrollArea className="w-full min-h-svh">
      <div className="flex h-full w-full flex-col">
        <div className="mx-auto max-w-2xl w-full relative">
          <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Structure</h2>
          <Form {...methods}>
            <form className="grid grid-cols-2 gap-3">
              <Form.Field
                control={control}
                name={'title'}
                render={({ field }) => (
                  <Form.Item className="col-span-2">
                    <Form.Label>{'Name'}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'description'}
                render={({ field }) => (
                  <Form.Item className="col-span-2">
                    <Form.Label>{'description'}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} rows={10} className="resize-none" />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'supervisorId'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{'supervisor'}</Form.Label>
                    <Form.Control>
                      <AssignMember {...field} onValueChange={field.onChange} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'code'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{field.name}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'supervisor.details.operatorPhone'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{'Phone number'}</Form.Label>
                    <Form.Control>
                      <Input {...field} inputMode="numeric" pattern="[0-9]*" />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'supervisor.email'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{'Email'}</Form.Label>
                    <Form.Control>
                      <Input {...field} type="email" />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'coordinate.longitude'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{'longitude'}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={control}
                name={'coordinate.latitude'}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{'latitude'}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </ScrollArea>
  );
};

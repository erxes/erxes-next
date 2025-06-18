import {
  IconImageInPicture,
  IconPhotoScan,
  IconTrash,
} from '@tabler/icons-react';
import { Button, Card, Form, Input, Label, Tabs, Textarea } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { InputTextCounter } from '~/widgets/automations/modules/facebook/components/action/components/InputTextCounter';
import {
  TBotMessage,
  TMessageActionForm,
} from '~/widgets/automations/modules/facebook/components/action/states/replyMessageActionForm';

export const FacebookCardsMessage = ({
  message,
  control,
  index,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
}) => {
  const { cards = [] } = message || {};

  return (
    <Form.Field
      control={control}
      name={`messages.${index}.cards`}
      render={({ field }) => {
        const addPage = () => {
          field.onChange([
            ...cards,
            {
              _id: Math.random().toString(),
              label: `Page ${(cards?.length || 0) + 1}`,
            },
          ]);
        };

        const onChangeCardInfo = (id: string, newData: any) => {
          field.onChange(
            cards.map((card: any) =>
              card._id === id ? { ...card, ...newData } : card,
            ),
          );
        };

        return (
          <Form.Item className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Templates</Label>
              <div className="flex items-center gap-2">
                <InputTextCounter count={cards.length} limit={10} />
                <Button
                  variant="outline"
                  className="float-end"
                  onClick={addPage}
                >
                  + add page
                </Button>
              </div>
            </div>
            <Tabs defaultValue={cards?.length ? '1' : undefined}>
              <div className="overflow-x-auto p-2">
                <Tabs.List size="sm">
                  {cards.map((_, index) => (
                    <Tabs.Trigger size="sm" value={String(index)}>{`${
                      index + 1
                    } Page`}</Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>
              {cards.map((card: any, index) => (
                <Tabs.Content value={String(index)}>
                  <Card>
                    <Button className="float-end m-2" variant="destructive">
                      <IconTrash />
                    </Button>
                    <div className="px-4">
                      <div className="w-full h-36 rounded-lg flex flex-col gap-2 items-center justify-center border-2 border-dashed ">
                        <IconPhotoScan className="w-24 h-24 text-accent-foreground" />
                        <Label>
                          Drag and Drop, choose from your Media library or
                          upload
                        </Label>
                      </div>
                    </div>
                    <Card.Header className="grid gap-1 p-4">
                      <Card.Title>
                        <InputTextCounter
                          count={card.title?.length ?? 0}
                          limit={80}
                        />

                        <Input
                          value={card.title ?? ''}
                          onChange={(e) =>
                            onChangeCardInfo(card._id, {
                              title: e.currentTarget.value,
                            })
                          }
                          placeholder="Enter a title"
                        />
                      </Card.Title>
                      <Card.Description>
                        <InputTextCounter
                          count={card.subtitle?.length ?? 0}
                          limit={80}
                        />

                        <Textarea
                          value={card.subtitle ?? ''}
                          onChange={(e) =>
                            onChangeCardInfo(card._id, {
                              subtitle: e.currentTarget.value,
                            })
                          }
                          placeholder="Enter a subtitle"
                        />
                      </Card.Description>
                    </Card.Header>
                  </Card>
                </Tabs.Content>
              ))}
            </Tabs>
          </Form.Item>
        );
      }}
    />
  );
};

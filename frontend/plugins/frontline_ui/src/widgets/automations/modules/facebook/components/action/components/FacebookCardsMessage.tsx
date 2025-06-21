import { IconPhotoScan, IconTrash } from '@tabler/icons-react';
import { Button, Card, Form, Input, Label, Tabs, Textarea } from 'erxes-ui';
import { FacebookMessageProps } from '../types/messageActionForm';
import { TBotMessageCard } from '../states/replyMessageActionForm';
import { FacebookMessageButtonsGenerator } from './FacebookMessageButtonsGenerator';
import { InputTextCounter } from './InputTextCounter';

export const FacebookCardsMessage = ({
  message,
  control,
  index,
}: FacebookMessageProps) => {
  const { cards = [] } = message || {};

  return (
    <Form.Field
      control={control}
      name={`messages.${index}.cards`}
      render={({ field, fieldState }) => {
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
            cards.map((card: TBotMessageCard) =>
              card._id === id ? { ...card, ...newData } : card,
            ),
          );
        };

        const onRemoveCard = (cardIndex: number) => {
          field.onChange(cards.filter((_, index) => index !== cardIndex));
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
                  disabled={cards.length >= 10}
                  onClick={addPage}
                >
                  + add page
                </Button>
              </div>
            </div>
            <Tabs>
              <div className="overflow-x-auto p-2">
                <Tabs.List
                  size="sm"
                  defaultValue={cards?.length === 1 ? '1' : undefined}
                >
                  {cards.map((_, index) => (
                    <Tabs.Trigger size="sm" value={String(index)}>{`${
                      index + 1
                    } Page`}</Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>
              {cards.map((card, index) => (
                <Tabs.Content value={String(index)}>
                  <Card>
                    <Button
                      className="float-end m-2"
                      variant="destructive"
                      onClick={() => onRemoveCard(index)}
                    >
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
                      <FacebookMessageButtonsGenerator
                        limit={3}
                        buttons={card.buttons || []}
                        setButtons={(buttons) =>
                          onChangeCardInfo(card._id, {
                            buttons,
                          })
                        }
                      />
                    </Card.Header>
                  </Card>
                </Tabs.Content>
              ))}
            </Tabs>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};

import { AutomationAiAgentRecordTable } from '@/automations/components/settings/components/agents/components/AutomationAiAgentRecordTable';
import { AI_AGENT_KINDS } from '@/automations/components/settings/components/agents/constants/automationAiAgents';
import { Card, cn, Resizable, ScrollArea, useQueryState } from 'erxes-ui';

export const AutomationAiAgentsList = () => {
  const [kind, setKind] = useQueryState<string>('kind');

  const handleKind = (value: string | null) => {
    console.log(value, kind, value && kind === value ? null : value);
    setKind(value && kind === value ? null : value);
  };

  return (
    <Resizable.PanelGroup direction="horizontal" className="h-full w-full">
      <Resizable.Panel minSize={30} maxSize={50}>
        <ScrollArea>
          <div className="h-full w-full mx-auto max-w-3xl px-8 py-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2 px-1">
              <h1 className="text-lg font-semibold">Ai agents</h1>
              <span className="font-normal text-muted-foreground text-sm">
                Set up your AI agents and start automating conversations with
                your customers.
              </span>
            </div>
            <div
              className={`flex flex-wrap gap-4 ${
                kind ? 'justify-center' : 'justify-start'
              }`}
            >
              {AI_AGENT_KINDS.map(({ type, img, label }) => {
                return (
                  <Card
                    key={type}
                    className={cn(
                      'p-3 flex flex-col gap-2 rounded-lg  cursor-pointer',
                      {
                        'ring-2 ring-primary/60': kind === type,
                      },
                    )}
                    onClick={() => handleKind(type)}
                  >
                    <div className="flex gap-2 mb-2 items-center">
                      <div className="size-8 rounded overflow-hidden shadow-sm bg-background">
                        <img
                          src={img}
                          alt={type}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <h6 className="font-semibold text-sm self-center">
                        {label}
                      </h6>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </Resizable.Panel>
      <Resizable.Handle />

      {kind && (
        <Resizable.Panel defaultSize={70}>
          <AutomationAiAgentRecordTable />
        </Resizable.Panel>
      )}
    </Resizable.PanelGroup>
  );
};

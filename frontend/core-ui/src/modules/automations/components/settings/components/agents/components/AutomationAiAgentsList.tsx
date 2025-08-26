import { AI_AGENT_KINDS } from '@/automations/components/settings/components/agents/constants/automationAiAgents';
import { Card, ScrollArea } from 'erxes-ui';
import { Link } from 'react-router';

export const AutomationAiAgentsList = () => {
  return (
    <ScrollArea>
      <div className="h-full w-full mx-auto max-w-3xl px-8 py-5 flex flex-col gap-8">
        <div className="flex flex-col gap-2 px-1">
          <h1 className="text-lg font-semibold">Ai agents</h1>
          <span className="font-normal text-muted-foreground text-sm">
            Set up your AI agents and start automating conversations with your
            customers.
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_AGENT_KINDS.map(({ type, img, label }) => {
            return (
              <Card
                key={type}
                className="h-auto p-3 flex flex-col gap-2 rounded-lg"
              >
                <Link to={`/settings/automations/agents/${type}`}>
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
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

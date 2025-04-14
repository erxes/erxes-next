import {
  Bot,
  Building,
  CheckSquare,
  ChevronRight,
  Facebook,
  FormInput,
  MessageCircle,
  Rss,
  Search,
  ShoppingCart,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useDnD } from './DnDProvider';
// import {
//     type NodeProps,
//     Handle,
//     Position
// } from "reactflow"
import '@xyflow/react/dist/style.css';
import {
  Button,
  Card,
  Input,
  ScrollArea,
  Tabs,
  // TabsContent, TabsList, TabsTrigger
} from 'erxes-ui/components';
import { TablerIcon } from 'erxes-ui/icons';
const businessModules = {
  sales: {
    icon: <ShoppingCart className="h-4 w-4" />,
    color: 'emerald',
    label: 'Sales',
  },
  tasks: {
    icon: <CheckSquare className="h-4 w-4" />,
    color: 'blue',
    label: 'Tasks',
  },
  tickets: {
    icon: <Ticket className="h-4 w-4" />,
    color: 'amber',
    label: 'Tickets',
  },
  customers: {
    icon: <User className="h-4 w-4" />,
    color: 'indigo',
    label: 'Customers',
  },
  team: {
    icon: <Users className="h-4 w-4" />,
    color: 'purple',
    label: 'Team',
  },
  messaging: {
    icon: <MessageCircle className="h-4 w-4" />,
    color: 'sky',
    label: 'Messaging',
  },
  social: {
    icon: <Facebook className="h-4 w-4" />,
    color: 'blue',
    label: 'Social',
  },
  pos: {
    icon: <ShoppingCart className="h-4 w-4" />,
    color: 'green',
    label: 'POS',
  },
  forms: {
    icon: <FormInput className="h-4 w-4" />,
    color: 'violet',
    label: 'Forms',
  },
  company: {
    icon: <Building className="h-4 w-4" />,
    color: 'slate',
    label: 'Company',
  },
  feed: {
    icon: <Rss className="h-4 w-4" />,
    color: 'orange',
    label: 'EMX Feed',
  },
  bot: {
    icon: <Bot className="h-4 w-4" />,
    color: 'cyan',
    label: 'Bot',
  },
};

const triggerTemplates = [
  // Sales triggers
  {
    type: 'trigger',
    module: 'sales',
    label: 'Deal Created',
    description: 'Triggers when a new deal is created',
  },
  {
    type: 'trigger',
    module: 'sales',
    label: 'Deal Stage Changed',
    description: 'Triggers when a deal changes stage',
  },
  {
    type: 'trigger',
    module: 'sales',
    label: 'Deal Closed Won',
    description: 'Triggers when a deal is marked as won',
  },
  {
    type: 'trigger',
    module: 'sales',
    label: 'Deal Closed Lost',
    description: 'Triggers when a deal is marked as lost',
  },

  // Tasks triggers
  {
    type: 'trigger',
    module: 'tasks',
    label: 'Task Created',
    description: 'Triggers when a new task is created',
  },
  {
    type: 'trigger',
    module: 'tasks',
    label: 'Task Assigned',
    description: 'Triggers when a task is assigned',
  },
  {
    type: 'trigger',
    module: 'tasks',
    label: 'Task Completed',
    description: 'Triggers when a task is marked as complete',
  },

  // Tickets triggers
  {
    type: 'trigger',
    module: 'tickets',
    label: 'Ticket Created',
    description: 'Triggers when a new support ticket is created',
  },
  {
    type: 'trigger',
    module: 'tickets',
    label: 'Ticket Status Changed',
    description: 'Triggers when a ticket status changes',
  },
  {
    type: 'trigger',
    module: 'tickets',
    label: 'Ticket Resolved',
    description: 'Triggers when a ticket is resolved',
  },

  // Customers triggers
  {
    type: 'trigger',
    module: 'customers',
    label: 'Customer Created',
    description: 'Triggers when a new customer is created',
  },
  {
    type: 'trigger',
    module: 'customers',
    label: 'Customer Updated',
    description: 'Triggers when customer information is updated',
  },

  // Messaging triggers
  {
    type: 'trigger',
    module: 'messaging',
    label: 'Message Received',
    description: 'Triggers when a new message is received',
  },
  {
    type: 'trigger',
    module: 'messaging',
    label: 'Email Opened',
    description: 'Triggers when an email is opened',
  },

  // Social triggers
  {
    type: 'trigger',
    module: 'social',
    label: 'Facebook Comment',
    description: 'Triggers when a new Facebook comment is received',
  },

  // Forms triggers
  {
    type: 'trigger',
    module: 'forms',
    label: 'Form Submitted',
    description: 'Triggers when a form is submitted',
  },

  // Bot triggers
  {
    type: 'trigger',
    module: 'bot',
    label: 'Bot Conversation Started',
    description: 'Triggers when a bot conversation begins',
  },
  {
    type: 'trigger',
    module: 'bot',
    label: 'Bot Handoff Requested',
    description: 'Triggers when a bot requests human handoff',
  },
];

// Action templates organized by module
const actionTemplates = [
  // Email actions
  {
    type: 'action',
    module: 'messaging',
    label: 'Send Email',
    description: 'Sends an email to specified recipients',
  },
  {
    type: 'action',
    module: 'messaging',
    label: 'Send SMS',
    description: 'Sends an SMS message',
  },

  // Tasks actions
  {
    type: 'action',
    module: 'tasks',
    label: 'Create Task',
    description: 'Creates a new task',
  },
  {
    type: 'action',
    module: 'tasks',
    label: 'Update Task',
    description: 'Updates an existing task',
  },

  // Sales actions
  {
    type: 'action',
    module: 'sales',
    label: 'Create Deal',
    description: 'Creates a new deal',
  },
  {
    type: 'action',
    module: 'sales',
    label: 'Update Deal',
    description: 'Updates an existing deal',
  },
  {
    type: 'action',
    module: 'sales',
    label: 'Move Deal Stage',
    description: 'Moves a deal to a different stage',
  },

  // Customer actions
  {
    type: 'action',
    module: 'customers',
    label: 'Create Customer',
    description: 'Creates a new customer record',
  },
  {
    type: 'action',
    module: 'customers',
    label: 'Update Customer',
    description: 'Updates customer information',
  },
  {
    type: 'action',
    module: 'customers',
    label: 'Add Tag to Customer',
    description: 'Adds a tag to a customer',
  },

  // Tickets actions
  {
    type: 'action',
    module: 'tickets',
    label: 'Create Ticket',
    description: 'Creates a new support ticket',
  },
  {
    type: 'action',
    module: 'tickets',
    label: 'Update Ticket',
    description: 'Updates an existing ticket',
  },
  {
    type: 'action',
    module: 'tickets',
    label: 'Assign Ticket',
    description: 'Assigns a ticket to a team member',
  },

  // Bot actions
  {
    type: 'action',
    module: 'bot',
    label: 'Trigger Bot Response',
    description: 'Triggers a specific bot response',
  },

  // POS actions
  {
    type: 'action',
    module: 'pos',
    label: 'Create Order',
    description: 'Creates a new POS order',
  },

  // Team actions
  {
    type: 'action',
    module: 'team',
    label: 'Assign to Team Member',
    description: 'Assigns a task or record to a team member',
  },
  {
    type: 'action',
    module: 'team',
    label: 'Send Notification',
    description: 'Sends a notification to team members',
  },
];

export default () => {
  const [_, setType] = useDnD();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTemplates, setActiveTemplates] = useState(false);

  //   const onDragStart = (event: any, nodeType: any) => {
  //     setType && setType(nodeType);
  //     event.dataTransfer.effectAllowed = 'move';
  //   };
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeModule: string,
    nodeLabel: string,
    nodeDescription: string,
  ) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/module', nodeModule);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.setData(
      'application/reactflow/description',
      nodeDescription,
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter templates based on search term and active module
  const getFilteredTriggerTemplates = () => {
    return triggerTemplates.filter((template) => {
      const matchesSearch =
        searchTerm === '' ||
        template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModule =
        activeModule === null || template.module === activeModule;

      return matchesSearch && matchesModule;
    });
  };

  const getFilteredActionTemplates = () => {
    return actionTemplates.filter((template) => {
      const matchesSearch =
        searchTerm === '' ||
        template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModule =
        activeModule === null || template.module === activeModule;

      return matchesSearch && matchesModule;
    });
  };

  return (
    <aside className="border-r border-[#eee] p-[15px_10px] text-[12px] bg-[#fcfcfc]">
      <div className="w-80 border-l bg-white flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Workflow Components</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border-b p-2 flex flex-wrap gap-1">
          <Button
            variant={activeModule === null ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveModule(null)}
          >
            All
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            onClick={(s) => setActiveTemplates(!activeTemplates)}
          >
            <TablerIcon name={`IconDots`} />
          </Button>
          {activeTemplates &&
            Object.entries(businessModules).map(([key, value]) => (
              <Button
                key={key}
                variant={activeModule === key ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7"
                onClick={() =>
                  setActiveModule(activeModule === key ? null : key)
                }
              >
                {value.icon}
                <span className="ml-1">{value.label}</span>
              </Button>
            ))}
        </div>

        <Tabs defaultValue="triggers" className="flex-1 flex flex-col">
          <div className="px-4 pt-2">
            <Tabs.List className="w-full">
              <Tabs.Trigger value="triggers" className="flex-1">
                Triggers
              </Tabs.Trigger>
              <Tabs.Trigger value="actions" className="flex-1">
                Actions
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          <ScrollArea className="flex-1">
            <Tabs.Content value="triggers" className="p-4 mt-0">
              <div className="space-y-2">
                {getFilteredTriggerTemplates().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No triggers match your search
                  </div>
                ) : (
                  getFilteredTriggerTemplates().map((template, index) => {
                    const moduleInfo =
                      businessModules[
                        template.module as keyof typeof businessModules
                      ];
                    return (
                      <Card
                        key={index}
                        className="cursor-grab hover:bg-slate-50 transition-colors"
                        draggable
                        onDragStart={(event) =>
                          onDragStart(
                            event,
                            template.type,
                            template.module,
                            template.label,
                            template.description,
                          )
                        }
                      >
                        <Card.Header className="p-3">
                          <Card.Title className="text-sm font-medium flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-5 w-5 rounded-full bg-${moduleInfo.color}-100 text-${moduleInfo.color}-600 flex items-center justify-center`}
                              >
                                {moduleInfo.icon}
                              </div>
                              <span>{template.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Card.Title>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </Card.Header>
                      </Card>
                    );
                  })
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content value="actions" className="p-4 mt-0">
              <div className="space-y-2">
                {getFilteredActionTemplates().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No actions match your search
                  </div>
                ) : (
                  getFilteredActionTemplates().map((template, index) => {
                    const moduleInfo =
                      businessModules[
                        template.module as keyof typeof businessModules
                      ];
                    return (
                      <Card
                        key={index}
                        className="cursor-grab hover:bg-slate-50 transition-colors"
                        draggable
                        onDragStart={(event) =>
                          onDragStart(
                            event,
                            template.type,
                            template.module,
                            template.label,
                            template.description,
                          )
                        }
                      >
                        <Card.Header className="p-3">
                          <Card.Title className="text-sm font-medium flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-5 w-5 rounded-full bg-${moduleInfo.color}-100 text-${moduleInfo.color}-600 flex items-center justify-center`}
                              >
                                {moduleInfo.icon}
                              </div>
                              <span>{template.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Card.Title>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </Card.Header>
                      </Card>
                    );
                  })
                )}
              </div>
            </Tabs.Content>
          </ScrollArea>
        </Tabs>
      </div>
    </aside>
  );
};

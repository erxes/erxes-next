import { Handle, NodeProps, Position } from '@xyflow/react';
import {
  ChevronDown,
  Settings,
  Trash2,
  ChevronRight,
  Play,
  X,
  Save,
  Plus,
  ShoppingCart,
  Users,
  User,
  Ticket,
  CheckSquare,
  MessageCircle,
  Facebook,
  FormInput,
  Building,
  Rss,
  Bot,
  Search,
} from 'lucide-react';
import { useState } from 'react';
// import {
//     type NodeProps,
//     Handle,
//     Position
// } from "reactflow"
import '@xyflow/react/dist/style.css';
import {
  Badge,
  Button,
  Card,
  Dialog,
  Input,
  Switch,
  Textarea,
  Tabs,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Label } from '@radix-ui/react-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

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
  default: {
    icon: <Settings />,
    color: 'gray',
    label: 'Default',
  },
};

const TriggerNode = ({ data, selected, id }: NodeProps<any>) => {
  const [showConfig, setShowConfig] = useState(false);

  const getModuleInfo = () => {
    const module = data.module || 'default';
    return (
      businessModules[module as keyof typeof businessModules] ||
      businessModules.default
    );
  };

  const moduleInfo = getModuleInfo();

  return (
    <>
      <div
        className={cn(
          'rounded-md shadow-md bg-white w-[280px]',
          selected ? 'ring-2 ring-primary ring-offset-2' : '',
          'transition-all duration-200',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-600">
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full bg-${moduleInfo.color}-500 flex items-center justify-center`}
            >
              {moduleInfo.icon}
            </div>
            <span className="font-medium">{data.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {data.configurable && (
              <button
                onClick={() => setShowConfig(true)}
                className="p-1 rounded-md hover:bg-slate-600 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
            <button className="p-1 rounded-md hover:bg-slate-600 transition-colors">
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1 mb-2">
            <Badge
              variant="ghost"
              className={`bg-${moduleInfo.color}-900 text-${moduleInfo.color}-100 border-${moduleInfo.color}-700 text-xs`}
            >
              {moduleInfo.label}
            </Badge>
            <Badge
              variant="ghost"
              className="bg-slate-700 text-slate-200 border-slate-600 text-xs"
            >
              Trigger
            </Badge>
          </div>

          <div className="text-xs text-slate-300 mb-2">
            {data.description || 'Trigger node that starts the workflow'}
          </div>

          {data.config && Object.keys(data.config).length > 0 && (
            <div className="mt-2 bg-muted rounded p-2 text-xs border-slate-200 border">
              <div className="font-medium mb-1 text-slate-300">
                Configuration:
              </div>
              {Object.entries(data.config).map(([key, value]) => (
                <div key={key} className="flex justify-between text-slate-400">
                  <span>{key}:</span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          className={`w-3 h-3 bg-${moduleInfo.color}-500 border-2 border-white`}
          style={{ right: -6 }}
        />
      </div>

      {showConfig && (
        <Dialog open={showConfig} onOpenChange={setShowConfig}>
          <Dialog.Content className="sm:max-w-[600px]">
            <Dialog.Header>
              <Dialog.Title className="flex items-center gap-2">
                {moduleInfo.icon}
                <span>Configure {data.label}</span>
              </Dialog.Title>
            </Dialog.Header>

            <Tabs defaultValue="general">
              <Tabs.List className="grid w-full grid-cols-3">
                <Tabs.Trigger value="general">General</Tabs.Trigger>
                <Tabs.Trigger value="conditions">Conditions</Tabs.Trigger>
                <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="general" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue={data.label}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    defaultValue={data.description}
                    className="col-span-3 h-20"
                    placeholder="Describe what this trigger does"
                  />
                </div>

                {data.module === 'sales' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event" className="text-right">
                        Event
                      </Label>
                      <Select defaultValue="created">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created">Deal Created</SelectItem>
                          <SelectItem value="updated">Deal Updated</SelectItem>
                          <SelectItem value="stage_changed">
                            Stage Changed
                          </SelectItem>
                          <SelectItem value="closed_won">Closed Won</SelectItem>
                          <SelectItem value="closed_lost">
                            Closed Lost
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pipeline" className="text-right">
                        Pipeline
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select pipeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pipelines</SelectItem>
                          <SelectItem value="sales">Sales Pipeline</SelectItem>
                          <SelectItem value="marketing">
                            Marketing Pipeline
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'tasks' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event" className="text-right">
                        Event
                      </Label>
                      <Select defaultValue="created">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created">Task Created</SelectItem>
                          <SelectItem value="assigned">
                            Task Assigned
                          </SelectItem>
                          <SelectItem value="status_changed">
                            Status Changed
                          </SelectItem>
                          <SelectItem value="completed">
                            Task Completed
                          </SelectItem>
                          <SelectItem value="due_date">
                            Due Date Approaching
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="board" className="text-right">
                        Board
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Boards</SelectItem>
                          <SelectItem value="sales">Sales Tasks</SelectItem>
                          <SelectItem value="support">Support Tasks</SelectItem>
                          <SelectItem value="development">
                            Development Tasks
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'tickets' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event" className="text-right">
                        Event
                      </Label>
                      <Select defaultValue="created">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created">
                            Ticket Created
                          </SelectItem>
                          <SelectItem value="assigned">
                            Ticket Assigned
                          </SelectItem>
                          <SelectItem value="status_changed">
                            Status Changed
                          </SelectItem>
                          <SelectItem value="priority_changed">
                            Priority Changed
                          </SelectItem>
                          <SelectItem value="resolved">
                            Ticket Resolved
                          </SelectItem>
                          <SelectItem value="closed">Ticket Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'forms' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="form" className="text-right">
                        Form
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Forms</SelectItem>
                          <SelectItem value="contact">Contact Form</SelectItem>
                          <SelectItem value="lead">
                            Lead Generation Form
                          </SelectItem>
                          <SelectItem value="feedback">
                            Feedback Form
                          </SelectItem>
                          <SelectItem value="support">
                            Support Request Form
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'messaging' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="channel" className="text-right">
                        Channel
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Channels</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="chat">Live Chat</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event" className="text-right">
                        Event
                      </Label>
                      <Select defaultValue="received">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="received">
                            Message Received
                          </SelectItem>
                          <SelectItem value="sent">Message Sent</SelectItem>
                          <SelectItem value="read">Message Read</SelectItem>
                          <SelectItem value="replied">
                            Message Replied
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="active" defaultChecked />
                    <Label htmlFor="active">Enable this trigger</Label>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="conditions" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Trigger Conditions</h4>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Add Condition
                    </Button>
                  </div>

                  <Card>
                    <Card.Content className="p-3">
                      <div className="flex items-center gap-2">
                        <Select defaultValue="equals">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not_equals">
                              Not Equals
                            </SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater_than">
                              Greater Than
                            </SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Value" className="flex-1" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <div className="flex items-center gap-2">
                    <hr className="flex-1" />
                    <span className="text-xs text-muted-foreground">AND</span>
                    <hr className="flex-1" />
                  </div>

                  <Card>
                    <Card.Content className="p-3">
                      <div className="flex items-center gap-2">
                        <Select defaultValue="contains">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not_equals">
                              Not Equals
                            </SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater_than">
                              Greater Than
                            </SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Value" className="flex-1" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              </Tabs.Content>

              <Tabs.Content value="advanced" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="debounce" className="text-right">
                    Debounce (sec)
                  </Label>
                  <Input
                    id="debounce"
                    type="number"
                    defaultValue="0"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="retry" className="text-right">
                    Retry Policy
                  </Label>
                  <Select defaultValue="none">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select retry policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Retry</SelectItem>
                      <SelectItem value="immediate">
                        Immediate (3 attempts)
                      </SelectItem>
                      <SelectItem value="incremental">
                        Incremental Backoff
                      </SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timeout" className="text-right">
                    Timeout (sec)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    defaultValue="30"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="data-mapping" className="text-right pt-2">
                    Data Mapping
                  </Label>
                  <Textarea
                    id="data-mapping"
                    className="col-span-3 h-20 font-mono text-xs"
                    placeholder='{"user": "$.user.id", "timestamp": "$.created_at"}'
                    defaultValue=""
                  />
                </div>
              </Tabs.Content>
            </Tabs>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowConfig(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowConfig(false)}>
                Save Configuration
              </Button>
            </div>
          </Dialog.Content>
        </Dialog>
      )}
    </>
  );
};

export default TriggerNode;

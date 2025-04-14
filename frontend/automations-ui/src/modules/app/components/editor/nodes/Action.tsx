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
  Textarea,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
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

const ActionNode = ({ data, selected, id }: NodeProps<any>) => {
  const [showConfig, setShowConfig] = useState(false);

  const getModuleInfo = () => {
    const module = data.module || 'default';
    const selectedModules =
      businessModules[module as keyof typeof businessModules];
    return selectedModules || businessModules.default;
  };

  const moduleInfo = getModuleInfo();

  return (
    <>
      <div
        className={cn(
          'rounded-md shadow-md bg-white border border-slate-200 w-[280px]',
          selected ? 'ring-2 ring-primary ring-offset-2' : '',
          'transition-all duration-200',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full bg-${moduleInfo.color}-100 text-${moduleInfo.color}-600 flex items-center justify-center`}
            >
              {moduleInfo.icon}
            </div>
            <span className="font-medium text-slate-800">{data.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {data.configurable && (
              <button
                onClick={() => setShowConfig(true)}
                className="p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-600" />
              </button>
            )}
            <button className="p-1 rounded-md hover:bg-slate-100 transition-colors">
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1 mb-2">
            <Badge
              variant="ghost"
              className={`bg-${moduleInfo.color}-100 text-${moduleInfo.color}-700 border-${moduleInfo.color}-200 text-xs`}
            >
              {moduleInfo.label}
            </Badge>
            <Badge
              variant="ghost"
              className="bg-slate-100 text-slate-700 border-slate-200 text-xs"
            >
              Action
            </Badge>
          </div>

          <div className="text-xs text-slate-500 mb-2">
            {data.description || 'Action node that performs an operation'}
          </div>

          {data.config && Object.keys(data.config).length > 0 && (
            <div className="mt-2 bg-slate-50 rounded p-2 text-xs border border-slate-200">
              <div className="font-medium mb-1 text-slate-700">
                Configuration:
              </div>
              {Object.entries(data.config).map(([key, value]) => (
                <div key={key} className="flex justify-between text-slate-600">
                  <span>{key}:</span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 bg-${moduleInfo.color}-400 border-2 border-white`}
          style={{ left: -6 }}
        />

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          className={`w-3 h-3 bg-${moduleInfo.color}-400 border-2 border-white`}
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="data">Data Mapping</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 py-4">
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
                    placeholder="Describe what this action does"
                  />
                </div>

                {data.module === 'email' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recipient" className="text-right">
                        Recipient
                      </Label>
                      <Input
                        id="recipient"
                        placeholder="email@example.com"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Email subject"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="template" className="text-right">
                        Template
                      </Label>
                      <Select defaultValue="default">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">
                            Default Template
                          </SelectItem>
                          <SelectItem value="notification">
                            Notification
                          </SelectItem>
                          <SelectItem value="welcome">Welcome Email</SelectItem>
                          <SelectItem value="custom">
                            Custom Template
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'tasks' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Task title"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignee" className="text-right">
                        Assignee
                      </Label>
                      <Select defaultValue="current">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current User</SelectItem>
                          <SelectItem value="owner">Deal Owner</SelectItem>
                          <SelectItem value="manager">Team Manager</SelectItem>
                          <SelectItem value="custom">Custom User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="due-date" className="text-right">
                        Due Date
                      </Label>
                      <Select defaultValue="tomorrow">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select due date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="next_week">Next Week</SelectItem>
                          <SelectItem value="custom">Custom Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.module === 'customers' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="action-type" className="text-right">
                        Action Type
                      </Label>
                      <Select defaultValue="create">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="create">
                            Create Customer
                          </SelectItem>
                          <SelectItem value="update">
                            Update Customer
                          </SelectItem>
                          <SelectItem value="tag">Add Tag</SelectItem>
                          <SelectItem value="segment">
                            Add to Segment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="customer-source" className="text-right">
                        Source
                      </Label>
                      <Select defaultValue="automation">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automation">Automation</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="import">Import</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="error-handling" className="text-right">
                    On Error
                  </Label>
                  <Select defaultValue="continue">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select error handling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continue">
                        Continue Workflow
                      </SelectItem>
                      <SelectItem value="stop">Stop Workflow</SelectItem>
                      <SelectItem value="retry">Retry (3 times)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Input Data Mapping</h4>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Add Mapping
                    </Button>
                  </div>

                  <Card>
                    <Card.Content className="p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Target Field"
                          className="flex-1"
                          defaultValue="customer.email"
                        />
                        <span className="text-sm">=</span>
                        <Input
                          placeholder="Source Expression"
                          className="flex-1"
                          defaultValue="$.trigger.email"
                        />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Target Field"
                          className="flex-1"
                          defaultValue="customer.name"
                        />
                        <span className="text-sm">=</span>
                        <Input
                          placeholder="Source Expression"
                          className="flex-1"
                          defaultValue="$.trigger.name"
                        />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <div className="flex justify-between items-center mt-6">
                    <h4 className="text-sm font-medium">Output Data Mapping</h4>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Add Output
                    </Button>
                  </div>

                  <Card>
                    <Card.Content className="p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Output Field"
                          className="flex-1"
                          defaultValue="customer_id"
                        />
                        <span className="text-sm">=</span>
                        <Input
                          placeholder="Expression"
                          className="flex-1"
                          defaultValue="$.result.id"
                        />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 py-4">
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

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="custom-code" className="text-right pt-2">
                    Custom Code
                  </Label>
                  <Textarea
                    id="custom-code"
                    className="col-span-3 h-20 font-mono text-xs"
                    placeholder="// Custom JavaScript code"
                    defaultValue=""
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logging" className="text-right">
                    Logging Level
                  </Label>
                  <Select defaultValue="info">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select logging level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error Only</SelectItem>
                      <SelectItem value="warn">Warning & Error</SelectItem>
                      <SelectItem value="info">Info & Above</SelectItem>
                      <SelectItem value="debug">Debug (Verbose)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
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

export default ActionNode;

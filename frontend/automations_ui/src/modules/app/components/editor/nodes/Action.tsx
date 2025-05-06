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
  Tabs,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
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
    </>
  );
};

export default ActionNode;

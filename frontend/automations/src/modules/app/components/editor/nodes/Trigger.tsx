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
import { memo, useState } from 'react';
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
import { Icon12Hours, IconSunElectricity } from '@tabler/icons-react';

const TriggerNode = ({ data, selected, id }: NodeProps) => {
  return (
    <div className="flex flex-col">
      <div className="w-1/4 ml-1 bg-primary/10 text-primary text-center px-2 py-1 rounded-t-md">
        <p className="font-medium font-bold">Trigger</p>
      </div>
      <div
        className={cn(
          'rounded-md shadow-md bg-background w-[280px] relative',
          selected ? 'ring-2 ring-primary ring-offset-2' : '',
          'transition-all duration-200',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-200 gap-8">
          <div className="flex items-center gap-2 text-primary">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center`}
            >
              <IconSunElectricity />
            </div>
            <div>
              <p className="font-medium ">{`New Customer created`}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md hover:bg-slate-100 transition-colors">
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
        <div className="p-3">
          <span className="text-xs text-accent-foreground">
            Start with a blank workflow that enralls and is triggered off team
            members
          </span>
        </div>

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="!w-4 !h-4 -z-10 !bg-primary !border-white border-2 rounded-full"
        />
      </div>
    </div>
  );
};

export default memo(TriggerNode);

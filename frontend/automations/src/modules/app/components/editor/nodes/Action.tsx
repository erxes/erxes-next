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
import { IconAdjustmentsAlt, IconMessage } from '@tabler/icons-react';

const ActionNode = ({ data, selected, id }: NodeProps<any>) => {
  return (
    <div className="flex flex-col">
      <div className="w-1/4 ml-1 bg-success/10 text-success text-center px-2 py-1 rounded-t-md">
        <p className="font-medium font-bold">Action</p>
      </div>
      <div
        className={cn(
          'rounded-md shadow-md bg-white border border-muted w-[280px]',
          selected ? 'ring-2 ring-success ring-offset-2' : '',
          'transition-all duration-200',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-muted">
          <div className="flex items-center gap-2 text-success/90">
            <div
              className={`h-6 w-6 rounded-full bg-success/10  flex items-center justify-center`}
            >
              <IconMessage className="w-4 h-4" />
            </div>
            <span className="font-medium">{data.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant={'ghost'}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="p-3 border-b border-muted">
          <span className="text-xs text-accent-foreground font-medium">
            {data.description}
          </span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 text-success/90">
            <IconAdjustmentsAlt className="w-4 h-4" />
            <p className="text-sm font-semibold">Configuration</p>
          </div>
          <div className="rounded border bg-muted">dasds</div>
        </div>

        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Left}
          className={`!w-4 !h-4 -z-10 !bg-success `}
        />

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          className={`!w-4 !h-4 -z-10 !bg-success `}
        />
      </div>
    </div>
  );
};

export default memo(ActionNode);

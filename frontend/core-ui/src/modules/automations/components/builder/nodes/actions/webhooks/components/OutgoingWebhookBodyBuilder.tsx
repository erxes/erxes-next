import { JSON_PROPERTY_TYPE_OPTIONS } from '@/automations/components/builder/nodes/actions/webhooks/constants/outgoingWebhookForm';
import {
  defaultPropertyValueForType,
  deleteAtJSONProperty,
  detectJSONPropertyValueType,
  setAtJSONProperty,
} from '@/automations/components/builder/nodes/actions/webhooks/utils/outgoingWebhookBodyBuilder';
import {
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Button, Input, Label, Select, toast } from 'erxes-ui';
import { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PlaceHolderInput } from 'ui-modules/modules/automations/components/PlaceHolderInput';

type Path = Array<string | number>;

export function OutgoingWebhookBodyBuilder({ name }: { name: string }) {
  const { watch, getValues, setValue } = useFormContext();
  const value = watch(name);

  const [rawOpen, setRawOpen] = useState(false);
  const [rawValue, setRawValue] = useState<string>(() => {
    try {
      return JSON.stringify(value ?? {}, null, 2);
    } catch {
      return '';
    }
  });

  const onOpenRaw = () => {
    setRawValue(() => {
      try {
        return JSON.stringify(getValues()[name] ?? {}, null, 2);
      } catch {
        return '';
      }
    });
    setRawOpen((p) => !p);
  };

  const onApplyRaw = () => {
    try {
      const parsed = JSON.parse(rawValue || '{}');
      setValue(name, parsed, { shouldDirty: true, shouldTouch: true });
      onOpenRaw();
    } catch (e) {
      toast({ title: 'Something went wrong', description: e.message });
    }
  };

  return (
    <div className="space-y-2">
      <TreeNode name={name} path={[name]} value={value} />
      <div className="mt-2 border rounded-md p-2 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-muted-foreground">JSON summary</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onOpenRaw}>
              {rawOpen ? 'Hide raw' : 'Edit raw'}
            </Button>
            {rawOpen ? (
              <Button size="sm" onClick={onApplyRaw}>
                Apply
              </Button>
            ) : null}
          </div>
        </div>
        {rawOpen ? (
          <textarea
            className="w-full h-40 text-[11px] font-mono p-2 rounded border bg-background"
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
          />
        ) : (
          <pre className="text-[11px] leading-4 overflow-auto max-h-56 font-mono whitespace-pre-wrap">
            {(() => {
              try {
                return JSON.stringify(value ?? {}, null, 2);
              } catch {
                return '';
              }
            })()}
          </pre>
        )}
      </div>
    </div>
  );
}

const TreeNode = memo(function TreeNode({
  name,
  path,
  value,
  additionalContent,
}: {
  name: string;
  path: Path;
  value: any;
  additionalContent?: React.ReactNode;
}) {
  const { getValues, setValue } = useFormContext();
  const type = useMemo(() => detectJSONPropertyValueType(value), [value]);
  const [expanded, setExpanded] = useState(false);

  const applyNode = useCallback(
    (next: any) => {
      const root = getValues();
      const newRoot = setAtJSONProperty(root, path, next);
      setValue(name, newRoot[name], { shouldDirty: true, shouldTouch: true });
    },
    [getValues, name, path, setValue],
  );

  const onChangeType = useCallback(
    (t: (typeof JSON_PROPERTY_TYPE_OPTIONS)[number]) =>
      applyNode(defaultPropertyValueForType(t)),
    [applyNode],
  );

  const summary = useMemo(() => {
    if (type === 'object') return `{ ${Object.keys(value || {}).length} keys }`;
    if (type === 'array') return `[ ${(value as any[])?.length ?? 0} items ]`;
    if (type === 'null') return 'null';
    if (type === 'boolean') return String(Boolean(value));
    return String(value ?? '');
  }, [type, value]);

  return (
    <div className="border rounded-md p-2 bg-mut`ed/40">
      <div className="flex items-center gap-2">
        {(type === 'object' || type === 'array') && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <IconChevronDown className="h-3 w-3" />
            ) : (
              <IconChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        {additionalContent}
        <Select value={type} onValueChange={onChangeType}>
          <Select.Trigger className="h-7 w-36">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {JSON_PROPERTY_TYPE_OPTIONS.map((t) => (
              <Select.Item key={t} value={t}>
                {t}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className="text-xs text-muted-foreground truncate flex-1">
          {summary}
        </div>
        {path.length > 1 ? <RemoveButton name={name} path={path} /> : null}
      </div>

      {expanded && (
        <div className="mt-2 pl-3 border-l">
          {type === 'string' || type === 'expression' ? (
            <PlaceHolderInput
              propertyType="core:automation"
              value={value ?? ''}
              onChange={(v) => applyNode(v)}
            />
          ) : null}
          {type === 'number' ? (
            <Input
              type="number"
              value={value ?? 0}
              onChange={(e) => applyNode(Number(e.target.value))}
              className="font-mono"
            />
          ) : null}
          {type === 'boolean' ? (
            <Select
              value={String(!!value)}
              onValueChange={(v) => applyNode(v === 'true')}
            >
              <Select.Trigger className="w-28">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="true">true</Select.Item>
                <Select.Item value="false">false</Select.Item>
              </Select.Content>
            </Select>
          ) : null}
          {type === 'null' ? (
            <div className="text-xs text-muted-foreground">null</div>
          ) : null}

          {type === 'object' && expanded ? (
            <ObjectContainer name={name} path={path} value={value ?? {}} />
          ) : null}
          {type === 'array' && expanded ? (
            <ArrayContainer
              name={name}
              path={path}
              value={Array.isArray(value) ? value : []}
            />
          ) : null}
        </div>
      )}
    </div>
  );
});

const RemoveButton = memo(function RemoveButton({
  name,
  path,
}: {
  name: string;
  path: Path;
}) {
  const { getValues, setValue } = useFormContext();
  const onRemove = () => {
    const root = getValues();
    const next = deleteAtJSONProperty(root, path);
    setValue(name, next[name], { shouldDirty: true, shouldTouch: true });
  };
  return (
    <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Remove">
      <IconTrash />
    </Button>
  );
});

const ObjectContainer = memo(function ObjectContainer({
  name,
  path,
  value,
}: {
  name: string;
  path: Path;
  value: Record<string, any>;
}) {
  const { getValues, setValue } = useFormContext();
  const [newKey, setNewKey] = useState('');

  const apply = useCallback(
    (next: Record<string, any>) => {
      const root = getValues();
      const newRoot = setAtJSONProperty(root, path, next);
      setValue(name, newRoot[name], { shouldDirty: true, shouldTouch: true });
    },
    [getValues, name, path, setValue],
  );

  const addField = useCallback(() => {
    if (!newKey) return;
    apply({ ...(value ?? {}), [newKey]: '' });
    setNewKey('');
  }, [apply, newKey, value]);

  const renameKey = useCallback(
    (oldKey: string, nextKey: string) => {
      if (!nextKey || nextKey === oldKey) return;
      const { [oldKey]: oldVal, ...rest } = value ?? {};
      apply({ ...rest, [nextKey]: oldVal });
    },
    [apply, value],
  );

  const removeKey = useCallback(
    (key: string) => {
      const { [key]: _rm, ...rest } = value ?? {};
      apply(rest);
    },
    [apply, value],
  );

  const entries = useMemo(() => Object.entries(value ?? {}), [value]);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {entries.map(([k, v]) => (
          <TreeNode
            key={k}
            name={name}
            path={[...path, k]}
            value={v}
            additionalContent={
              <Input
                defaultValue={k}
                onBlur={(e) => renameKey(k, e.target.value)}
                className="h-8"
              />
            }
          />
        ))}
        {entries.length === 0 ? (
          <div className="text-xs text-muted-foreground">Empty object</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add field key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="h-8"
        />
        <Button variant="outline" size="sm" onClick={addField}>
          <IconPlus className="mr-1 h-3 w-3" /> Add
        </Button>
      </div>
    </div>
  );
});

const ArrayContainer = memo(function ArrayContainer({
  name,
  path,
  value,
}: {
  name: string;
  path: Path;
  value: any[];
}) {
  const { getValues, setValue } = useFormContext();

  const apply = useCallback(
    (next: any[]) => {
      const root = getValues();
      const newRoot = setAtJSONProperty(root, path, next);
      setValue(name, newRoot[name], { shouldDirty: true, shouldTouch: true });
    },
    [getValues, name, path, setValue],
  );

  const addItem = useCallback(
    () => apply([...(value ?? []), '']),
    [apply, value],
  );
  const removeItem = useCallback(
    (idx: number) =>
      apply([...(value ?? []).slice(0, idx), ...(value ?? []).slice(idx + 1)]),
    [apply, value],
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={addItem} className="">
          <IconPlus className="mr-1 h-3 w-3" /> Add item
        </Button>
      </div>
      <div className="space-y-2">
        {(value ?? []).map((item, idx) => (
          <TreeNode name={name} path={[...path, idx]} value={item} />
        ))}
        {(value ?? []).length === 0 ? (
          <div className="text-xs text-muted-foreground">Empty array</div>
        ) : null}
      </div>
    </div>
  );
});

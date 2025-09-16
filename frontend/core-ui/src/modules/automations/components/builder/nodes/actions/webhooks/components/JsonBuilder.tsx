import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, Label, Select } from 'erxes-ui';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Path = Array<string | number>;

function joinPath(path: Path): string {
  return path
    .map((seg) => (typeof seg === 'number' ? String(seg) : seg))
    .join('.')
    .replace(/\.\[(\d+)\]/g, '.$1');
}

function getAt(obj: any, path: Path): any {
  return path.reduce((acc, seg) => (acc == null ? acc : acc[seg as any]), obj);
}

function setAt(obj: any, path: Path, value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj ?? {}) };
  clone[head as any] = setAt(clone[head as any], rest, value);
  return clone;
}

function deleteAt(obj: any, path: Path): any {
  if (path.length === 0) return undefined;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    if (Array.isArray(obj)) {
      const idx = Number(head);
      return [...obj.slice(0, idx), ...obj.slice(idx + 1)];
    }
    const clone = { ...(obj ?? {}) } as Record<string, any>;
    delete clone[head as any];
    return clone;
  }
  const child = deleteAt(obj?.[head as any], rest);
  if (Array.isArray(obj)) {
    const idx = Number(head);
    const arr = [...obj];
    arr[idx] = child;
    return arr;
  }
  return { ...(obj ?? {}), [head as any]: child };
}

function defaultForType(type: string): any {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'null':
      return null;
    case 'array':
      return [];
    case 'object':
      return {};
    case 'expression':
      return '';
    default:
      return '';
  }
}

function detectType(
  value: any,
):
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object'
  | 'expression' {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

const TYPE_OPTIONS = [
  'string',
  'number',
  'boolean',
  'null',
  'object',
  'array',
  'expression',
] as const;

export function JsonBuilderRoot({ name }: { name: string }) {
  const { watch } = useFormContext();
  const value = watch(name);
  return (
    <div className="space-y-2">
      <JsonNode path={[name]} value={value} />
    </div>
  );
}

function JsonNode({ path, value }: { path: Path; value: any }) {
  const { getValues, setValue } = useFormContext();
  const type = useMemo(() => detectType(value), [value]);
  const initialCollapsed = useMemo(() => {
    if (Array.isArray(value)) return value.length > 3;
    if (value && typeof value === 'object')
      return Object.keys(value).length > 3;
    return false;
  }, [value]);
  const [expanded, setExpanded] = useState(!initialCollapsed);

  const setNode = useCallback(
    (next: any) => {
      const root = getValues();
      const newRoot = setAt(root, path, next);
      setValue(joinPath([path[0] as string]), newRoot[path[0] as string], {
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [getValues, path, setValue],
  );

  const onChangeType = (t: (typeof TYPE_OPTIONS)[number]) =>
    setNode(defaultForType(t));

  const summary = useMemo(() => {
    if (type === 'object') return `{ ${Object.keys(value || {}).length} keys }`;
    if (type === 'array')
      return `[ ${Array.isArray(value) ? value.length : 0} items ]`;
    if (type === 'null') return 'null';
    if (type === 'boolean') return String(Boolean(value));
    return String(value ?? '');
  }, [type, value]);

  return (
    <div className="border rounded-md p-2 bg-muted/40">
      <div className="flex items-center gap-2">
        {(type === 'object' || type === 'array') && (
          <button
            type="button"
            className="text-xs w-5"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▾' : '▸'}
          </button>
        )}
        <Select value={type} onValueChange={onChangeType}>
          <Select.Trigger className="h-7 w-36">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {TYPE_OPTIONS.map((t) => (
              <Select.Item key={t} value={t}>
                {t}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className="text-xs text-muted-foreground truncate flex-1">
          {summary}
        </div>
      </div>

      <div className="mt-2 pl-3 border-l">
        {type === 'string' || type === 'expression' ? (
          <Input
            value={value ?? ''}
            onChange={(e) => setNode(e.target.value)}
            className="font-mono"
            placeholder={type === 'expression' ? 'Enter expression' : 'Text'}
          />
        ) : null}
        {type === 'number' ? (
          <Input
            type="number"
            value={value ?? 0}
            onChange={(e) => setNode(Number(e.target.value))}
            className="font-mono"
          />
        ) : null}
        {type === 'boolean' ? (
          <Select
            value={String(!!value)}
            onValueChange={(v) => setNode(v === 'true')}
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
          <ObjectEditor path={path} value={value ?? {}} />
        ) : null}
        {type === 'array' && expanded ? (
          <ArrayEditor path={path} value={Array.isArray(value) ? value : []} />
        ) : null}
      </div>
    </div>
  );
}

function ObjectEditor({
  path,
  value,
}: {
  path: Path;
  value: Record<string, any>;
}) {
  const { getValues, setValue } = useFormContext();
  const entries = Object.entries(value ?? {});
  const [newKey, setNewKey] = useState('');

  const updateRoot = (nextObj: Record<string, any>) => {
    const root = getValues();
    const newRoot = setAt(root, path, nextObj);
    setValue(joinPath([path[0] as string]), newRoot[path[0] as string], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addField = () => {
    if (!newKey) return;
    updateRoot({ ...(value ?? {}), [newKey]: '' });
    setNewKey('');
  };

  const renameKey = (oldKey: string, nextKey: string) => {
    if (!nextKey || nextKey === oldKey) return;
    const { [oldKey]: oldVal, ...rest } = value ?? {};
    updateRoot({ ...rest, [nextKey]: oldVal });
  };

  const removeKey = (key: string) => {
    const { [key]: _rm, ...rest } = value ?? {};
    updateRoot(rest);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add field key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="h-8"
        />
        <Button variant="outline" size="sm" onClick={addField}>
          <IconPlus className="mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="border rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <Input
                defaultValue={k}
                onBlur={(e) => renameKey(k, e.target.value)}
                className="h-8"
              />
              <Button variant="ghost" size="sm" onClick={() => removeKey(k)}>
                <IconTrash />
              </Button>
            </div>
            <div className="pl-4">
              <JsonNode path={[...path, k]} value={v} />
            </div>
          </div>
        ))}
        {entries.length === 0 ? (
          <div className="text-xs text-muted-foreground">Empty object</div>
        ) : null}
      </div>
    </div>
  );
}

function ArrayEditor({ path, value }: { path: Path; value: any[] }) {
  const { getValues, setValue } = useFormContext();

  const updateRoot = (nextArr: any[]) => {
    const root = getValues();
    const newRoot = setAt(root, path, nextArr);
    setValue(joinPath([path[0] as string]), newRoot[path[0] as string], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addItem = () => updateRoot([...(value ?? []), '']);
  const removeItem = (idx: number) =>
    updateRoot([
      ...(value ?? []).slice(0, idx),
      ...(value ?? []).slice(idx + 1),
    ]);

  return (
    <div className="space-y-2">
      <Button variant="outline" size="sm" onClick={addItem}>
        <IconPlus className="mr-1" /> Add item
      </Button>
      <div className="space-y-2">
        {(value ?? []).map((item, idx) => (
          <div key={idx} className="border rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Index {idx}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                <IconTrash />
              </Button>
            </div>
            <div className="pl-4">
              <JsonNode path={[...path, idx]} value={item} />
            </div>
          </div>
        ))}
        {(value ?? []).length === 0 ? (
          <div className="text-xs text-muted-foreground">Empty array</div>
        ) : null}
      </div>
    </div>
  );
}

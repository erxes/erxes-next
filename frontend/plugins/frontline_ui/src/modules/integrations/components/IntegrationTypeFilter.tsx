import {
  SelectIntegrationTypeContext,
  useSelectIntegrationTypeContext,
} from '@/integrations/context/SelectIntegrationTypeContext';
import { useUsedIntegrationTypes } from '@/integrations/hooks/useUsedIntegrationTypes';
import { IIntegrationType } from '@/integrations/types/Integration';
import { IconPlug } from '@tabler/icons-react';
import {
  Filter,
  Command,
  Combobox,
  useQueryState,
  useFilterContext,
  Popover,
} from 'erxes-ui';
import { useState } from 'react';

const SelectIntegrationTypeProvider = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}) => {
  const [selectedIntegrationTypeId, setSelectedIntegrationTypeId] = useState<
    string | null
  >(value || null);

  const onSelect = (integrationType: string) => {
    setSelectedIntegrationTypeId(
      integrationType === selectedIntegrationTypeId ? null : integrationType,
    );
    onValueChange?.(
      integrationType === selectedIntegrationTypeId ? null : integrationType,
    );
  };

  return (
    <SelectIntegrationTypeContext.Provider
      value={{
        selectedIntegrationTypeId,
        onSelect,
      }}
    >
      {children}
    </SelectIntegrationTypeContext.Provider>
  );
};

export const ChooseIntegrationTypeContent = () => {
  const { integrationTypes } = useUsedIntegrationTypes();
  const { selectedIntegrationTypeId, onSelect } =
    useSelectIntegrationTypeContext();

  return (
    <Command>
      <Command.Input placeholder="Filter" focusOnMount />
      <Command.List>
        <Combobox.Empty />
        {integrationTypes?.map((integrationType) => (
          <Command.Item
            key={integrationType._id}
            value={integrationType._id}
            onSelect={() => onSelect(integrationType._id)}
          >
            {integrationType.name}
            <Combobox.Check
              checked={integrationType._id === selectedIntegrationTypeId}
            />
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export const IntegrationTypeFilterItem = () => {
  return (
    <Filter.Item value="integrationType">
      <IconPlug />
      Integration Type
    </Filter.Item>
  );
};

export const IntegrationTypeFilterView = () => {
  const [integrationTypeId, setIntegrationTypeId] =
    useQueryState<string>('integrationType');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="integrationType">
      <SelectIntegrationTypeProvider
        value={integrationTypeId}
        onValueChange={(value) => {
          setIntegrationTypeId(value as string);
          resetFilterState();
        }}
      >
        <ChooseIntegrationTypeContent />
      </SelectIntegrationTypeProvider>
    </Filter.View>
  );
};

export const IntegrationTypeValue = () => {
  const { integrationTypes, loading } = useUsedIntegrationTypes();
  const { selectedIntegrationTypeId } = useSelectIntegrationTypeContext();

  return (
    <Combobox.Value
      value={
        integrationTypes?.find(
          (integrationType) =>
            integrationType._id === selectedIntegrationTypeId,
        )?.name
      }
      loading={loading}
      placeholder="Select integration type"
    />
  );
};

export const IntegrationTypeFilterBar = ({
  iconOnly,
}: {
  iconOnly?: boolean;
}) => {
  const [integrationTypeId, setIntegrationTypeId] =
    useQueryState<string>('integrationType');
  const { resetFilterState } = useFilterContext();

  if (!integrationTypeId) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconPlug />
        {!iconOnly && 'Integration Type'}
      </Filter.BarName>
      <SelectIntegrationTypeProvider
        value={integrationTypeId}
        onValueChange={(value) => {
          setIntegrationTypeId(value as string);
          resetFilterState();
        }}
      >
        <Popover>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="integrationType">
              <IntegrationTypeValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <ChooseIntegrationTypeContent />
          </Combobox.Content>
        </Popover>
      </SelectIntegrationTypeProvider>
      <Filter.BarClose filterKey="integrationType" />
    </Filter.BarItem>
  );
};

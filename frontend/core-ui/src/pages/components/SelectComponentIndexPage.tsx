import {
  SelectBranches,
  SelectCompanies, //
  SelectCustomers, //
  SelectProducts,
  SelectMember, //
  SelectTags, //
} from 'ui-modules';
import { PageContainer, Switch, Tooltip } from 'erxes-ui';
import { useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import React from 'react';

interface SelectContainerProps {
  children: React.ReactElement<{ mode?: 'single' | 'multiple' }>;
  label?: string;
  description?: string;
}

const SelectContainer = ({
  children,
  label,
  description,
}: SelectContainerProps) => {
  const [isSingleMode, setIsSingleMode] = useState(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const child = React.Children.only(children);
  const childWithMode = React.cloneElement(child, {
    mode: isSingleMode ? 'single' : 'multiple',
  });

  return (
    <div className="rounded-lg shadow-sm p-6 flex flex-col gap-4 md:max-w-[17rem]">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-foreground">{label}</h3>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <Tooltip.Trigger>
              <Switch
                checked={!isSingleMode}
                onCheckedChange={(checked) => {
                  setIsSingleMode(!checked);
                  setIsTooltipOpen(true);
                }}
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{isSingleMode ? 'single' : 'multiple'} mode</p>
            </Tooltip.Content>
          </Tooltip>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-full">{childWithMode}</div>
    </div>
  );
};

const SelectContainerGroup = ({
  children,
  label,
  description,
}: {
  children: React.ReactNode;
  label: string;
  description?: string;
}) => {
  return (
    <div className="space-y-4 ">
      <div className=" border-l-4 pl-4 border-l-primary/40 flex flex-col gap-1">
        <h2 className="text-xl font-medium tracking-tight">{label}</h2>
        {description && (
          <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};

export const SelectComponentIndexPage = () => {
  const [customerId, setCustomerId] = useState<string | string[]>('');
  const [productId, setProductId] = useState<string | string[]>('');
  const [memberId, setMemberId] = useState<string | string[]>('');
  const [companyId, setCompanyId] = useState<string | string[]>('');
  const [tagId, setTagId] = useState<string | string[]>('');
  const [customerTagId, setCustomerTagId] = useState<string | string[]>('');
  const [productTagId, setProductTagId] = useState<string | string[]>('');
  const [companyTagId, setCompanyTagId] = useState<string | string[]>('');
  const [branchId, setBranchId] = useState<string | string[]>('');
  return (
    <PageContainer className="overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-12">
          <div>
            <span className="flex items-center gap-2">
              <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                Select Components
              </h1>
              <Tooltip>
                <Tooltip.Trigger tabIndex={-1}>
                  <IconInfoCircle className="size-5 text-muted-foreground" />
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <p>
                    This page is only available in the development environment.
                  </p>
                </Tooltip.Content>
              </Tooltip>
            </span>
          </div>

          <SelectContainerGroup
            label="Tags"
            description="Select component for different tag types"
          >
            <SelectContainer
              label="Select tags"
              description="Choose from available tags"
            >
              <SelectTags
                tagType=""
                value={tagId}
                onValueChange={(value) => {
                  setTagId(value);
                }}
              />
            </SelectContainer>

            <SelectContainer
              label="Select company tags"
              description="Choose from available company tags"
            >
              <SelectTags
                tagType="core:company"
                value={companyTagId}
                onValueChange={(value) => {
                  setCompanyTagId(value);
                }}
              />
            </SelectContainer>
            <SelectContainer
              label="Select product tags"
              description="Choose from available product tags"
            >
              <SelectTags
                tagType="core:product"
                value={productTagId}
                onValueChange={(value) => {
                  setProductTagId(value);
                }}
              />
            </SelectContainer>
            <SelectContainer
              label="Select customer tags"
              description="Choose from available customer tags"
            >
              <SelectTags
                tagType="core:customer"
                value={customerTagId}
                onValueChange={(value) => {
                  setCustomerTagId(value);
                }}
              />
            </SelectContainer>
          </SelectContainerGroup>
          <SelectContainerGroup
            label="Contact"
            description="Components for managing contacts"
          >
            <SelectContainer
              label="Company Select"
              description="Search and select companies"
            >
              <SelectCompanies value={companyId} onValueChange={setCompanyId} />
            </SelectContainer>
            <SelectContainer
              label="Customer Select"
              description="Search and select customers"
            >
              <SelectCustomers
                value={customerId}
                onValueChange={setCustomerId}
              />
            </SelectContainer>
          </SelectContainerGroup>
          <SelectContainerGroup
            label="Team"
            description="Components for managing team members"
          >
            <SelectContainer
              label="Member Select"
              description="Select team members"
            >
              <SelectMember value={memberId} onValueChange={setMemberId} />
            </SelectContainer>
            <SelectContainer
              label="Branch Select"
              description="Browse and select branches"
            >
              <SelectBranches value={branchId} onValueChange={setBranchId} />
            </SelectContainer>
          </SelectContainerGroup>
          <SelectContainerGroup
            label="Content"
            description="Components for managing content and products"
          >
            <SelectContainer
              label="Product Select"
              description="Browse and select products"
            >
              <SelectProducts value={productId} onValueChange={setProductId} />
            </SelectContainer>
          </SelectContainerGroup>
        </div>
      </div>
    </PageContainer>
  );
};

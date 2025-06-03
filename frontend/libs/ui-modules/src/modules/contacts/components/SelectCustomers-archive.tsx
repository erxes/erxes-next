// import { useState } from 'react';
// import { SelectCustomerContext } from '../contexts/SelectCustomerContext';
// import { useSelectCustomerContext } from '../hooks/useSelectCustomerContext';
// import { CustomerInline, useCustomers } from 'ui-modules/modules';
// import { ICustomer } from 'ui-modules/modules';
// import {
//   cn,
//   Combobox,
//   Command,
//   Filter,
//   Form,
//   Popover,
//   RecordTableCellContent,
//   RecordTableCellTrigger,
//   RecordTablePopover,
//   useFilterContext,
//   useQueryState,
// } from 'erxes-ui';
// import { useDebounce } from 'use-debounce';
// import { IconUsersGroup } from '@tabler/icons-react';

// const SelectCustomerProvider = ({
//   children,
//   mode = 'single',
//   value,
//   onValueChange,
// }: {
//   children: React.ReactNode;
//   mode?: 'single' | 'multiple';
//   value?: string[] | string;
//   onValueChange?: (value: string[] | string) => void;
// }) => {
//   const [selectedCustomers, setSelectedCustomers] = useState<ICustomer[]>([]);
//   const isSingleMode = mode === 'single';

//   const onSelect = (customer: ICustomer) => {
//     if (!customer) return;

//     if (isSingleMode) {
//       setSelectedCustomers([customer]);
//       return onValueChange?.(customer._id);
//     }
//     const arrayValue = Array.isArray(value) ? value : [];

//     const isCustomerSelected = arrayValue.includes(customer._id);
//     const newSelectedCustomerIds = isCustomerSelected
//       ? arrayValue.filter((id) => id !== customer._id)
//       : [...arrayValue, customer._id];

//     setSelectedCustomers(
//       selectedCustomers.filter((c) => newSelectedCustomerIds.includes(c._id)),
//     );
//     onValueChange?.(newSelectedCustomerIds);
//   };

//   return (
//     <SelectCustomerContext.Provider
//       value={{
//         customerIds: !value ? [] : Array.isArray(value) ? value : [value],
//         onSelect,
//         selectedCustomers,
//         setSelectedCustomers,
//         loading: false,
//         error: null,
//       }}
//     >
//       {children}
//     </SelectCustomerContext.Provider>
//   );
// };

// const SelectCustomerValue = () => {
//   const { customerIds, selectedCustomers } = useSelectCustomerContext();

//   return (
//     <>
//       {customerIds.map((customerId) => (
//         <CustomerInline
//           customerId={customerId}
//           customer={selectedCustomers.find((c) => c._id === customerId)}
//         />
//       ))}
//     </>
//   );
// };

// const SelectCustomerCommandItem = ({ customer }: { customer: ICustomer }) => {
//   const { onSelect, customerIds } = useSelectCustomerContext();

//   return (
//     <Command.Item
//       value={customer._id}
//       onSelect={() => {
//         onSelect(customer);
//       }}
//     >
//       <CustomerInline customerId={customer._id} customer={customer} />
//       <Combobox.Check checked={customerIds.includes(customer._id)} />
//     </Command.Item>
//   );
// };

// const SelectCustomerContent = () => {
//   const [search, setSearch] = useState('');
//   const [debouncedSearch] = useDebounce(search, 500);
//   const { customerIds, selectedCustomers } = useSelectCustomerContext();
//   const { customers, loading, handleFetchMore, totalCount, error } =
//     useCustomers({
//       variables: {
//         searchValue: debouncedSearch,
//         excludeIds: true,
//       },
//     });

//   return (
//     <Command shouldFilter={false}>
//       <Command.Input
//         value={search}
//         onValueChange={setSearch}
//         variant="secondary"
//         wrapperClassName="flex-auto"
//         focusOnMount
//       />
//       <Command.List className="max-h-[300px] overflow-y-auto">
//         <Combobox.Empty loading={loading} error={error} />
//         {(customers?.length || 0) > 0 && (
//           <>
//             {customers?.map((customer) => (
//               <SelectCustomerCommandItem key={customer._id} customer={customer} />
//             ))}
//             <Command.Separator className="my-1" />
//           </>
//         )}

//         {!loading &&
//           customers
//             ?.filter(
//               (customer) =>
//                 !customerIds.find((customerId) => customerId === customer._id),
//             )
//             .map((customer) => (
//               <SelectCustomerCommandItem key={customer._id} customer={customer} />
//             ))}

//         <Combobox.FetchMore
//           fetchMore={handleFetchMore}
//           currentLength={customers?.length || 0}
//           totalCount={totalCount || 0}
//         />
//       </Command.List>
//     </Command>
//   );
// };


// export const SelectCustomerInlineCell = ({
//   onValueChange,
//   scope,
//   ...props
// }: Omit<React.ComponentProps<typeof SelectCustomerProvider>, 'children'> & {
//   scope?: string;
// }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <SelectCustomerProvider
//       onValueChange={(value) => {
//         onValueChange?.(value);
//         setOpen(false);
//       }}
//       {...props}
//     >
//       <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
//         <RecordTableCellTrigger>
//           <SelectCustomer.Value />
//         </RecordTableCellTrigger>
//         <RecordTableCellContent>
//           <SelectCustomer.Content />
//         </RecordTableCellContent>
//       </RecordTablePopover>
//     </SelectCustomerProvider>
//   );
// };

// export const SelectCustomerFormItem = ({
//   onValueChange,
//   className,
//   ...props
// }: Omit<React.ComponentProps<typeof SelectCustomerProvider>, 'children'> & {
//   className?: string;
// }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <SelectCustomerProvider
//       onValueChange={(value) => {
//         onValueChange?.(value);
//         setOpen(false);
//       }}
//       {...props}
//     >
//       <Popover open={open} onOpenChange={setOpen}>
//         <Form.Control>
//           <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
//             <SelectCustomer.Value />
//           </Combobox.Trigger>
//         </Form.Control>

//         <Combobox.Content>
//           <SelectCustomer.Content />
//         </Combobox.Content>
//       </Popover>
//     </SelectCustomerProvider>
//   );
// };

// export const SelectCustomerDetail = ({
//   onValueChange,
//   className,
//   ...props
// }: Omit<React.ComponentProps<typeof SelectCustomerProvider>, 'children'> & {
//   className?: string;
// }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <SelectCustomerProvider
//       onValueChange={(value) => {
//         onValueChange?.(value);
//         setOpen(false);
//       }}
//       {...props}
//     >
//       <Popover open={open} onOpenChange={setOpen}>
//         <Combobox.Trigger
//           className={cn('w-auto inline-flex', className)}
//           variant="ghost"
//         >
//           <SelectCustomer.Value />
//         </Combobox.Trigger>
//         <Combobox.Content>
//           <SelectCustomer.Content />
//         </Combobox.Content>
//       </Popover>
//     </SelectCustomerProvider>
//   );
// };

// export const SelectCustomer = {
//   Provider: SelectCustomerProvider,
//   Value: SelectCustomerValue,
//   Content: SelectCustomerContent,
//   InlineCell: SelectCustomerInlineCell,
//   FormItem: SelectCustomerFormItem,
//   Detail: SelectCustomerDetail,
// };

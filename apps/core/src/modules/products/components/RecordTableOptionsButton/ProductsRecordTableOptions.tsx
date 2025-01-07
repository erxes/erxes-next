// 'use client';
// import React, { useState } from 'react';
// import { Button, DropdownMenu } from 'erxes-ui';
// import { MainMenu } from './MainMenu';
// import { FieldsMenu } from './FieldsMenu';
// import { HiddenFieldsMenu } from './HiddenFieldsMenu';

// export const ProductsRecordTableOptions: React.FC = () => {
//   const [currentMenu, setCurrentMenu] = useState<
//     'main' | 'fields' | 'hiddenFields'
//   >('main');
//   const [open, setOpen] = useState(false);
//   const handleToFields = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setCurrentMenu('fields');
//   };

//   const handleToMain = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setCurrentMenu('main');
//   };
//   const handleToHiddenFields = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setCurrentMenu('hiddenFields');
//   };

//   return (
//     <DropdownMenu.Root open={open} onOpenChange={setOpen}>
//       <DropdownMenu.Trigger asChild>
//         <Button variant="ghost" className="text-muted-foreground">
//           Options
//         </Button>
//       </DropdownMenu.Trigger>
//       <DropdownMenu.Content className="w-52 bg-background backdrop-blur-3xl text-muted-foreground text-sm rounded-lg -translate-x-4 shadow-md">
//         {(() => {
//           switch (currentMenu) {
//             case 'main':
//               return (
//                 <MainMenu
//                   handleToMain={handleToMain}
//                   handleToFields={handleToFields}
//                 />
//               );
//             case 'fields':
//               return (
//                 <FieldsMenu
//                   handleToMain={handleToMain}
//                   handleToHiddenFields={handleToHiddenFields}
//                 />
//               );
//             case 'hiddenFields':
//               return <HiddenFieldsMenu handleToFields={handleToFields} />;
//           }
//         })()}
//       </DropdownMenu.Content>
//     </DropdownMenu.Root>
//   );
// };

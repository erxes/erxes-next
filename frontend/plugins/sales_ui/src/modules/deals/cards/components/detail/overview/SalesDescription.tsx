import { Editor } from 'erxes-ui';
import { SalesHotKeyScope } from '@/deals/types/dealsHotKeyScope';
import { useState } from 'react';

const SalesDescription = ({ form }: { form?: any }) => {
  const [description, setDescription] = useState('');

  return (
    <div>
      <Editor
        initialContent={description}
        onChange={setDescription}
        scope={SalesHotKeyScope.SalesDetailAddSheetDescriptionField}
      />
    </div>
  );
};

export default SalesDescription;

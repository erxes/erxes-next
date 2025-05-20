import React from 'react';
import { useChannels } from '../../hooks/useChannels';
import { RecordTable } from 'erxes-ui/modules';
import { ChannelColumns } from './ChannelColumns';

const ChannelsTable = () => {
  const { channels, loading } = useChannels({
    variables: {
      page: 1,
      perPage: 30,
    },
  });
  return (
    <RecordTable.Provider
      data={channels || []}
      columns={ChannelColumns}
      stickyColumns={['checkbox', 'name']}
      className="m-3"
    >
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};

export default ChannelsTable;

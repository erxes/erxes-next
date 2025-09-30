export const renderUserInfo = (
  customer: any,
  customerDetail: any,
  channels?: any,
) => {
  if (!customer) {
    return (
      <div className="text-center">
        <div className="text-accent-foreground">Unknown caller</div>
      </div>
    );
  }

  const displayName =
    customer?.firstName || customer?.lastName
      ? `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim()
      : customer?.primaryPhone ||
        customerDetail?.firstName ||
        customerDetail?.lastName
      ? `${customerDetail?.firstName || ''} ${
          customerDetail?.lastName || ''
        }`.trim()
      : customerDetail?.primaryPhone || 'Unknown';

  return (
    <div className="text-center space-y-1">
      <div className="font-semibold text-foreground text-lg">{displayName}</div>
      {customer.primaryPhone && displayName !== customer.primaryPhone && (
        <div className="text-accent-foreground text-sm">
          {customer?.primaryPhone}
        </div>
      )}
      {!customer &&
        customerDetail?.primaryPhone &&
        displayName !== customerDetail.primaryPhone && (
          <div className="text-accent-foreground text-sm">
            {customerDetail?.primaryPhone}
          </div>
        )}

      {!customerDetail && customer.primaryEmail && (
        <div className="text-accent-foreground text-sm">
          {customer?.primaryEmail || customerDetail?.primaryPhone}
        </div>
      )}
      {channels && channels.length > 0 && (
        <div className="text-xs text-accent-foreground">
          {channels.map((channel: any, index: number) => (
            <div key={index}>
              {channel.name} - {channel.integrationKind}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface DisabledPlugin {
  pluginName: string;
  isInAppDisabled: boolean;
  isEmailDisabled: boolean;
}

export interface DisabledNotifType {
  contentType: string;
  isInAppDisabled: boolean;
  isEmailDisabled: boolean;
}

export function updateDisabledPlugin(
  plugins: DisabledPlugin[],
  pluginName: string,
  key: 'isInAppDisabled' | 'isEmailDisabled',
  checked: boolean,
): DisabledPlugin[] {
  const index = plugins.findIndex((p) => p.pluginName === pluginName);
  const updated = [...plugins];
  if (index !== -1) {
    updated[index] = { ...updated[index], [key]: checked };
  } else {
    updated.push({
      pluginName,
      isInAppDisabled: key === 'isInAppDisabled' ? checked : false,
      isEmailDisabled: key === 'isEmailDisabled' ? checked : false,
    });
  }
  return updated;
}

export function updateDisabledNotifType(
  types: DisabledNotifType[],
  contentType: string,
  key: 'isInAppDisabled' | 'isEmailDisabled',
  checked: boolean,
): DisabledNotifType[] {
  const index = types.findIndex((t) => t.contentType === contentType);
  const updated = [...types];
  if (index !== -1) {
    updated[index] = { ...updated[index], [key]: checked };
  } else {
    updated.push({
      contentType,
      isInAppDisabled: key === 'isInAppDisabled' ? checked : false,
      isEmailDisabled: key === 'isEmailDisabled' ? checked : false,
    });
  }
  return updated;
}

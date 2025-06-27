export interface InlineCellContextTypes {
  recordId: string;
  name: string;
  id: string;
  handleEscape: () => void;
  handleEnter: () => void;
  handleCancel: () => void;
  handleOpenEditMode: () => void;
}

import {
  IconBolt,
  IconCashEdit,
  IconForms,
  IconLetterTSmall,
  IconMusic,
  IconPaperclip,
  IconPhotoScan,
  IconSquareRoundedLetterT,
  IconVideo,
} from '@tabler/icons-react';

export const REPLY_MESSAGE_ACTION_BUTTONS = [
  { type: 'text', title: 'Text', icon: IconLetterTSmall },
  { type: 'card', title: 'Card', icon: IconCashEdit },
  { type: 'quickReplies', title: 'Quick Replies', icon: IconBolt },
  { type: 'image', title: 'Image', icon: IconPhotoScan },
  { type: 'attachments', title: 'Attachments', icon: IconPaperclip },
  { type: 'audio', title: 'Audio', icon: IconMusic },
  { type: 'video', title: 'Video', icon: IconVideo },
  { type: 'input', title: 'Input', icon: IconForms },
];

export const INITIAL_OBJ_MESSAGE_TYPES = {
  text: {
    text: '',
    buttons: [],
  },
  image: {
    image: '',
  },
  card: {
    cards: [],
  },
  quickReplies: {
    quickReplies: [],
  },
  attachments: {
    attachments: [],
  },
  audio: {
    audio: '',
  },
  video: {
    video: '',
  },
  input: {
    input: {},
  },
};

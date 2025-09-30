export interface Customer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  content: string;
  createdAt: string;
  customer?: Customer;
  user?: User;
  isInternal?: boolean;
}

export interface Conversation {
  _id: string;
  content: string;
  createdAt: string;
  customer: Customer;
  assignedUser?: User;
  messages: Message[];
}

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface MessengerProps {
  brandId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

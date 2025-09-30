export type HeaderContentType = 'hero-section' | 'header-start';

export interface HeaderProps {
  className?: string;
}

export interface HeaderItemProps {
  title: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

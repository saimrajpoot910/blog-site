export type IconType = 'chart' | 'eye' | 'store' | 'users';

export interface StatsCardData {
  id: string;
  value: number | string;
  label: string;
  iconType: IconType;
}

export interface NavChild {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  hasChildren?: boolean;
  children?: NavChild[];
  badge?: string | number;
  badgeColor?: string;
}

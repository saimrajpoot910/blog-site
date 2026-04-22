export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  icon: 'plus' | 'arrow-down';
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  badgeColor?: 'orange' | 'blue' | 'green';
  hasChildren?: boolean;
  children?: NavSubItem[];
}

export interface StatsCardData {
  id: string;
  value: number | string;
  label: string;
  iconType: 'chart' | 'eye' | 'store' | 'users';
}

export type BadgeColor = 'orange' | 'blue' | 'green';
export type IconType = 'chart' | 'eye' | 'store' | 'users';

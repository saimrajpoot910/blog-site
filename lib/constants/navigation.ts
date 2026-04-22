import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'dashboard',
  },
  {
    id: 'users',
    label: 'USER',
    href: '/users',
    icon: 'user',
    hasChildren: true,
    children: [
      { id: 'add-user',     label: 'Add User',    href: '/users/add',    icon: 'plus' },
      { id: 'all-user',     label: 'All User',    href: '/users',        icon: 'arrow-down' },
      { id: 'assign-role',  label: 'Assign Role', href: '/users/roles',  icon: 'arrow-down' },
    ],
  },
  {
    id: 'network',
    label: 'NETWORK',
    href: '/network',
    icon: 'network',
    hasChildren: true,
    children: [
      { id: 'add-network', label: 'Add Network', href: '/network/add', icon: 'plus' },
    ],
  },
  {
    id: 'categories',
    label: 'CATEGORIES',
    href: '/categories',
    icon: 'categories',
    hasChildren: true,
    children: [
      { id: 'add-category', label: 'Add Category',   href: '/categories/add', icon: 'plus' },
      { id: 'all-category', label: 'All Categories', href: '/categories',     icon: 'arrow-down' },
    ],
  },
  {
    id: 'stores',
    label: 'STORES',
    href: '/stores',
    icon: 'stores',
    badge: 11,
    badgeColor: 'orange',
    hasChildren: true,
    children: [
      { id: 'add-store',  label: 'Add Store',  href: '/stores/add', icon: 'plus' },
      { id: 'edit-store', label: 'Edit Store', href: '/stores',     icon: 'arrow-down' },
    ],
  },
  {
    id: 'coupons',
    label: 'COUPONS',
    href: '/coupons',
    icon: 'coupons',
    badge: 9,
    badgeColor: 'blue',
    hasChildren: true,
    children: [
      { id: 'add-coupon',  label: 'Add Coupon',  href: '/coupons/add',  icon: 'plus' },
      { id: 'all-coupon',  label: 'All Coupon',  href: '/coupons',      icon: 'arrow-down' },
      { id: 'sort-coupon', label: 'Sort Coupon', href: '/coupons/sort', icon: 'arrow-down' },
    ],
  },
  {
    id: 'deals',
    label: 'DEALS',
    href: '/deals',
    icon: 'deals',
    badge: 3,
    badgeColor: 'green',
    hasChildren: true,
    children: [
      { id: 'add-deal', label: 'Add Deal',  href: '/deals/add', icon: 'plus' },
      { id: 'all-deal', label: 'All Deals', href: '/deals',     icon: 'arrow-down' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    href: '/media',
    icon: 'media',
  },
  {
    id: 'image-compressor',
    label: 'Image Compressor',
    href: '/image-compressor',
    icon: 'compress',
    hasChildren: true,
    children: [
      { id: 'compress-image', label: 'Compress Image', href: '/image-compressor', icon: 'plus' },
    ],
  },
];


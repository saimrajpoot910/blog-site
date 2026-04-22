import type { Metadata } from 'next';
import './globals.css';
import DashboardShell from '@/components/layout/DashboardShell';

export const metadata: Metadata = {
  title: {
    default: 'Update Review CMS',
    template: '%s | Update Review CMS',
  },
  description: 'Update Review — Content Management System for coupons, stores, deals, and blog posts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}

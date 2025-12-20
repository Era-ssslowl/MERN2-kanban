'use client';

interface AdminBadgeProps {
  isAdmin: boolean;
  size?: 'sm' | 'md';
}

export function AdminBadge({ isAdmin, size = 'sm' }: AdminBadgeProps) {
  if (!isAdmin) return null;

  return (
    <span className={`badge-admin ${size === 'sm' ? 'text-xs' : 'text-sm'} ml-2`}>
      ADMIN
    </span>
  );
}

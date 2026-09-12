import React from 'react';

export type StatusType =
  | 'active'
  | 'overdue'
  | 'in-storage'
  | 'partially-sold'
  | 'held'
  | 'leased'
  | 'rented'
  | 'partially-rented'
  | 'under-construction'
  | 'sold'
  | 'settled'
  | 'closed'
  | 'operational'
  | 'maintenance'
  | 'available'
  | 'assigned';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'rating' | 'intent' | 'neutral';
  status?: StatusType | string;
  rating?: 'A' | 'B' | 'C';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'status',
  status,
  rating,
  className = ''
}) => {
  if (variant === 'rating' || rating) {
    const r = rating || String(children);
    let color = 'bg-neutral/15 text-neutral';
    if (r === 'A') color = 'bg-success/15 text-success font-bold';
    else if (r === 'B') color = 'bg-brand/15 text-brand dark:text-sky font-bold';
    else if (r === 'C') color = 'bg-warning/15 text-warning font-bold';
    return (
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs ${color} ${className}`}>
        {r}
      </span>
    );
  }

  const s = (status || String(children)).toLowerCase().replace(/\s+/g, '-');
  let style = 'bg-neutral/10 text-muted border-transparent';

  switch (s) {
    case 'active':
    case 'in-storage':
    case 'held':
    case 'rented':
    case 'operational':
    case 'available':
      style = 'bg-success/10 text-success border-success/20';
      break;
    case 'overdue':
    case 'danger':
      style = 'bg-danger/10 text-danger border-danger/20';
      break;
    case 'partially-sold':
    case 'partially-rented':
    case 'warning':
    case 'notice':
      style = 'bg-warning/10 text-warning border-warning/20';
      break;
    case 'leased':
    case 'assigned':
    case 'info':
      style = 'bg-brand/10 text-brand dark:text-sky border-brand/20';
      break;
    case 'under-construction':
    case 'develop':
      style = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      break;
    case 'sold':
    case 'settled':
    case 'closed':
    case 'resale':
      style = 'bg-muted/15 text-muted border-muted/20';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${style} ${className}`}
    >
      {children}
    </span>
  );
};

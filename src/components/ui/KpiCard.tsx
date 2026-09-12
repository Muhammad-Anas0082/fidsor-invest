import React from 'react';

interface KpiCardProps {
  value: string | number;
  label: string;
  subtext?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  value,
  label,
  subtext,
  variant = 'default'
}) => {
  const getValueColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success dark:text-success';
      case 'danger':
        return 'text-danger dark:text-danger';
      case 'warning':
        return 'text-warning dark:text-warning';
      case 'info':
        return 'text-info dark:text-sky';
      default:
        return 'text-fg';
    }
  };

  return (
    <div className="bg-card border border-hairline rounded-lg p-4 shadow-xs flex flex-col justify-between min-h-[90px]">
      <div>
        <div className={`text-2xl font-bold tracking-tight ${getValueColor()}`}>
          {value}
        </div>
        <div className="text-xs font-medium text-muted mt-0.5">{label}</div>
      </div>
      {subtext && (
        <div className="text-[11px] text-muted/80 mt-1.5 line-clamp-1">
          {subtext}
        </div>
      )}
    </div>
  );
};

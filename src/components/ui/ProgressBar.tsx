import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100 or 0 to 1
  isFraction?: boolean;
  color?: 'blue' | 'orange' | 'green' | 'red';
  className?: string;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  isFraction = true,
  color = 'blue',
  className = '',
  showText = false
}) => {
  const percentage = Math.min(100, Math.max(0, isFraction ? value * 100 : value));

  const getColorClass = () => {
    switch (color) {
      case 'orange':
        return 'bg-warning';
      case 'green':
        return 'bg-success';
      case 'red':
        return 'bg-danger';
      default:
        return 'bg-brand dark:bg-sky';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-washline/20 rounded-full h-1.5 overflow-hidden w-20">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <span className="text-xs text-muted font-medium min-w-[32px]">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};

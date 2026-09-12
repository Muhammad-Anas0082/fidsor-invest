import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

interface InfoBannerProps {
  title?: string;
  message: string;
  variant?: 'info' | 'warning';
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  message,
  variant = 'info'
}) => {
  const isInfo = variant === 'info';

  return (
    <div
      className={`rounded-lg p-3.5 flex items-start gap-3 border text-xs sm:text-sm my-4 ${
        isInfo
          ? 'bg-[#eaf2fb] dark:bg-[#10243d] border-[#bcd6f3] dark:border-[#1d3d63] text-[#0d2d53] dark:text-[#cde2f8]'
          : 'bg-[#fef6ee] dark:bg-[#2c1d0c] border-[#f9dbaf] dark:border-[#523512] text-[#78350f] dark:text-[#f8d7ab]'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isInfo ? (
          <Info className="w-4 h-4 text-brand dark:text-sky" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-warning" />
        )}
      </div>
      <div>
        {title && <span className="font-semibold mr-2">{title} —</span>}
        <span>{message}</span>
      </div>
    </div>
  );
};

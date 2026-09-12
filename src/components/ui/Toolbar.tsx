import React from 'react';
import { Search, Plus } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

interface ToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  filters?: FilterOption[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
  primaryActionLabel,
  onPrimaryAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4 ${className}`}
    >
      {/* Left: Search + Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-hairline bg-card text-xs text-fg placeholder:text-muted focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        {filters.map(filter => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={e => filter.onChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand cursor-pointer shadow-2xs"
          >
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Right: Primary Action if provided on toolbar */}
      {primaryActionLabel && onPrimaryAction && (
        <button
          onClick={onPrimaryAction}
          className="h-9 px-3.5 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{primaryActionLabel}</span>
        </button>
      )}
    </div>
  );
};

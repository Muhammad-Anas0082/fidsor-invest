import React, { useState } from 'react';
import { Download, Plus, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';

interface PageHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  children?: React.ReactNode; // For secondary toggles like CS-2026 / CS-2025
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  onExportExcel,
  onExportPdf,
  primaryActionLabel,
  onPrimaryAction,
  children
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-hairline">
      {/* Title & Subtitle */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-brand/10 dark:bg-sky/20 border border-brand/20 dark:border-sky/30 flex items-center justify-center text-brand dark:text-sky shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">{title}</h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5 leading-relaxed">{subtitle}</p>
        </div>
      </div>

      {/* Top-Right Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
        {children}

        {/* Export Button with Dropdown */}
        {(onExportExcel || onExportPdf) && (
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="h-9 px-3 rounded-lg border border-hairline bg-card hover:bg-wash text-xs font-medium text-fg flex items-center gap-2 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-muted" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-card border border-hairline rounded-lg shadow-lg py-1 z-40 text-xs">
                {onExportExcel && (
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportExcel();
                    }}
                    className="w-full px-3 py-2 text-fg hover:bg-wash flex items-center gap-2.5 text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-success" />
                    <span>Download Excel (.xlsx)</span>
                  </button>
                )}
                {onExportPdf && (
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportPdf();
                    }}
                    className="w-full px-3 py-2 text-fg hover:bg-wash flex items-center gap-2.5 text-left"
                  >
                    <FileText className="w-4 h-4 text-danger" />
                    <span>Download PDF (.pdf)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="h-9 px-3.5 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{primaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

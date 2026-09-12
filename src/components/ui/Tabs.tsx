import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-6 border-b border-hairline my-4 ${className}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-2.5 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
              isActive
                ? 'text-brand dark:text-sky font-semibold border-b-2 border-brand dark:border-sky -mb-[2px]'
                : 'text-muted hover:text-fg'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-brand/10 dark:bg-sky/20 text-brand dark:text-sky'
                    : 'bg-wash text-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

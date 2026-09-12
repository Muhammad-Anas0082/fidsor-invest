import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  ArrowLeftRight,
  Sparkles,
  FolderKanban,
  Users,
  Layers,
  Building2,
  Snowflake,
  FileText,
  Banknote,
  Tractor,
  HardHat,
  LineChart,
  Coins,
  Landmark,
  Receipt,
  FileSpreadsheet,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
  }[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const { currentUser, isAdmin } = useAuth();
  const isOperations = currentUser?.roleId === 'operations';

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: isOperations
        ? [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' }]
        : [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
            { id: 'portfolio', label: 'Portfolio', icon: PieChart, path: '/portfolio' },
            { id: 'cash-flow', label: 'Cash flow', icon: ArrowLeftRight, path: '/cash-flow' }
          ]
    },
    {
      title: 'INVEST',
      items: isOperations
        ? [{ id: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects' }]
        : [
            { id: 'opportunities', label: 'Opportunities', icon: Sparkles, path: '/opportunities' },
            { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects' },
            { id: 'investors', label: 'Investors', icon: Users, path: '/investors' }
          ]
    },
    {
      title: 'OWN',
      items: [
        { id: 'assets', label: 'Assets', icon: Layers, path: '/assets' },
        { id: 'properties', label: 'Land & property', icon: Building2, path: '/properties' }
      ]
    },
    {
      title: 'OPERATE',
      items: [
        { id: 'cold-storage', label: 'Cold storage', icon: Snowflake, path: '/cold-storage' },
        { id: 'leases', label: 'Leases & tenancies', icon: FileText, path: '/leases' },
        { id: 'microfinance', label: 'Microfinance', icon: Banknote, path: '/microfinance' },
        { id: 'machinery', label: 'Machinery hire', icon: Tractor, path: '/machinery' },
        { id: 'workforce', label: 'Workforce hire', icon: HardHat, path: '/workforce' }
      ]
    },
    ...(!isOperations
      ? [
          {
            title: 'MARKETS',
            items: [
              { id: 'stocks', label: 'Equity', icon: LineChart, path: '/stocks' },
              { id: 'currency', label: 'Currency', icon: Coins, path: '/currency' }
            ]
          }
        ]
      : []),
    {
      title: 'FINANCE',
      items: isOperations
        ? [{ id: 'transactions', label: 'Transactions', icon: Receipt, path: '/transactions' }]
        : [
            { id: 'accounts', label: 'Accounts', icon: Landmark, path: '/accounts' },
            { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/transactions' }
          ]
    },
    {
      title: 'INSIGHT',
      items: [{ id: 'reports', label: 'Reports', icon: FileSpreadsheet, path: '/reports' }]
    }
  ];


  // ADMINISTRATION is strictly visible to Administrator
  if (isAdmin) {
    sections.push({
      title: 'ADMINISTRATION',
      items: [
        { id: 'users', label: 'Users & roles', icon: ShieldCheck, path: '/admin/users' },
        { id: 'audit', label: 'Audit log', icon: History, path: '/audit' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
      ]
    });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-rail text-rail-fg select-none">
      {/* Mobile Header */}
      <div className="lg:hidden h-14 border-b border-white/10 px-4 flex items-center justify-between">
        <div className="font-bold text-sm text-white">Navigation</div>
        <button onClick={onCloseMobile} className="p-1 rounded text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
        {sections.map(section => (
          <div key={section.title}>
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-rail-section uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.id}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      onNavigate(item.path);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-rail-active text-white shadow-xs'
                        : 'text-rail-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Collapse Toggle (Desktop only) */}
      <div className="hidden lg:block border-t border-white/10 p-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rail-muted hover:bg-white/5 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 border-r border-hairline ${
          isCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

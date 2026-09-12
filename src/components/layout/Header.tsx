import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, getRoleLabel } from '../../lib/auth';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleMobileSidebar
}) => {
  const { currentUser, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('fidsor-invest.theme', next);
    } catch {}
  };

  if (!currentUser) return null;

  return (
    <header className="h-14 border-b border-hairline bg-panel text-fg px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-muted hover:text-fg hover:bg-wash"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-base shadow-xs">
            F
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-sm tracking-tight text-fg">Fidsor Invest</div>
            <div className="text-[10px] text-muted font-medium">Investment Platform</div>
          </div>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3 rounded-lg border border-hairline bg-wash/50 hover:bg-wash/80 text-muted text-xs flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted" />
            <span>Search projects, assets, tenants, loans...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-muted bg-card border border-hairline rounded shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg text-muted hover:text-fg hover:bg-wash"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-muted hover:text-fg hover:bg-wash transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand ring-2 ring-panel" />
        </button>

        {/* Dark/Light Mode */}
        <button
          onClick={toggleTheme}
          title="Toggle color theme"
          className="p-2 rounded-lg text-muted hover:text-fg hover:bg-wash transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-6 w-px bg-hairline mx-1" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-wash transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-brand/15 text-brand dark:text-sky font-semibold text-xs flex items-center justify-center ring-1 ring-brand/20">
              {getUserInitials(currentUser.name)}
            </div>
            <div className="hidden lg:block leading-none">
              <div className="text-xs font-bold text-fg">{currentUser.name}</div>
              <div className="text-[10px] text-muted mt-0.5">
                {getRoleLabel(currentUser.roleId)}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-hairline rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-hairline">
                <div className="font-semibold text-fg">{currentUser.name}</div>
                <div className="text-muted text-[11px] truncate">{currentUser.email}</div>
                <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand/10 text-brand dark:text-sky">
                  {getRoleLabel(currentUser.roleId)}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full px-3 py-2 text-danger hover:bg-danger/10 flex items-center gap-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

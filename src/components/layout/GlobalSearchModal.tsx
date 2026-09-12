import React, { useState, useEffect } from 'react';
import { Search, X, Building2, Snowflake, Banknote, Users, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const { getRecords } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const properties = getRecords('properties');
  const storageLots = getRecords('storageLots');
  const loans = getRecords('loans');
  const projects = getRecords('projects');

  const q = query.trim().toLowerCase();

  const matchedProperties = properties
    .filter(p => p.name?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q))
    .slice(0, 3);

  const matchedLots = storageLots
    .filter(l => l.product?.toLowerCase().includes(q) || l.code?.toLowerCase().includes(q))
    .slice(0, 3);

  const matchedLoans = loans
    .filter(l => l.borrowerName?.toLowerCase().includes(q) || l.code?.toLowerCase().includes(q))
    .slice(0, 3);

  const matchedProjects = projects
    .filter(pr => pr.name?.toLowerCase().includes(q) || pr.code?.toLowerCase().includes(q))
    .slice(0, 3);

  const hasResults =
    matchedProperties.length > 0 ||
    matchedLots.length > 0 ||
    matchedLoans.length > 0 ||
    matchedProjects.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-card border border-hairline rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="p-4 border-b border-hairline flex items-center gap-3">
          <Search className="w-5 h-5 text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects, assets, tenants, loans..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-fg placeholder:text-muted"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded text-muted hover:text-fg">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-wash border border-hairline px-1.5 py-0.5 rounded text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!hasResults && query ? (
            <div className="text-center py-8 text-muted text-xs">
              No results found for "{query}"
            </div>
          ) : null}

          {/* Quick links when empty */}
          {!query && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted px-3 py-1 uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => {
                  onNavigate('/properties');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center gap-2.5 text-xs text-fg"
              >
                <Building2 className="w-4 h-4 text-brand dark:text-sky" />
                <span>Land & property register</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('/cold-storage');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center gap-2.5 text-xs text-fg"
              >
                <Snowflake className="w-4 h-4 text-brand dark:text-sky" />
                <span>Cold storage operations</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('/microfinance');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center gap-2.5 text-xs text-fg"
              >
                <Banknote className="w-4 h-4 text-brand dark:text-sky" />
                <span>Microfinance loans</span>
              </button>
            </div>
          )}

          {/* Properties */}
          {matchedProperties.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-muted px-3 py-1 uppercase tracking-wider">
                Properties
              </div>
              {matchedProperties.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onNavigate('/properties');
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-brand dark:text-sky" />
                    <span className="font-semibold text-fg">{p.name}</span>
                  </div>
                  <span className="text-[11px] text-muted">{p.code}</span>
                </button>
              ))}
            </div>
          )}

          {/* Lots */}
          {matchedLots.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-muted px-3 py-1 uppercase tracking-wider">
                Cold Storage Lots
              </div>
              {matchedLots.map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    onNavigate('/cold-storage');
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Snowflake className="w-4 h-4 text-brand dark:text-sky" />
                    <span className="font-semibold text-fg">{l.product}</span>
                  </div>
                  <span className="text-[11px] text-muted">{l.code}</span>
                </button>
              ))}
            </div>
          )}

          {/* Loans */}
          {matchedLoans.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-muted px-3 py-1 uppercase tracking-wider">
                Microfinance Loans
              </div>
              {matchedLoans.map(ln => (
                <button
                  key={ln.id}
                  onClick={() => {
                    onNavigate('/microfinance');
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-wash flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-4 h-4 text-brand dark:text-sky" />
                    <span className="font-semibold text-fg">{ln.borrowerName}</span>
                  </div>
                  <span className="text-[11px] text-muted">{ln.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

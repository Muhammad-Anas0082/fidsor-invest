import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../../data/all_data.json';

const EDITS_KEY = 'fidsor-invest.edits';

export type CollectionName =
  | 'properties'
  | 'storageLots'
  | 'storageOverheads'
  | 'storageSales'
  | 'loans'
  | 'borrowers'
  | 'accounts'
  | 'transactions'
  | 'projects'
  | 'opportunities'
  | 'investors'
  | 'assets'
  | 'leases'
  | 'resources'
  | 'securities'
  | 'auditEntries'
  | 'users'
  | 'allocations'
  | 'propertyUnits'
  | 'maintenanceRecords'
  | 'dividends'
  | 'constructionJobs'
  | 'constructionPhases'
  | 'fxTrades'
  | 'fxHoldings'
  | 'roles'
  | 'valuations'
  | 'scheduleEntries'
  | 'documents'
  | 'bookings'
  | 'trades'
  | 'holdings';

interface DataContextType {
  data: Record<string, any[]>;
  getRecords: <T = any>(collection: CollectionName) => T[];
  addRecord: <T = any>(collection: CollectionName, record: T) => void;
  updateRecord: <T = any>(collection: CollectionName, id: string, updates: Partial<T>) => void;
  deleteRecord: (collection: CollectionName, id: string) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Record<string, any[]>>(() => {
    const baseTables: Record<string, any[]> = initialData.tables || {};
    try {
      const stored = localStorage.getItem(EDITS_KEY);
      if (stored) {
        const edits = JSON.parse(stored);
        const merged: Record<string, any[]> = { ...baseTables };
        for (const [col, items] of Object.entries(edits)) {
          merged[col] = items as any[];
        }
        return merged;
      }
    } catch (e) {
      console.error('Failed to load stored edits:', e);
    }
    return baseTables;
  });

  const persist = (updatedData: Record<string, any[]>) => {
    try {
      localStorage.setItem(EDITS_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Failed to persist edits:', e);
    }
  };

  const getRecords = <T = any,>(collection: CollectionName): T[] => {
    return (data[collection] || []) as T[];
  };

  const addRecord = <T = any,>(collection: CollectionName, record: T) => {
    setData(prev => {
      const existing = prev[collection] || [];
      const updated = [record, ...existing];
      const next = { ...prev, [collection]: updated };
      persist(next);
      return next;
    });
  };

  const updateRecord = <T = any,>(collection: CollectionName, id: string, updates: Partial<T>) => {
    setData(prev => {
      const existing = prev[collection] || [];
      const updated = existing.map(item => (item.id === id ? { ...item, ...updates } : item));
      const next = { ...prev, [collection]: updated };
      persist(next);
      return next;
    });
  };

  const deleteRecord = (collection: CollectionName, id: string) => {
    setData(prev => {
      const existing = prev[collection] || [];
      const updated = existing.filter(item => item.id !== id);
      const next = { ...prev, [collection]: updated };
      persist(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(EDITS_KEY);
    setData(initialData.tables || {});
  };

  return (
    <DataContext.Provider
      value={{
        data,
        getRecords,
        addRecord,
        updateRecord,
        deleteRecord,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

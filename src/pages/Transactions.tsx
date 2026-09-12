import React, { useState } from 'react';
import { Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Transaction } from '../types';

export const Transactions: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const transactions = getRecords<Transaction>('transactions');
  const [search, setSearch] = useState('');
  const [dirFilter, setDirFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('150000');
  const [newDirection, setNewDirection] = useState<'in' | 'out'>('out');
  const [newCategory, setNewCategory] = useState('expense');

  const filtered = transactions.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch =
      t.code?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.reference?.toLowerCase().includes(q);
    const matchesDir = dirFilter === 'all' || t.direction === dirFilter;
    return matchesSearch && matchesDir;
  });

  const totalIn = transactions.filter(t => t.direction === 'in' || (t as any).flow === 'in').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.direction === 'out' || (t as any).flow === 'out').reduce((sum, t) => sum + (t.amount || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const amtPaise = Math.round((parseFloat(newAmount) || 50000) * 100);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      code: `TX-2026-0${transactions.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      accountId: 'acc-meezan',
      direction: newDirection,
      category: newCategory,
      amount: amtPaise,
      reference: `REF-${Date.now().toString().slice(-5)}`,
      description: newDesc || 'General operating entry',
      status: 'cleared'
    };
    addRecord('transactions', newTx);
    setIsSheetOpen(false);
    setNewDesc('');
  };

  const exportColumns: ExportColumn[] = [
    { header: 'Entry Code', key: 'code' },
    { header: 'Date', key: 'date', format: val => formatDate(val) },
    { header: 'Direction', key: 'direction' },
    { header: 'Category', key: 'category' },
    { header: 'Amount', key: 'amount', format: val => formatPKR(val) },
    { header: 'Description', key: 'description' },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<Transaction>[] = [
    {
      header: 'ENTRY / REF',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.code || row.reference}</div>
          <div className="text-[11px] text-muted">{row.description}</div>
        </div>
      )
    },
    {
      header: 'DATE',
      cell: row => <span className="text-muted text-xs">{formatDate(row.date)}</span>
    },
    {
      header: 'CATEGORY',
      cell: row => (
        <span className="capitalize font-medium text-fg">
          {String(row.category || (row as any).type || 'general').replace(/-/g, ' ')}
        </span>
      )
    },
    {
      header: 'DIRECTION',
      cell: row => {
        const isIn = row.direction === 'in' || (row as any).flow === 'in';
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isIn ? 'text-success' : 'text-danger'}`}>
            {isIn ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isIn ? 'Inflow' : 'Outflow'}
          </span>
        );
      }
    },
    {
      header: 'AMOUNT',
      align: 'right',
      cell: row => (
        <span className={`font-semibold text-xs ${row.direction === 'in' ? 'text-success' : 'text-fg'}`}>
          {row.direction === 'in' ? '+' : '-'}{formatPKR(row.amount)}
        </span>
      )
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'direction',
      label: 'All flows',
      value: dirFilter,
      options: [
        { label: 'All flows', value: 'all' },
        { label: 'Inflows only', value: 'in' },
        { label: 'Outflows only', value: 'out' }
      ],
      onChange: setDirFilter
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Receipt}
        title="Ledger Transactions"
        subtitle="Double-entry transaction audit log reconciling field and banking movements."
        onExportExcel={() => exportToExcel('Ledger Transactions', exportColumns, filtered, 'transactions')}
        onExportPdf={() => exportToPdf('Ledger Transaction Journal', exportColumns, filtered, 'transactions')}
        primaryActionLabel="+ Record transaction"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${transactions.length} Entries`} label="Total Ledger Postings" />
        <KpiCard value={formatPKR(totalIn)} label="Recorded Inflows" variant="success" />
        <KpiCard value={formatPKR(totalOut)} label="Recorded Outflows" variant="danger" />
        <KpiCard value="100% Reconciled" label="Cleared Audit Status" variant="info" />
      </div>

      <Toolbar
        searchPlaceholder="Search transactions by reference or description..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
        primaryActionLabel="+ Record transaction"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <DataTable columns={columns} data={filtered.slice(0, 30)} />

      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Record a transaction"
        subtitle="Post a journal entry to the general ledger."
        footer={
          <>
            <button
              onClick={() => setIsSheetOpen(false)}
              className="px-4 py-2 rounded-lg border border-hairline bg-card text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="tx-form"
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold"
            >
              Post Transaction
            </button>
          </>
        }
      >
        <form id="tx-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Description *</label>
            <input
              type="text"
              required
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="e.g. Field tractor diesel and logistics"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Direction</label>
              <select
                value={newDirection}
                onChange={e => setNewDirection(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              >
                <option value="out">Outflow (Expense / Payment)</option>
                <option value="in">Inflow (Income / Receipt)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Amount (PKR) *</label>
              <input
                type="number"
                required
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

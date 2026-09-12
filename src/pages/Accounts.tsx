import React, { useState } from 'react';
import { Landmark } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Account } from '../types';

export const Accounts: React.FC = () => {
  const { getRecords } = useData();
  const accounts = getRecords<Account>('accounts');
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState('all');

  const filtered = accounts.filter(acc => {
    const q = search.toLowerCase();
    const matchesSearch =
      acc.name?.toLowerCase().includes(q) ||
      acc.institution?.toLowerCase().includes(q) ||
      acc.number?.toLowerCase().includes(q);
    const matchesKind = kindFilter === 'all' || acc.kind === kindFilter;
    return matchesSearch && matchesKind;
  });

  const totalBalance = accounts.reduce((sum, a) => sum + (a.openingBalance || 0), 0);

  const exportColumns: ExportColumn[] = [
    { header: 'Account Name', key: 'name' },
    { header: 'Type', key: 'kind' },
    { header: 'Institution', key: 'institution' },
    { header: 'Account Number', key: 'number' },
    { header: 'Currency', key: 'currency' },
    { header: 'Balance', key: 'openingBalance', format: val => formatPKR(val) },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<Account>[] = [
    {
      header: 'ACCOUNT',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.institution} · {row.number}</div>
        </div>
      )
    },
    {
      header: 'TYPE',
      cell: row => <span className="capitalize font-medium text-fg">{row.kind}</span>
    },
    {
      header: 'CURRENCY',
      cell: row => <span className="font-semibold text-fg">{row.currency}</span>
    },
    {
      header: 'BALANCE',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.openingBalance)}</span>
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'kind',
      label: 'All types',
      value: kindFilter,
      options: [
        { label: 'All types', value: 'all' },
        { label: 'Bank accounts', value: 'bank' },
        { label: 'Cash', value: 'cash' },
        { label: 'Brokerage', value: 'brokerage' },
        { label: 'Wallet', value: 'wallet' }
      ],
      onChange: setKindFilter
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Ledger Accounts"
        subtitle="Current, savings, brokerage, and field cash registers composing the cash pool."
        onExportExcel={() => exportToExcel('Ledger Accounts', exportColumns, filtered, 'accounts')}
        onExportPdf={() => exportToPdf('Ledger Accounts & Cash Positions', exportColumns, filtered, 'accounts')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${accounts.length} Accounts`} label="Operating Accounts" />
        <KpiCard value={formatPKR(totalBalance)} label="Total Liquid Cash Pool" variant="info" />
        <KpiCard value="Meezan & HBL" label="Primary Clearing Banks" />
        <KpiCard value="8 Active" label="Cleared & Reconciled" variant="success" />
      </div>

      <Toolbar
        searchPlaceholder="Search accounts by name or institution..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

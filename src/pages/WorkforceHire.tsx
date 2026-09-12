import React, { useState } from 'react';
import { HardHat } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { ResourceItem } from '../types';

export const WorkforceHire: React.FC = () => {
  const { getRecords } = useData();
  const resources = getRecords<ResourceItem>('resources');
  const workforce = resources.filter(r => r.kind === 'workforce');
  const [search, setSearch] = useState('');

  const filtered = workforce.filter(w => {
    const q = search.toLowerCase();
    return w.name?.toLowerCase().includes(q) || w.code?.toLowerCase().includes(q) || w.category?.toLowerCase().includes(q);
  });

  const totalDailyWages = workforce.reduce((sum, w) => sum + (w.dailyRate || 0), 0);
  const activeAssigned = workforce.filter(w => w.status === 'assigned').length;

  const exportColumns: ExportColumn[] = [
    { header: 'ID', key: 'code' },
    { header: 'Trade / Role', key: 'name' },
    { header: 'Category', key: 'category' },
    { header: 'Daily Wage (PKR)', key: 'dailyRate', format: val => formatPKR(val) },
    { header: 'Location', key: 'location' },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<ResourceItem>[] = [
    {
      header: 'PERSONNEL / TRADE',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.category}</div>
        </div>
      )
    },
    {
      header: 'BASE LOCATION',
      cell: row => <span className="text-muted text-xs">{row.location}</span>
    },
    {
      header: 'DAILY RATE',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.dailyRate)} / day</span>
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HardHat}
        title="Workforce & Crew Hire"
        subtitle="Skilled artisans, field operators, and agricultural crews deployed across projects."
        onExportExcel={() => exportToExcel('Workforce Crew Register', exportColumns, filtered, 'workforce')}
        onExportPdf={() => exportToPdf('Workforce Deployment Register', exportColumns, filtered, 'workforce')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${workforce.length} Crew`} label="Registered Tradesmen" />
        <KpiCard value={`${activeAssigned} On Field`} label="Currently Deployed" variant="success" />
        <KpiCard value={formatPKR(totalDailyWages)} label="Daily Payroll Capacity" variant="info" />
        <KpiCard value="Hyderabad & Sukkur" label="Primary Operating Hubs" />
      </div>

      <Toolbar
        searchPlaceholder="Search crew by name, trade or role..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

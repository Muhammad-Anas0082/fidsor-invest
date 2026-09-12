import React, { useState } from 'react';
import { Tractor } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { ResourceItem } from '../types';

export const MachineryHire: React.FC = () => {
  const { getRecords } = useData();
  const resources = getRecords<ResourceItem>('resources');
  const machinery = resources.filter(r => r.kind === 'machinery');
  const [search, setSearch] = useState('');

  const filtered = machinery.filter(m => {
    const q = search.toLowerCase();
    return m.name?.toLowerCase().includes(q) || m.code?.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q);
  });

  const availableCount = machinery.filter(m => m.status === 'available').length;
  const totalDailyRate = machinery.reduce((sum, m) => sum + (m.dailyRate || 0), 0);

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Equipment Name', key: 'name' },
    { header: 'Category', key: 'category' },
    { header: 'Daily Hire Rate', key: 'dailyRate', format: val => formatPKR(val) },
    { header: 'Location', key: 'location' },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<ResourceItem>[] = [
    {
      header: 'EQUIPMENT',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.category}</div>
        </div>
      )
    },
    {
      header: 'LOCATION',
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
        icon={Tractor}
        title="Machinery & Fleet Hire"
        subtitle="Tractors, excavators, and agricultural plant hired out across Sindh projects."
        onExportExcel={() => exportToExcel('Machinery Hire', exportColumns, filtered, 'machinery')}
        onExportPdf={() => exportToPdf('Machinery Fleet Register', exportColumns, filtered, 'machinery')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${machinery.length} Units`} label="Total Fleet Units" />
        <KpiCard value={`${availableCount} Available`} label="Ready for Hire" variant="success" />
        <KpiCard value={formatPKR(totalDailyRate)} label="Daily Capacity Revenue" variant="info" />
        <KpiCard value="88% Utilization" label="Seasonal Fleet Utilization" variant="success" />
      </div>

      <Toolbar
        searchPlaceholder="Search machinery by model, category or code..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

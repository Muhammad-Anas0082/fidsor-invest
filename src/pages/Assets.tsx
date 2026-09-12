import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Asset } from '../types';

export const Assets: React.FC = () => {
  const { getRecords } = useData();
  const assets = getRecords<Asset>('assets');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.name?.toLowerCase().includes(q) ||
      a.code?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q);
    const matchesClass = classFilter === 'all' || a.assetClass === classFilter;
    return matchesSearch && matchesClass;
  });

  const totalCost = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
  const totalVal = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalDepr = assets.reduce((sum, a) => sum + (a.depreciation || 0), 0);

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Asset Name', key: 'name' },
    { header: 'Class', key: 'assetClass' },
    { header: 'Acquisition Cost', key: 'acquisitionCost', format: val => formatPKR(val) },
    { header: 'Current Value', key: 'currentValue', format: val => formatPKR(val) },
    { header: 'Depreciation', key: 'depreciation', format: val => formatPKR(val) },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<Asset>[] = [
    {
      header: 'ASSET',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.location}</div>
        </div>
      )
    },
    {
      header: 'CLASS',
      cell: row => <span className="capitalize font-medium text-fg">{row.assetClass}</span>
    },
    {
      header: 'ACQUISITION COST',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.acquisitionCost)}</span>
    },
    {
      header: 'CURRENT VALUE',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.currentValue)}</span>
    },
    {
      header: 'DEPRECIATION',
      cell: row => <span className="text-muted">{formatPKR(row.depreciation)}</span>
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'class',
      label: 'All asset classes',
      value: classFilter,
      options: [
        { label: 'All classes', value: 'all' },
        { label: 'Land', value: 'land' },
        { label: 'Property', value: 'property' },
        { label: 'Machinery', value: 'machinery' },
        { label: 'Vehicle', value: 'vehicle' }
      ],
      onChange: setClassFilter
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Layers}
        title="Physical Assets Register"
        subtitle="Fixed assets, straight-line depreciation schedules, and carrying values."
        onExportExcel={() => exportToExcel('Assets Register', exportColumns, filtered, 'assets')}
        onExportPdf={() => exportToPdf('Assets Register & Carrying Values', exportColumns, filtered, 'assets')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${assets.length} Fixed Assets`} label="Recorded Units" />
        <KpiCard value={formatPKR(totalCost)} label="Total Acquisition Cost" />
        <KpiCard value={formatPKR(totalVal)} label="Carrying / Market Value" variant="info" />
        <KpiCard value={formatPKR(totalDepr)} label="Accumulated Depreciation" variant="warning" />
      </div>

      <Toolbar
        searchPlaceholder="Search assets by name or code..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

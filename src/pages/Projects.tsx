import React, { useState } from 'react';
import { FolderKanban } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const { getRecords } = useData();
  const projects = getRecords<Project>('projects');
  const [search, setSearch] = useState('');

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
  });

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Project Name', key: 'name' },
    { header: 'Type', key: 'type' },
    { header: 'Status', key: 'status' },
    { header: 'Budget', key: 'budget', format: val => formatPKR(val) },
    { header: 'Location', key: 'location' },
    { header: 'Started', key: 'startedOn', format: val => formatDate(val) }
  ];

  const columns: Column<Project>[] = [
    {
      header: 'PROJECT',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.location}</div>
        </div>
      )
    },
    {
      header: 'TYPE',
      cell: row => <span className="capitalize font-medium text-fg">{String(row.type || 'project').replace(/-/g, ' ')}</span>
    },
    {
      header: 'BUDGET',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.budget)}</span>
    },
    {
      header: 'TARGET ROI',
      cell: row => (
        <span className="font-semibold text-success">
          {((row.targetRoi || 0) * 100).toFixed(0)}%
        </span>
      )
    },
    {
      header: 'STARTED',
      cell: row => <span className="text-muted">{formatDate(row.startedOn)}</span>
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const inOperationsCount = projects.filter(p => p.status === 'operations' || p.status === 'active').length || 7;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderKanban}
        title="Projects"
        subtitle="Individual commercial vehicles and ring-fenced operational accounting units."
        onExportExcel={() => exportToExcel('Projects Register', exportColumns, filtered, 'projects')}
        onExportPdf={() => exportToPdf('Projects Register', exportColumns, filtered, 'projects')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${projects.length} Projects`} label="Registered Projects" />
        <KpiCard value={formatPKR(totalBudget)} label="Total Active Budgets" variant="info" />
        <KpiCard value={`${inOperationsCount} In Operations`} label="Current Operations" variant="success" />
        <KpiCard value="12 Active Partners" label="Syndicated Co-investors" />
      </div>

      <Toolbar
        searchPlaceholder="Search projects by name, code or location..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

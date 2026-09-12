import React, { useState } from 'react';
import { History } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { AuditEntry } from '../types';

export const AuditLog: React.FC = () => {
  const { getRecords } = useData();
  const auditEntries = getRecords<AuditEntry>('auditEntries');
  const [search, setSearch] = useState('');

  const filtered = auditEntries.filter(a => {
    const q = search.toLowerCase();
    return (
      a.userName?.toLowerCase().includes(q) ||
      a.action?.toLowerCase().includes(q) ||
      a.entityType?.toLowerCase().includes(q) ||
      a.details?.toLowerCase().includes(q)
    );
  });

  const exportColumns: ExportColumn[] = [
    { header: 'Timestamp', key: 'at', format: val => formatDate(val) },
    { header: 'User', key: 'userName' },
    { header: 'Action', key: 'action' },
    { header: 'Entity Type', key: 'entityType' },
    { header: 'Details', key: 'details' }
  ];

  const columns: Column<AuditEntry>[] = [
    {
      header: 'TIMESTAMP',
      cell: row => <span className="font-mono text-muted text-xs">{formatDate(row.at)}</span>
    },
    {
      header: 'OPERATOR',
      cell: row => <span className="font-semibold text-fg">{row.userName}</span>
    },
    {
      header: 'ACTION',
      cell: row => (
        <Badge status={row.action === 'login' ? 'info' : 'active'}>
          {row.action}
        </Badge>
      )
    },
    {
      header: 'ENTITY',
      cell: row => <span className="capitalize font-medium text-fg">{row.entityType}</span>
    },
    {
      header: 'DETAILS',
      cell: row => <span className="text-muted text-xs truncate max-w-sm">{row.details}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={History}
        title="System Audit Trail"
        subtitle="Immutable security log recording administrative events, mutations, and logins."
        onExportExcel={() => exportToExcel('Audit Log', exportColumns, filtered, 'audit-trail')}
        onExportPdf={() => exportToPdf('Security Audit Trail', exportColumns, filtered, 'audit-trail')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${auditEntries.length} Records`} label="Logged Audit Events" />
        <KpiCard value="Zero Violations" label="Security Health" variant="success" />
        <KpiCard value="100% Retained" label="Retention Policy" variant="info" />
        <KpiCard value="Real-time" label="Event Ingestion" />
      </div>

      <Toolbar
        searchPlaceholder="Search audit events by operator, action or details..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

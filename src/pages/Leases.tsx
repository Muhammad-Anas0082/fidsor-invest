import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Lease } from '../types';

export const Leases: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const leases = getRecords<Lease>('leases');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [newProperty, setNewProperty] = useState('');
  const [newTenant, setNewTenant] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRent, setNewRent] = useState('45000');
  const [newKind, setNewKind] = useState<Lease['kind']>('commercial');

  const filtered = leases.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.propertyName?.toLowerCase().includes(q) ||
      l.tenantName?.toLowerCase().includes(q) ||
      l.code?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyRent = leases
    .filter(l => l.status === 'active')
    .reduce((sum, l) => sum + (l.monthlyRent || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const rentPaise = Math.round((parseFloat(newRent) || 45000) * 100);
    const newLease: Lease = {
      id: `lse-${Date.now()}`,
      code: `LS-2026-0${leases.length + 1}`,
      kind: newKind,
      propertyName: newProperty || 'Commercial Unit #4',
      tenantName: newTenant || 'New Commercial Tenant',
      tenantPhone: newPhone || '+92 300 1234567',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2027-08-31',
      monthlyRent: rentPaise,
      securityDeposit: rentPaise * 2,
      status: 'active'
    };
    addRecord('leases', newLease);
    setIsSheetOpen(false);
    setNewTenant('');
  };

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Property', key: 'propertyName' },
    { header: 'Tenant', key: 'tenantName' },
    { header: 'Kind', key: 'kind' },
    { header: 'Monthly Rent', key: 'monthlyRent', format: val => formatPKR(val) },
    { header: 'Start Date', key: 'startDate', format: val => formatDate(val) },
    { header: 'End Date', key: 'endDate', format: val => formatDate(val) },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<Lease>[] = [
    {
      header: 'CONTRACT / PROPERTY',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.propertyName}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.kind}</div>
        </div>
      )
    },
    {
      header: 'TENANT',
      cell: row => (
        <div>
          <div className="font-semibold text-fg">{row.tenantName}</div>
          <div className="text-[11px] text-muted">{row.tenantPhone}</div>
        </div>
      )
    },
    {
      header: 'MONTHLY RENT',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.monthlyRent)}</span>
    },
    {
      header: 'TERM',
      cell: row => (
        <span className="text-muted text-xs">
          {formatDate(row.startDate)} – {formatDate(row.endDate)}
        </span>
      )
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Leases & Tenancies"
        subtitle="Active tenancy agreements, rent collection schedules, and tenancy terms."
        onExportExcel={() => exportToExcel('Leases Register', exportColumns, filtered, 'leases')}
        onExportPdf={() => exportToPdf('Leases & Tenancy Register', exportColumns, filtered, 'leases')}
        primaryActionLabel="+ New lease"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${leases.length} Contracts`} label="Total Tenancies" />
        <KpiCard value={formatPKR(totalMonthlyRent)} label="Total Monthly Rent Roll" variant="success" />
        <KpiCard value="10 Active" label="Occupied Units" variant="info" />
        <KpiCard value="1 Notice" label="Pending Turnover" variant="warning" />
      </div>

      <Toolbar
        searchPlaceholder="Search leases by tenant or property..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'status',
            label: 'All status',
            value: statusFilter,
            options: [
              { label: 'All status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Notice', value: 'notice' },
              { label: 'Expired', value: 'expired' }
            ],
            onChange: setStatusFilter
          }
        ]}
        primaryActionLabel="+ New lease"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <DataTable columns={columns} data={filtered} />

      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="New lease or tenancy"
        subtitle="Execute tenancy contract and add to monthly rent roll."
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
              form="lease-form"
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold"
            >
              Execute Lease
            </button>
          </>
        }
      >
        <form id="lease-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Property Unit *</label>
            <input
              type="text"
              required
              value={newProperty}
              onChange={e => setNewProperty(e.target.value)}
              placeholder="e.g. Latifabad Unit 7 — Shop #2"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Tenant Full Name *</label>
            <input
              type="text"
              required
              value={newTenant}
              onChange={e => setNewTenant(e.target.value)}
              placeholder="e.g. Muhammad Jameel"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Monthly Rent (PKR) *</label>
              <input
                type="number"
                required
                value={newRent}
                onChange={e => setNewRent(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Tenancy Kind</label>
              <select
                value={newKind}
                onChange={e => setNewKind(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              >
                <option value="commercial">Commercial Shop</option>
                <option value="residential">Residential Unit</option>
                <option value="land">Agricultural Land</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Tenant Phone</label>
            <input
              type="text"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              placeholder="+92 300 0000000"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Investor } from '../types';

export const Investors: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const investors = getRecords<Investor>('investors');
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<Investor['kind']>('individual');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCommitted, setNewCommitted] = useState('10000000');

  const filtered = investors.filter(inv => {
    const q = search.toLowerCase();
    return inv.name?.toLowerCase().includes(q) || inv.code?.toLowerCase().includes(q) || inv.email?.toLowerCase().includes(q);
  });

  const totalCommitted = investors.reduce((sum, inv) => sum + (inv.totalCommitted || 0), 0);
  const totalContributed = investors.reduce((sum, inv) => sum + (inv.totalContributed || 0), 0);
  const totalDistributed = investors.reduce((sum, inv) => sum + (inv.totalDistributed || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const comPaise = Math.round((parseFloat(newCommitted) || 5000000) * 100);
    const newInv: Investor = {
      id: `inv-${Date.now()}`,
      code: `INV-00${investors.length + 1}`,
      name: newName || 'Syndicate Partner',
      kind: newKind,
      phone: newPhone || '+92 300 0000 000',
      email: newEmail || 'partner@example.com',
      totalCommitted: comPaise,
      totalContributed: comPaise,
      totalDistributed: 0,
      activeProjectsCount: 1,
      joinedOn: new Date().toISOString().slice(0, 10)
    };
    addRecord('investors', newInv);
    setIsSheetOpen(false);
    setNewName('');
  };

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Investor Name', key: 'name' },
    { header: 'Type', key: 'kind' },
    { header: 'Committed', key: 'totalCommitted', format: val => formatPKR(val) },
    { header: 'Contributed', key: 'totalContributed', format: val => formatPKR(val) },
    { header: 'Distributed', key: 'totalDistributed', format: val => formatPKR(val) },
    { header: 'Active Projects', key: 'activeProjectsCount' }
  ];

  const columns: Column<Investor>[] = [
    {
      header: 'INVESTOR',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.phone}</div>
        </div>
      )
    },
    {
      header: 'TYPE',
      cell: row => <span className="capitalize font-medium text-fg">{row.kind}</span>
    },
    {
      header: 'COMMITTED',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.totalCommitted)}</span>
    },
    {
      header: 'CONTRIBUTED',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.totalContributed)}</span>
    },
    {
      header: 'DISTRIBUTED',
      cell: row => <span className="font-semibold text-success">{formatPKR(row.totalDistributed)}</span>
    },
    {
      header: 'PROJECTS',
      align: 'center',
      cell: row => <span className="font-medium text-fg">{row.activeProjectsCount || 1} live</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Investors & Co-owners"
        subtitle="Capital accounts, syndication partners, distributions, and drawdowns."
        onExportExcel={() => exportToExcel('Investors Register', exportColumns, filtered, 'investors')}
        onExportPdf={() => exportToPdf('Investors & Capital Accounts', exportColumns, filtered, 'investors')}
        primaryActionLabel="+ New investor"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${investors.length} Investors`} label="Registered Partners" />
        <KpiCard value={formatPKR(totalCommitted)} label="Total Capital Committed" variant="info" />
        <KpiCard value={formatPKR(totalContributed)} label="Capital Called / Paid In" />
        <KpiCard value={formatPKR(totalDistributed)} label="Distributions Paid" variant="success" />
      </div>

      <Toolbar
        searchPlaceholder="Search investors by name, code or email..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="+ New investor"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <DataTable columns={columns} data={filtered} />

      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Register New Investor"
        subtitle="Create investor record for cap table tracking and distribution allocations."
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
              form="inv-form"
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold"
            >
              Save Investor
            </button>
          </>
        }
      >
        <form id="inv-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Full Name / Entity *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Tariq Ahmed Qureshi"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Investor Kind</label>
            <select
              value={newKind}
              onChange={e => setNewKind(e.target.value as any)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            >
              <option value="individual">Individual</option>
              <option value="family-office">Family Office</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Phone</label>
              <input
                type="text"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="investor@domain.com"
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Capital Commitment (PKR)</label>
            <input
              type="number"
              value={newCommitted}
              onChange={e => setNewCommitted(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

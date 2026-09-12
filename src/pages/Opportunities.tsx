import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Opportunity } from '../types';

export const Opportunities: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const opportunities = getRecords<Opportunity>('opportunities');

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('agriculture-land');
  const [newTarget, setNewTarget] = useState('25000000');
  const [newRoi, setNewRoi] = useState('20');
  const [newLocation, setNewLocation] = useState('');

  const filtered = opportunities.filter(opp => {
    const q = search.toLowerCase();
    const matchesSearch =
      opp.title?.toLowerCase().includes(q) ||
      opp.code?.toLowerCase().includes(q) ||
      opp.location?.toLowerCase().includes(q);
    const matchesStage = stageFilter === 'all' || (opp.stage || (opp as any).status) === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalTargetFunding = opportunities.reduce((sum, o: any) => sum + (o.targetAmount || o.askingPrice || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPaise = Math.round((parseFloat(newTarget) || 10000000) * 100);
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      code: `OPP-0${opportunities.length + 25}`,
      title: newTitle || 'New Farmland Opportunity',
      type: newType,
      sector: newType.replace('-', ' '),
      targetAmount: targetPaise,
      minInvestment: Math.round(targetPaise * 0.1),
      expectedRoi: (parseFloat(newRoi) || 20) / 100,
      tenorMonths: 12,
      stage: 'open-for-funding',
      location: newLocation || 'Hyderabad District',
      summary: 'Investment memorandum under active allocation.'
    };
    addRecord('opportunities', newOpp);
    setIsSheetOpen(false);
    setNewTitle('');
  };

  const exportColumns: ExportColumn[] = [
    { header: 'Code', key: 'code' },
    { header: 'Title', key: 'title' },
    { header: 'Type', key: 'type' },
    { header: 'Target Amount', key: 'targetAmount', format: val => formatPKR(val) },
    { header: 'Expected ROI', key: 'expectedRoi', format: val => `${((val || 0) * 100).toFixed(0)}%` },
    { header: 'Stage', key: 'stage' },
    { header: 'Location', key: 'location' }
  ];

  const columns: Column<Opportunity>[] = [
    {
      header: 'OPPORTUNITY',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.title}</div>
          <div className="text-[11px] text-muted">{row.code} · {row.location}</div>
        </div>
      )
    },
    {
      header: 'TYPE',
      cell: row => (
        <span className="capitalize font-medium text-fg">
          {String(row.type || 'deal').replace(/-/g, ' ')}
        </span>
      )
    },
    {
      header: 'TARGET AMOUNT',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.targetAmount || (row as any).askingPrice || 0)}</span>
    },
    {
      header: 'EXPECTED ROI',
      cell: row => (
        <span className="font-semibold text-success">
          {(((row.expectedRoi || (row as any).estimatedRoi || 0) as number) * 100).toFixed(0)}%
        </span>
      )
    },
    {
      header: 'STAGE',
      cell: row => (
        <Badge status={row.status === 'shortlisted' ? 'active' : 'notice'}>
          {String(row.status || row.stage || 'evaluation').replace(/-/g, ' ')}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Sparkles}
        title="Opportunities Pipeline"
        subtitle="Vetted real estate parcels, commodity seasons, and syndicated business deals."
        onExportExcel={() => exportToExcel('Investment Pipeline', exportColumns, filtered, 'pipeline')}
        onExportPdf={() => exportToPdf('Investment Opportunities Memorandum', exportColumns, filtered, 'pipeline')}
        primaryActionLabel="+ New opportunity"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${opportunities.length} Deals`} label="Total Deal Flow" />
        <KpiCard value={formatPKR(totalTargetFunding)} label="Target Capital Required" variant="info" />
        <KpiCard value="21.5%" label="Average Projected ROI" variant="success" />
        <KpiCard value="4 Live" label="Open for Syndication" variant="success" />
      </div>

      <Toolbar
        searchPlaceholder="Search opportunities by title or location..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'stage',
            label: 'All stages',
            value: stageFilter,
            options: [
              { label: 'All stages', value: 'all' },
              { label: 'Open for funding', value: 'open-for-funding' },
              { label: 'Due diligence', value: 'due-diligence' },
              { label: 'Review', value: 'review' }
            ],
            onChange: setStageFilter
          }
        ]}
        primaryActionLabel="+ New opportunity"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <DataTable columns={columns} data={filtered} />

      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Add New Opportunity"
        subtitle="Register incoming deal for due diligence and investor allocations."
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
              form="opp-form"
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold"
            >
              Create Opportunity
            </button>
          </>
        }
      >
        <form id="opp-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Title *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Agricultural Land — Tando Bago (50 Acres)"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Target Amount (PKR) *</label>
            <input
              type="number"
              required
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Expected ROI (%)</label>
            <input
              type="number"
              value={newRoi}
              onChange={e => setNewRoi(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              placeholder="e.g. Badin, Sindh"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

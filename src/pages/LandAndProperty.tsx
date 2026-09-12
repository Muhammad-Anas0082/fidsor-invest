import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { InfoBanner } from '../components/ui/InfoBanner';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Property } from '../types';

export const LandAndProperty: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const rawProperties = getRecords<Property>('properties');

  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // New property form state
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<Property['kind']>('residential-apartment');
  const [newIntent, setNewIntent] = useState<Property['intent']>('rent');
  const [newCity, setNewCity] = useState('Hyderabad');
  const [newArea, setNewArea] = useState('Qasimabad');
  const [newCost, setNewCost] = useState('18000000');
  const [newValuation, setNewValuation] = useState('20000000');
  const [newSize, setNewSize] = useState('1,250 sq ft');

  // Filter properties
  const filteredProperties = rawProperties.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q);

    const matchesKind =
      kindFilter === 'all' || p.kind?.toLowerCase() === kindFilter.toLowerCase();

    const matchesIntent =
      intentFilter === 'all' || p.intent?.toLowerCase() === intentFilter.toLowerCase();

    const matchesCity =
      cityFilter === 'all' || p.city?.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesKind && matchesIntent && matchesCity;
  });

  // KPI calculations
  const heldProps = rawProperties.filter(p => p.status !== 'sold');
  const totalCost = heldProps.reduce(
    (sum, p: any) => sum + (p.totalCost || (p.purchasePrice || 0) + (p.acquisitionCosts || 0) + (p.developmentCost || 0)),
    0
  );
  const totalValue = heldProps.reduce((sum, p) => sum + (p.currentValue || 0), 0);
  const gain = totalValue - totalCost;
  const occupancyPct = 71; // 5 of 7 let
  const monthlyRent = 67700000; // PKR 677K

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(newCost) || 10000000;
    const valNum = parseFloat(newValuation) || costNum;
    const costPaise = Math.round(costNum * 100);
    const valPaise = Math.round(valNum * 100);
    const gainPaise = valPaise - costPaise;
    const gainPct = costPaise > 0 ? (gainPaise / costPaise) * 100 : 0;

    const newProperty: Property = {
      id: `prp-${Date.now()}`,
      code: `PR-HYD-${rawProperties.length + 1}`,
      name: newName || 'New Latifabad Unit',
      kind: newKind,
      intent: newIntent,
      status: newIntent === 'rent' ? 'rented' : newIntent === 'lease' ? 'leased' : 'held',
      location: `${newArea}, ${newCity}`,
      city: newCity,
      area: newArea,
      sizeLabel: newSize,
      purchasedOn: new Date().toISOString().slice(0, 10),
      acquisitionCost: costPaise,
      incidentalCost: 0,
      totalCost: costPaise,
      currentValue: valPaise,
      gain: gainPaise,
      gainPct: Math.round(gainPct * 10) / 10,
      monthlyRent: newIntent === 'rent' ? Math.round(valPaise * 0.005) : undefined
    };

    addRecord('properties', newProperty);
    setIsSheetOpen(false);
    setNewName('');
  };

  // Export columns
  const exportColumns: ExportColumn[] = [
    { header: 'Property Code', key: 'code' },
    { header: 'Name', key: 'name' },
    { header: 'Location', key: 'location' },
    { header: 'Size', key: 'sizeLabel' },
    { header: 'Intent', key: 'intent' },
    { header: 'Total Cost', key: 'totalCost', format: val => formatPKR(val) },
    { header: 'Current Value', key: 'currentValue', format: val => formatPKR(val) },
    { header: 'Gain', key: 'gain', format: val => formatPKR(val) },
    { header: 'Status', key: 'status' }
  ];

  const handleExportExcel = () => {
    exportToExcel('Land & Property Register', exportColumns, filteredProperties, 'land-property');
  };

  const handleExportPdf = () => {
    exportToPdf('Land & Property Register', exportColumns, filteredProperties, 'land-property');
  };

  // Table Columns
  const columns: Column<Property>[] = [
    {
      header: 'PROPERTY',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.name}</div>
          <div className="text-[11px] text-muted">
            {row.code} · {row.location || `${row.area}, ${row.city}`}
          </div>
        </div>
      )
    },
    {
      header: 'SIZE',
      cell: row => <span className="font-medium text-fg">{row.sizeLabel || '—'}</span>
    },
    {
      header: 'HELD FOR',
      cell: row => {
        const intentColors: Record<string, string> = {
          hold: 'text-success font-semibold',
          lease: 'text-brand dark:text-sky font-semibold',
          rent: 'text-success font-semibold',
          resale: 'text-warning font-semibold',
          develop: 'text-purple-600 dark:text-purple-400 font-semibold'
        };
        const color = intentColors[row.intent] || 'text-fg font-medium';
        return (
          <span className={`capitalize text-xs ${color}`}>
            {row.intent}
          </span>
        );
      }
    },
    {
      header: 'OCCUPANCY',
      cell: row => {
        if (row.intent === 'rent' || row.occupancyUnits) {
          const occ = row.occupancyUnits || { total: 4, let: 3 };
          const pct = (occ.let / occ.total) * 100;
          return (
            <div className="flex items-center gap-2">
              <ProgressBar value={pct} isFraction={false} color={pct < 100 ? 'orange' : 'green'} />
              <span className="text-[11px] text-muted">
                {occ.let}/{occ.total} let
              </span>
            </div>
          );
        }
        return <span className="text-muted">—</span>;
      }
    },
    {
      header: 'PURCHASED',
      cell: row => <span className="text-muted">{formatDate(row.purchasedOn)}</span>
    },
    {
      header: 'TOTAL COST',
      cell: row => (
        <span className="font-semibold text-fg">
          {formatPKR(row.totalCost || row.acquisitionCost)}
        </span>
      )
    },
    {
      header: 'VALUE',
      cell: row => (
        <span className="font-semibold text-fg">{formatPKR(row.currentValue)}</span>
      )
    },
    {
      header: 'GAIN',
      cell: row => {
        const isPos = (row.gain || 0) >= 0;
        return (
          <div>
            <div className={`font-semibold ${isPos ? 'text-success' : 'text-danger'}`}>
              {isPos ? `+${formatPKR(row.gain)}` : formatPKR(row.gain)}
            </div>
            <div className={`text-[11px] ${isPos ? 'text-success/80' : 'text-danger/80'}`}>
              {row.gainPct ? `${row.gainPct > 0 ? '+' : ''}${row.gainPct}%` : '+0%'}
            </div>
          </div>
        );
      }
    },
    {
      header: 'STATUS',
      cell: row => {
        const statusMap: Record<string, string> = {
          held: 'Held',
          leased: 'Leased',
          rented: 'Rented',
          'partially-rented': 'Partially rented',
          'under-construction': 'Under construction',
          sold: 'Sold'
        };
        return (
          <Badge status={row.status}>
            {statusMap[row.status] || row.status}
          </Badge>
        );
      }
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'kind',
      label: 'All kind',
      value: kindFilter,
      options: [
        { label: 'All kind', value: 'all' },
        { label: 'Agricultural Land', value: 'agricultural-land' },
        { label: 'Commercial Plot', value: 'commercial-plot' },
        { label: 'Residential Plot', value: 'residential-plot' },
        { label: 'Residential Apartment', value: 'residential-apartment' },
        { label: 'Commercial Building', value: 'commercial-building' }
      ],
      onChange: setKindFilter
    },
    {
      key: 'intent',
      label: 'All intent',
      value: intentFilter,
      options: [
        { label: 'All intent', value: 'all' },
        { label: 'Hold', value: 'hold' },
        { label: 'Lease', value: 'lease' },
        { label: 'Rent', value: 'rent' },
        { label: 'Resale', value: 'resale' },
        { label: 'Develop', value: 'develop' }
      ],
      onChange: setIntentFilter
    },
    {
      key: 'city',
      label: 'All city',
      value: cityFilter,
      options: [
        { label: 'All city', value: 'all' },
        { label: 'Hyderabad', value: 'hyderabad' },
        { label: 'Karachi', value: 'karachi' },
        { label: 'Tando Allahyar', value: 'tando allahyar' },
        { label: 'Hala', value: 'hala' }
      ],
      onChange: setCityFilter
    }
  ];

  return (
    <div className="space-y-6">
      {/* Step 4 Page Header */}
      <PageHeader
        icon={Building2}
        title="Land & property"
        subtitle="Farmland, plots, apartments, shops and a building under construction — one register, five intents."
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        primaryActionLabel="+ New property"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      {/* Step 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          value={`${heldProps.length} Held`}
          label="In portfolio"
          subtext="2 sold"
        />
        <KpiCard
          value={formatPKR(totalCost)}
          label="Total cost"
        />
        <KpiCard
          value={formatPKR(totalValue)}
          label="Current value"
        />
        <KpiCard
          value={formatPKR(gain)}
          label="Gain"
          variant="success"
        />
        <KpiCard
          value={`${occupancyPct}%`}
          label="Occupancy"
          subtext="5 of 7 units let"
          variant="info"
        />
        <KpiCard
          value={formatPKR(monthlyRent)}
          label="Monthly rent"
          subtext="Monthly-equivalent across every live contract"
          variant="success"
        />
      </div>

      {/* Step 4 Warning Banner */}
      <InfoBanner
        title="1 unit is vacant and 1 on notice"
        message="A vacant unit costs the society charges and earns nothing — it is the quietest way a rental portfolio loses money."
        variant="warning"
      />

      {/* Step 4 Toolbar */}
      <Toolbar
        searchPlaceholder="Search by name, code or area..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
        primaryActionLabel="+ New property"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      {/* Step 4 Table */}
      <DataTable columns={columns} data={filteredProperties} />

      {/* New Property Form Sheet */}
      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="New property"
        subtitle="Acquisition or land parcel registration into the portfolio."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsSheetOpen(false)}
              className="px-4 py-2 rounded-lg border border-hairline bg-card hover:bg-wash text-xs font-medium text-fg"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="property-form"
              className="px-4 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-semibold"
            >
              Register Property
            </button>
          </>
        }
      >
        <form id="property-form" onSubmit={handleCreateProperty} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Property Name *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Farmland — Hala Road"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Kind</label>
              <select
                value={newKind}
                onChange={e => setNewKind(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              >
                <option value="agricultural-land">Agricultural Land</option>
                <option value="commercial-plot">Commercial Plot</option>
                <option value="residential-plot">Residential Plot</option>
                <option value="residential-apartment">Residential Apartment</option>
                <option value="commercial-building">Commercial Building</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Intent</label>
              <select
                value={newIntent}
                onChange={e => setNewIntent(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              >
                <option value="hold">Hold</option>
                <option value="lease">Lease</option>
                <option value="rent">Rent</option>
                <option value="resale">Resale</option>
                <option value="develop">Develop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">City</label>
              <input
                type="text"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                placeholder="Hyderabad"
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Area / Locality</label>
              <input
                type="text"
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                placeholder="Qasimabad"
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Size / Dimension</label>
            <input
              type="text"
              value={newSize}
              onChange={e => setNewSize(e.target.value)}
              placeholder="e.g. 10 Acres or 240 sq yd"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Acquisition Cost (PKR) *</label>
              <input
                type="number"
                required
                value={newCost}
                onChange={e => setNewCost(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Current Valuation (PKR)</label>
              <input
                type="number"
                value={newValuation}
                onChange={e => setNewValuation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

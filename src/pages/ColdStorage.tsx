import React, { useState } from 'react';
import { Snowflake, Thermometer, Box, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { InfoBanner } from '../components/ui/InfoBanner';
import { Tabs } from '../components/ui/Tabs';
import { Toolbar, FilterOption } from '../components/ui/Toolbar';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FormSheet } from '../components/ui/FormSheet';
import { formatPKR, formatKg } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { StorageLot, StorageOverhead } from '../types';

export const ColdStorage: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const rawLots = getRecords<StorageLot>('storageLots');
  const rawOverheads = getRecords<StorageOverhead>('storageOverheads');

  const [season, setSeason] = useState<'CS-2026' | 'CS-2025'>('CS-2026');
  const [activeTab, setActiveTab] = useState('lots');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // New lot form state
  const [newProduct, setNewProduct] = useState('Aseel — Grade A');
  const [newSupplier, setNewSupplier] = useState('');
  const [newOrigin, setNewOrigin] = useState('Khairpur Mirs');
  const [newChamber, setNewChamber] = useState('CH-01');
  const [newBoughtKg, setNewBoughtKg] = useState('30000');
  const [newPurchasePrice, setNewPurchasePrice] = useState('180');
  const [newTransportPerKg, setNewTransportPerKg] = useState('25');

  // Filter lots
  const filteredLots = rawLots.filter(lot => {
    const q = search.toLowerCase();
    const matchesSearch =
      lot.product?.toLowerCase().includes(q) ||
      lot.supplier?.toLowerCase().includes(q) ||
      lot.code?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'in-storage'
        ? lot.status === 'in-storage'
        : lot.status === 'partially-sold';

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const inStoreLots = rawLots.filter(l => l.status !== 'exhausted');
  const totalInStoreKg = inStoreLots.reduce((sum, l) => sum + (l.leftKg || 0), 0);
  const totalSoldKg = rawLots.reduce((sum, l) => sum + ((l.boughtKg || 0) - (l.leftKg || 0)), 0);
  const totalStockValue = rawLots.reduce((sum, l) => sum + (l.stockValue || 0), 0);
  const totalRevenue = rawLots.reduce((sum, l) => sum + (l.revenue || 0), 0);
  const grossMargin = 300000000; // PKR 3.0M
  const overheadsTotal = 610000000; // PKR 6.1M
  const netMargin = -300000000; // -PKR 3.0M

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const boughtNum = parseFloat(newBoughtKg) || 10000;
    const gatePriceNum = parseFloat(newPurchasePrice) || 180;
    const transNum = parseFloat(newTransportPerKg) || 25;
    const landedPerKg = gatePriceNum + transNum;
    const stockValPaise = Math.round(boughtNum * landedPerKg * 100);

    const newLot: StorageLot = {
      id: `lot-${Date.now()}`,
      code: `LOT-26-0${rawLots.length + 1}`,
      projectId: 'prj-cs-01',
      product: newProduct,
      supplier: newSupplier || 'Khairpur Date Farms',
      origin: newOrigin,
      chamberCode: newChamber,
      purchasedOn: new Date().toISOString().slice(0, 10),
      boughtKg: boughtNum,
      leftKg: boughtNum,
      purchasePricePerKg: gatePriceNum,
      transportHandlingPerKg: transNum,
      landedCostPerKg: landedPerKg,
      currentGatePricePerKg: gatePriceNum + 15,
      stockValue: stockValPaise,
      revenue: 0,
      grossMargin: 0,
      grossMarginPct: 0,
      status: 'in-storage',
      daysHeld: 1
    };

    addRecord('storageLots', newLot);
    setIsSheetOpen(false);
    setNewSupplier('');
  };

  // Export Columns
  const exportColumns: ExportColumn[] = [
    { header: 'Lot Code', key: 'code' },
    { header: 'Product', key: 'product' },
    { header: 'Supplier', key: 'supplier' },
    { header: 'Chamber', key: 'chamberCode' },
    { header: 'Bought (kg)', key: 'boughtKg', format: val => formatKg(val) },
    { header: 'Left (kg)', key: 'leftKg', format: val => formatKg(val) },
    { header: 'Landed/kg', key: 'landedCostPerKg', format: val => `PKR ${val}` },
    { header: 'Stock Value', key: 'stockValue', format: val => formatPKR(val) },
    { header: 'Revenue', key: 'revenue', format: val => formatPKR(val) },
    { header: 'Gross Margin', key: 'grossMargin', format: val => formatPKR(val) },
    { header: 'Status', key: 'status' }
  ];

  const handleExportExcel = () => {
    exportToExcel('Cold Storage Lots', exportColumns, filteredLots, 'cold-storage-lots');
  };

  const handleExportPdf = () => {
    exportToPdf('Cold Storage Register', exportColumns, filteredLots, 'cold-storage-lots');
  };

  // Table Columns
  const columns: Column<StorageLot>[] = [
    {
      header: 'LOT',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.product}</div>
          <div className="text-[11px] text-muted">
            {row.code} · {row.supplier || 'Khairpur Farms'} · {row.daysHeld || 45}d held
          </div>
        </div>
      )
    },
    {
      header: 'CHAMBER',
      cell: row => (
        <div>
          <span className="font-semibold text-fg">{row.chamberCode || 'CH-01'}</span>
          <div className="text-[11px] text-muted">Sukkur Chamber</div>
        </div>
      )
    },
    {
      header: 'BOUGHT / LEFT',
      cell: row => (
        <div>
          <div className="font-semibold text-fg">{formatKg(row.leftKg)} left</div>
          <div className="text-[11px] text-muted">of {formatKg(row.boughtKg)} bought</div>
        </div>
      )
    },
    {
      header: 'LANDED / KG',
      cell: row => (
        <div>
          <div className="font-semibold text-fg">PKR {row.landedCostPerKg || 210}</div>
          <div className="text-[11px] text-muted">Gate PKR {row.purchasePricePerKg || 185}</div>
        </div>
      )
    },
    {
      header: 'STOCK VALUE',
      cell: row => <div className="font-semibold text-fg">{formatPKR(row.stockValue)}</div>
    },
    {
      header: 'REVENUE',
      cell: row => <div className="font-medium text-fg">{formatPKR(row.revenue)}</div>
    },
    {
      header: 'GROSS MARGIN',
      cell: row => {
        const isPos = (row.grossMargin || 0) >= 0;
        return (
          <div>
            <div className={`font-semibold ${isPos ? 'text-success' : 'text-danger'}`}>
              {formatPKR(row.grossMargin || 0)}
            </div>
            <div className={`text-[11px] ${isPos ? 'text-success/80' : 'text-danger/80'}`}>
              {row.grossMarginPct ? `${row.grossMarginPct > 0 ? '+' : ''}${row.grossMarginPct}%` : '+0%'}
            </div>
          </div>
        );
      }
    },
    {
      header: 'STATUS',
      cell: row => (
        <Badge status={row.status}>
          {row.status === 'in-storage' ? 'In storage' : 'Partially sold'}
        </Badge>
      )
    }
  ];

  const overheadColumns: Column<StorageOverhead>[] = [
    {
      header: 'MONTH',
      cell: row => <span className="font-semibold text-fg">{row.month}</span>
    },
    {
      header: 'EXPENSE CATEGORY',
      cell: row => {
        const catMap: Record<string, string> = {
          electricity: 'Electricity & Grid',
          'facility-rent': 'Facility Lease',
          labour: 'Loading & Sorting Labour',
          maintenance: 'Compressor & Chiller Maintenance',
          other: 'Fumigation & Inspection'
        };
        const statusMap: Record<string, 'active' | 'warning' | 'info' | 'notice'> = {
          electricity: 'warning',
          'facility-rent': 'active',
          labour: 'info',
          maintenance: 'notice',
          other: 'info'
        };
        return (
          <Badge status={statusMap[row.category] || 'info'}>
            {catMap[row.category] || row.category}
          </Badge>
        );
      }
    },
    {
      header: 'AMOUNT',
      align: 'right',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.amount)}</span>
    },
    {
      header: 'OPERATIONAL NOTE',
      cell: row => <span className="text-muted text-xs">{row.note}</span>
    }
  ];

  const chambers = [
    {
      code: 'CH-01',
      name: 'Chamber 1 — Sukkur Cold Facility',
      temp: '-2.0°C',
      targetTemp: '-2.0°C',
      capacityKg: 100000,
      currentKg: 68000,
      lotsStored: ['Aseel — Grade A (LOT-26-01)', 'Aseel — Grade B (LOT-26-02)'],
      status: 'Active Cooling'
    },
    {
      code: 'CH-02',
      name: 'Chamber 2 — Sukkur Cold Facility',
      temp: '-1.8°C',
      targetTemp: '-2.0°C',
      capacityKg: 100000,
      currentKg: 54000,
      lotsStored: ['Dhakki — Premium (LOT-26-04)', 'Karbalain — Grade A (LOT-26-03)'],
      status: 'Active Cooling'
    },
    {
      code: 'CH-03',
      name: 'Chamber 3 — Sukkur Cold Facility',
      temp: '-2.2°C',
      targetTemp: '-2.0°C',
      capacityKg: 100000,
      currentKg: 28000,
      lotsStored: ['Karbalain — Grade B (LOT-26-05)'],
      status: 'Active Cooling'
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'All status',
      value: statusFilter,
      options: [
        { label: 'All status', value: 'all' },
        { label: 'In storage', value: 'in-storage' },
        { label: 'Partially sold', value: 'partially-sold' }
      ],
      onChange: setStatusFilter
    }
  ];

  return (
    <div className="space-y-6">
      {/* Step 4 Page Header with Season Toggle Buttons */}
      <PageHeader
        icon={Snowflake}
        title="Cold storage"
        subtitle="Dates bought at the harvest, held in chamber and released against winter demand. Margin is measured against landed cost, never against the purchase price."
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        primaryActionLabel="+ Buy a lot"
        onPrimaryAction={() => setIsSheetOpen(true)}
      >
        <div className="flex items-center bg-card border border-hairline rounded-lg p-0.5 shadow-2xs">
          <button
            onClick={() => setSeason('CS-2026')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              season === 'CS-2026'
                ? 'bg-brand text-white shadow-xs'
                : 'text-muted hover:text-fg'
            }`}
          >
            CS-2026
          </button>
          <button
            onClick={() => setSeason('CS-2025')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              season === 'CS-2025'
                ? 'bg-brand text-white shadow-xs'
                : 'text-muted hover:text-fg'
            }`}
          >
            CS-2025
          </button>
        </div>
      </PageHeader>

      {/* Step 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard value={`${inStoreLots.length} Lots`} label="Active stock" />
        <KpiCard
          value={formatKg(totalInStoreKg)}
          label="In store"
          subtext={`${formatPKR(totalStockValue)} at landed cost`}
        />
        <KpiCard
          value={formatKg(totalSoldKg)}
          label="Sold"
          subtext={`${formatPKR(totalRevenue)} revenue`}
          variant="success"
        />
        <KpiCard
          value={formatPKR(grossMargin)}
          label="Gross margin"
          subtext="Revenue less landed cost of what left"
          variant="success"
        />
        <KpiCard
          value={formatPKR(overheadsTotal)}
          label="Overheads"
          subtext="Electricity, labour, facility rent"
        />
        <KpiCard
          value={formatPKR(netMargin)}
          label="Net margin"
          variant="danger"
        />
      </div>

      {/* Step 4 Info Banner */}
      <InfoBanner
        title="What another month in the chamber costs"
        message="Holding stock costs PKR 13.51 per kilo per month at the current stock level. On 150,000 kg that is PKR 2.0M a month, and it rises as the chamber empties."
        variant="info"
      />

      {/* Step 4 Tabs */}
      <Tabs
        tabs={[
          { id: 'lots', label: 'Stock lots', count: rawLots.length },
          { id: 'chambers', label: 'Chambers', count: 3 },
          { id: 'overheads', label: 'Overheads', count: rawOverheads.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab-dependent Views */}
      {activeTab === 'lots' && (
        <>
          {/* Toolbar */}
          <Toolbar
            searchPlaceholder="Search by product, supplier or code."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filterOptions}
            primaryActionLabel="+ Buy a lot"
            onPrimaryAction={() => setIsSheetOpen(true)}
          />

          {/* Lots Table */}
          <DataTable columns={columns} data={filteredLots} />
        </>
      )}

      {activeTab === 'chambers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chambers.map(ch => {
              const utilPct = Math.round((ch.currentKg / ch.capacityKg) * 100);
              return (
                <div key={ch.code} className="bg-card border border-hairline rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-brand dark:text-sky" />
                        <span className="font-bold text-sm text-fg">{ch.code}</span>
                      </div>
                      <Badge status="active">{ch.status}</Badge>
                    </div>
                    <div className="text-xs text-muted font-medium mb-3">{ch.name}</div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-wash/50 border border-hairline mb-3">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-brand dark:text-sky" />
                        <span className="text-xs text-fg font-semibold">Chamber Temp</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand dark:text-sky">{ch.temp}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Utilization ({utilPct}%)</span>
                        <span className="font-semibold text-fg">{formatKg(ch.currentKg)} / {formatKg(ch.capacityKg)}</span>
                      </div>
                      <ProgressBar value={utilPct} isFraction={false} color={utilPct > 70 ? 'blue' : 'green'} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline">
                    <span className="text-[11px] text-muted font-medium block mb-1.5">Assigned lots:</span>
                    <div className="flex flex-wrap gap-1">
                      {ch.lotsStored.map((lot, idx) => (
                        <span key={idx} className="inline-block text-[10px] px-2 py-0.5 rounded bg-wash border border-hairline text-fg font-medium">
                          {lot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'overheads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard value={formatPKR(rawOverheads.filter(o => o.category === 'electricity').reduce((s, o) => s + (o.amount || 0), 0))} label="Total Electricity Draw" variant="warning" />
            <KpiCard value={formatPKR(rawOverheads.filter(o => o.category === 'facility-rent').reduce((s, o) => s + (o.amount || 0), 0))} label="Chamber Facility Rent" variant="info" />
            <KpiCard value={formatPKR(rawOverheads.filter(o => o.category === 'labour').reduce((s, o) => s + (o.amount || 0), 0))} label="Handling & Sorting Labour" />
          </div>

          <DataTable columns={overheadColumns} data={rawOverheads} />
        </div>
      )}

      {/* Buy a Lot Sheet Form */}
      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Buy a lot into store"
        subtitle="Landed cost — purchase plus transport, handling and packaging — is what every margin is measured against."
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
              form="lot-form"
              className="px-4 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-semibold"
            >
              Book Lot Into Chamber
            </button>
          </>
        }
      >
        <form id="lot-form" onSubmit={handleCreateLot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Product Grade *</label>
            <select
              value={newProduct}
              onChange={e => setNewProduct(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            >
              <option value="Dhakki — Premium">Dhakki — Premium</option>
              <option value="Karbalain — Grade A">Karbalain — Grade A</option>
              <option value="Karbalain — Grade B">Karbalain — Grade B</option>
              <option value="Aseel — Grade A">Aseel — Grade A</option>
              <option value="Aseel — Grade B">Aseel — Grade B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Supplier *</label>
            <input
              type="text"
              required
              value={newSupplier}
              onChange={e => setNewSupplier(e.target.value)}
              placeholder="e.g. Dera Fruit Traders · Dera Ismail Khan"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Origin Market</label>
              <input
                type="text"
                value={newOrigin}
                onChange={e => setNewOrigin(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Chamber Code</label>
              <select
                value={newChamber}
                onChange={e => setNewChamber(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              >
                <option value="CH-01">Chamber 01 (Sukkur)</option>
                <option value="CH-02">Chamber 02 (Sukkur)</option>
                <option value="CH-03">Chamber 03 (Sukkur)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Quantity (Kg) *</label>
              <input
                type="number"
                required
                value={newBoughtKg}
                onChange={e => setNewBoughtKg(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Gate Price / Kg</label>
              <input
                type="number"
                value={newPurchasePrice}
                onChange={e => setNewPurchasePrice(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Transport / Kg</label>
              <input
                type="number"
                value={newTransportPerKg}
                onChange={e => setNewTransportPerKg(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

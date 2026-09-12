import React, { useState } from 'react';
import { Coins, ArrowRightLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';

export const Currency: React.FC = () => {
  const { getRecords } = useData();
  const rawFxTrades = getRecords('fxTrades');
  const [search, setSearch] = useState('');

  const fxHoldings = [
    { currency: 'USD', name: 'US Dollar', balance: 35000, rate: 278.5, pkrVal: 974750000 },
    { currency: 'AED', name: 'UAE Dirham', balance: 67000, rate: 75.8, pkrVal: 507860000 }
  ];

  const totalPkr = fxHoldings.reduce((sum, f) => sum + f.pkrVal, 0);

  const filteredTrades = rawFxTrades.filter((t: any) => {
    const q = search.toLowerCase();
    return t.currency?.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q);
  });

  const exportColumns: ExportColumn[] = [
    { header: 'Date', key: 'date', format: val => formatDate(val) },
    { header: 'Currency', key: 'currency' },
    { header: 'Action', key: 'action' },
    { header: 'Foreign Amount', key: 'amount' },
    { header: 'Exchange Rate', key: 'rate' },
    { header: 'PKR Equivalent', key: 'pkrAmount', format: val => formatPKR(val) }
  ];

  const columns: Column<any>[] = [
    {
      header: 'DATE',
      cell: row => <span className="font-semibold text-fg">{formatDate(row.date)}</span>
    },
    {
      header: 'CURRENCY',
      cell: row => (
        <span className="font-bold text-brand dark:text-sky">
          {row.currency}
        </span>
      )
    },
    {
      header: 'ACTION',
      cell: row => (
        <Badge status={row.action === 'buy' ? 'active' : 'info'}>
          {row.action === 'buy' ? 'Buy FCY' : 'Sell FCY'}
        </Badge>
      )
    },
    {
      header: 'FOREIGN AMOUNT',
      cell: row => <span className="font-semibold text-fg">{new Intl.NumberFormat().format(row.amount || 5000)}</span>
    },
    {
      header: 'RATE (PKR)',
      cell: row => <span className="text-muted">PKR {row.rate}</span>
    },
    {
      header: 'TOTAL PKR',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.pkrAmount || (row.amount * row.rate * 100))}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Coins}
        title="Foreign Currency Holdings"
        subtitle="USD and AED operational balances hedged against import costs and equipment purchase."
        onExportExcel={() => exportToExcel('FX Trades Register', exportColumns, filteredTrades, 'fx-trades')}
        onExportPdf={() => exportToPdf('Foreign Currency Holdings & Trades', exportColumns, filteredTrades, 'fx-trades')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard value={formatPKR(totalPkr)} label="Total FX Reserves (PKR)" variant="info" />
        <KpiCard value="$35,000 USD" label="US Dollar Reserves" subtext="@ PKR 278.50" variant="success" />
        <KpiCard value="67,000 AED" label="UAE Dirham Reserves" subtext="@ PKR 75.80" variant="success" />
      </div>

      <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-fg mb-3">Live Marked Reserves</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fxHoldings.map(f => (
            <div key={f.currency} className="p-4 rounded-lg bg-wash/40 border border-hairline flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand dark:text-sky">{f.currency} · {f.name}</span>
                <div className="text-lg font-extrabold text-fg mt-0.5">
                  {new Intl.NumberFormat().format(f.balance)} {f.currency}
                </div>
                <div className="text-[11px] text-muted">Conversion rate: PKR {f.rate.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted">Carrying value</span>
                <div className="text-sm font-bold text-fg">{formatPKR(f.pkrVal)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toolbar
        searchPlaceholder="Search currency trades..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filteredTrades} />
    </div>
  );
};

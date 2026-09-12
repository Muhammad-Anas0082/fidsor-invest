import React, { useState } from 'react';
import { LineChart as LineChartIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Security } from '../types';

export const Equity: React.FC = () => {
  const { getRecords } = useData();
  const securities = getRecords<Security>('securities');
  const [search, setSearch] = useState('');

  const filtered = securities.filter(s => {
    const q = search.toLowerCase();
    return s.name?.toLowerCase().includes(q) || s.symbol?.toLowerCase().includes(q) || s.sector?.toLowerCase().includes(q);
  });

  const totalMarketVal = securities.reduce((sum, s) => sum + (s.marketValue || (s.shares * s.currentPrice * 100) || 0), 0);
  const totalCost = securities.reduce((sum, s) => sum + ((s.shares * s.avgCost * 100) || 0), 0);
  const totalGain = totalMarketVal - totalCost;

  const exportColumns: ExportColumn[] = [
    { header: 'Symbol', key: 'symbol' },
    { header: 'Company Name', key: 'name' },
    { header: 'Sector', key: 'sector' },
    { header: 'Shares', key: 'shares' },
    { header: 'Avg Cost (PKR)', key: 'avgCost' },
    { header: 'Current Price (PKR)', key: 'currentPrice' },
    { header: 'Market Value', key: 'marketValue', format: val => formatPKR(val) },
    { header: 'Unrealized Gain', key: 'unrealizedGain', format: val => formatPKR(val) }
  ];

  const columns: Column<Security>[] = [
    {
      header: 'INSTRUMENT',
      cell: row => (
        <div>
          <div className="font-bold text-fg hover:text-brand cursor-pointer">{row.symbol}</div>
          <div className="text-[11px] text-muted">{row.name} · {row.sector}</div>
        </div>
      )
    },
    {
      header: 'HOLDINGS',
      cell: row => (
        <div>
          <span className="font-semibold text-fg">{new Intl.NumberFormat().format(row.shares)} shares</span>
          <div className="text-[11px] text-muted">Avg PKR {row.avgCost}</div>
        </div>
      )
    },
    {
      header: 'MARKET PRICE',
      cell: row => (
        <div>
          <span className="font-semibold text-fg">PKR {row.currentPrice}</span>
          <div className="text-[11px] text-muted">PSX Regular</div>
        </div>
      )
    },
    {
      header: 'MARKET VALUE',
      cell: row => <span className="font-semibold text-fg">{formatPKR(row.marketValue || row.shares * row.currentPrice * 100)}</span>
    },
    {
      header: 'UNREALIZED GAIN',
      cell: row => {
        const gain = row.unrealizedGain || (row.shares * (row.currentPrice - row.avgCost) * 100);
        const isPos = gain >= 0;
        return (
          <span className={`font-semibold flex items-center gap-1 ${isPos ? 'text-success' : 'text-danger'}`}>
            {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPos ? '+' : ''}{formatPKR(gain)}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LineChartIcon}
        title="PSX Listed Equities"
        subtitle="Liquid positions in energy, banking, and fertilizer marked to market daily."
        onExportExcel={() => exportToExcel('PSX Equity Holdings', exportColumns, filtered, 'equity-holdings')}
        onExportPdf={() => exportToPdf('PSX Equity Portfolio Statement', exportColumns, filtered, 'equity-holdings')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={formatPKR(totalMarketVal)} label="Total Equity Value" variant="info" />
        <KpiCard value={formatPKR(totalCost)} label="Invested Capital" />
        <KpiCard value={formatPKR(totalGain)} label="Unrealized Gain" variant="success" />
        <KpiCard value={`${securities.length} Companies`} label="Concentrated PSX Portfolio" />
      </div>

      <Toolbar
        searchPlaceholder="Search securities by symbol, company or sector..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

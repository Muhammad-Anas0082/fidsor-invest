import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, Landmark } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { formatPKR, formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Transaction, Account } from '../types';

export const CashFlow: React.FC = () => {
  const { getRecords } = useData();
  const transactions = getRecords<Transaction>('transactions');
  const accounts = getRecords<Account>('accounts');

  const cashFlowHistory = [
    { month: 'Mar 26', Inflow: 42, Outflow: 28, Net: 14 },
    { month: 'Apr 26', Inflow: 38, Outflow: 31, Net: 7 },
    { month: 'May 26', Inflow: 49, Outflow: 22, Net: 27 },
    { month: 'Jun 26', Inflow: 55, Outflow: 36, Net: 19 },
    { month: 'Jul 26', Inflow: 62, Outflow: 40, Net: 22 },
    { month: 'Aug 26', Inflow: 71, Outflow: 33, Net: 38 }
  ];

  const totalInflow = transactions.filter(t => t.direction === 'in').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalOutflow = transactions.filter(t => t.direction === 'out').reduce((sum, t) => sum + (t.amount || 0), 0);
  const netCash = totalInflow - totalOutflow;

  const exportColumns: ExportColumn[] = [
    { header: 'Reference', key: 'code' },
    { header: 'Date', key: 'date' },
    { header: 'Direction', key: 'direction' },
    { header: 'Category', key: 'category' },
    { header: 'Amount', key: 'amount', format: val => formatPKR(val) },
    { header: 'Description', key: 'description' },
    { header: 'Status', key: 'status' }
  ];

  const columns: Column<Transaction>[] = [
    {
      header: 'ENTRY',
      cell: row => (
        <div>
          <div className="font-bold text-fg">{row.code || row.reference}</div>
          <div className="text-[11px] text-muted">{row.description}</div>
        </div>
      )
    },
    {
      header: 'DATE',
      cell: row => <span className="text-muted">{formatDate(row.date)}</span>
    },
    {
      header: 'CATEGORY',
      cell: row => (
        <span className="capitalize font-medium text-fg">
          {String(row.category || (row as any).type || 'general').replace(/-/g, ' ')}
        </span>
      )
    },
    {
      header: 'DIRECTION',
      cell: row => {
        const isIn = row.direction === 'in' || (row as any).flow === 'in';
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              isIn ? 'text-success' : 'text-danger'
            }`}
          >
            {isIn ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isIn ? 'Inflow' : 'Outflow'}
          </span>
        );
      }
    },
    {
      header: 'AMOUNT',
      align: 'right',
      cell: row => (
        <span
          className={`font-semibold text-xs ${
            row.direction === 'in' ? 'text-success' : 'text-fg'
          }`}
        >
          {row.direction === 'in' ? '+' : '-'}{formatPKR(row.amount)}
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
        icon={ArrowLeftRight}
        title="Cash Flow"
        subtitle="Operating, financing and investing cash flows consolidated across accounts."
        onExportExcel={() => exportToExcel('Cash Flow Statement', exportColumns, transactions, 'cash-flow')}
        onExportPdf={() => exportToPdf('Cash Flow Statement', exportColumns, transactions, 'cash-flow')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={formatPKR(netCash)} label="Net Operating Cash" variant="success" />
        <KpiCard value={formatPKR(totalInflow)} label="Gross Inflows" variant="info" />
        <KpiCard value={formatPKR(totalOutflow)} label="Gross Outflows" variant="danger" />
        <KpiCard value={`${accounts.length} Accounts`} label="Active Operating Accounts" />
      </div>

      <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-fg mb-1">Monthly Inflow vs Outflow (PKR Millions)</h2>
        <p className="text-xs text-muted mb-4">Field disbursements and returns vs maintenance and overheads</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#697683" fontSize={11} tickLine={false} />
              <YAxis stroke="#697683" fontSize={11} tickLine={false} />
              <Tooltip formatter={(val: any) => [`PKR ${val}M`]} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Inflow" fill="#0e8443" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Outflow" fill="#b42318" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable columns={columns} data={transactions.slice(0, 25)} />
    </div>
  );
};

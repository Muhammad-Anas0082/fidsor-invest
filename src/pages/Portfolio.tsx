import React, { useState } from 'react';
import { PieChart as PieIcon, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { formatPKR } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { Project } from '../types';

export const Portfolio: React.FC = () => {
  const { getRecords } = useData();
  const projects = getRecords<Project>('projects');
  const properties = getRecords('properties');
  const storageLots = getRecords('storageLots');
  const loans = getRecords('loans');

  const assetAllocation = [
    { name: 'Real Estate & Land', value: 262, color: '#185f9f' },
    { name: 'Cold Storage Commodity', value: 32, color: '#0e8443' },
    { name: 'PSX Listed Equities', value: 24, color: '#b25e09' },
    { name: 'Foreign Exchange (USD/AED)', value: 15, color: '#6cb2e8' },
    { name: 'Microfinance Loans', value: 6, color: '#8b3ac9' },
    { name: 'Machinery & Equipment', value: 18, color: '#c31f5e' },
    { name: 'Cash & Reserves', value: 82, color: '#1189aa' }
  ];

  const totalCommitted = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  const exportColumns: ExportColumn[] = [
    { header: 'Project Code', key: 'code' },
    { header: 'Name', key: 'name' },
    { header: 'Type', key: 'type' },
    { header: 'Status', key: 'status' },
    { header: 'Budget', key: 'budget', format: val => formatPKR(val) },
    { header: 'Target ROI', key: 'targetRoi', format: val => `${((val || 0) * 100).toFixed(0)}%` },
    { header: 'Location', key: 'location' }
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
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PieIcon}
        title="Portfolio Allocation"
        subtitle="Asset breakdown, target ROI, and capital deployments across operations."
        onExportExcel={() => exportToExcel('Portfolio Projects', exportColumns, projects, 'portfolio-projects')}
        onExportPdf={() => exportToPdf('Portfolio Allocation Register', exportColumns, projects, 'portfolio-projects')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value="PKR 439M" label="Total Assets Under Mgmt" variant="info" />
        <KpiCard value={formatPKR(totalCommitted)} label="Total Project Budgets" />
        <KpiCard value="18.4%" label="Weighted Target ROI" variant="success" />
        <KpiCard value={`${projects.length} Lines`} label="Active Business Lines" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs flex flex-col items-center">
          <h2 className="text-sm font-bold text-fg self-start mb-2">Capital Allocation by Asset Class</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`PKR ${val}M`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 text-[11px] text-muted mt-2">
            {assetAllocation.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <DataTable columns={columns} data={projects} />
        </div>
      </div>
    </div>
  );
};

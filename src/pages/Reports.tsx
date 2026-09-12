import React from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  PieChart,
  FolderKanban,
  ArrowLeftRight,
  Layers,
  Users,
  Banknote,
  Building2,
  TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { formatPKR, formatDate } from '../lib/formatters';

export const Reports: React.FC = () => {
  const { getRecords } = useData();

  const properties = getRecords('properties');
  const loans = getRecords('loans');
  const lots = getRecords('storageLots');
  const projects = getRecords('projects');
  const investors = getRecords('investors');
  const transactions = getRecords('transactions');
  const assets = getRecords('assets');

  const reportItems = [
    {
      title: 'Portfolio Summary',
      description: 'Mark-to-market valuations, net worth allocation, and capital deployed.',
      icon: PieChart,
      color: 'text-brand',
      onExcel: () =>
        exportToExcel(
          'Portfolio Projects',
          [
            { header: 'Project Code', key: 'code' },
            { header: 'Project Name', key: 'name' },
            { header: 'Type', key: 'type' },
            { header: 'Budget', key: 'budget', format: val => formatPKR(val) }
          ],
          projects,
          'report-portfolio'
        ),
      onPdf: () =>
        exportToPdf(
          'Portfolio Summary Report',
          [
            { header: 'Project Code', key: 'code' },
            { header: 'Project Name', key: 'name' },
            { header: 'Type', key: 'type' },
            { header: 'Budget', key: 'budget', format: val => formatPKR(val) }
          ],
          projects,
          'report-portfolio'
        )
    },
    {
      title: 'Projects Financial Register',
      description: 'Budgets, burn rates, manager assignments, and operational statuses.',
      icon: FolderKanban,
      color: 'text-success',
      onExcel: () =>
        exportToExcel(
          'Projects Register',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Budget', key: 'budget', format: val => formatPKR(val) },
            { header: 'Status', key: 'status' }
          ],
          projects,
          'report-projects'
        ),
      onPdf: () =>
        exportToPdf(
          'Projects Register',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Budget', key: 'budget', format: val => formatPKR(val) },
            { header: 'Status', key: 'status' }
          ],
          projects,
          'report-projects'
        )
    },
    {
      title: 'Cash Flow & Ledger Journal',
      description: 'Consolidated inflows, outflows, and operational expenses across bank accounts.',
      icon: ArrowLeftRight,
      color: 'text-info',
      onExcel: () =>
        exportToExcel(
          'Ledger Journal',
          [
            { header: 'Ref', key: 'code' },
            { header: 'Date', key: 'date', format: val => formatDate(val) },
            { header: 'Amount', key: 'amount', format: val => formatPKR(val) },
            { header: 'Category', key: 'category' }
          ],
          transactions,
          'report-cashflow'
        ),
      onPdf: () =>
        exportToPdf(
          'Cash Flow & Ledger Journal',
          [
            { header: 'Ref', key: 'code' },
            { header: 'Date', key: 'date', format: val => formatDate(val) },
            { header: 'Amount', key: 'amount', format: val => formatPKR(val) },
            { header: 'Category', key: 'category' }
          ],
          transactions,
          'report-cashflow'
        )
    },
    {
      title: 'Microfinance Portfolio at Risk',
      description: 'Active loan book, field recovery rates, overdue ageing, and borrower ratings.',
      icon: Banknote,
      color: 'text-warning',
      onExcel: () =>
        exportToExcel(
          'Microfinance Loans',
          [
            { header: 'Code', key: 'code' },
            { header: 'Borrower', key: 'borrowerName' },
            { header: 'Principal', key: 'principal', format: val => formatPKR(val) },
            { header: 'Outstanding', key: 'outstandingAmount', format: val => formatPKR(val) },
            { header: 'Overdue', key: 'overdueAmount', format: val => formatPKR(val) }
          ],
          loans,
          'report-microfinance'
        ),
      onPdf: () =>
        exportToPdf(
          'Microfinance PAR & Ageing Statement',
          [
            { header: 'Code', key: 'code' },
            { header: 'Borrower', key: 'borrowerName' },
            { header: 'Principal', key: 'principal', format: val => formatPKR(val) },
            { header: 'Outstanding', key: 'outstandingAmount', format: val => formatPKR(val) },
            { header: 'Overdue', key: 'overdueAmount', format: val => formatPKR(val) }
          ],
          loans,
          'report-microfinance'
        )
    },
    {
      title: 'Land & Property Rent Roll',
      description: 'Tenancy contracts, occupancy percentages, and property carrying values.',
      icon: Building2,
      color: 'text-purple-500',
      onExcel: () =>
        exportToExcel(
          'Properties Rent Roll',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Value', key: 'currentValue', format: val => formatPKR(val) },
            { header: 'Intent', key: 'intent' },
            { header: 'Status', key: 'status' }
          ],
          properties,
          'report-rentroll'
        ),
      onPdf: () =>
        exportToPdf(
          'Land & Property Rent Roll & Inventory',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Value', key: 'currentValue', format: val => formatPKR(val) },
            { header: 'Intent', key: 'intent' },
            { header: 'Status', key: 'status' }
          ],
          properties,
          'report-rentroll'
        )
    },
    {
      title: 'Investor Capital Accounts',
      description: 'Committed equity, drawn capital, and cumulative profit distributions.',
      icon: Users,
      color: 'text-brand dark:text-sky',
      onExcel: () =>
        exportToExcel(
          'Investors Capital Accounts',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Committed', key: 'totalCommitted', format: val => formatPKR(val) },
            { header: 'Contributed', key: 'totalContributed', format: val => formatPKR(val) }
          ],
          investors,
          'report-investors'
        ),
      onPdf: () =>
        exportToPdf(
          'Investor Capital & Allocation Statement',
          [
            { header: 'Code', key: 'code' },
            { header: 'Name', key: 'name' },
            { header: 'Committed', key: 'totalCommitted', format: val => formatPKR(val) },
            { header: 'Contributed', key: 'totalContributed', format: val => formatPKR(val) }
          ],
          investors,
          'report-investors'
        )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileSpreadsheet}
        title="Reports Hub"
        subtitle="Audited financial statements, portfolio schedules, and regulatory returns."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportItems.map(report => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="bg-card border border-hairline rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-wash">
                    <Icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <h2 className="text-sm font-bold text-fg">{report.title}</h2>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-4">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-hairline">
                <button
                  onClick={report.onExcel}
                  className="flex-1 h-8 rounded-lg border border-hairline bg-wash/50 hover:bg-wash text-[11px] font-semibold text-fg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-success" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  onClick={report.onPdf}
                  className="flex-1 h-8 rounded-lg border border-hairline bg-wash/50 hover:bg-wash text-[11px] font-semibold text-fg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-danger" />
                  <span>PDF (.pdf)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

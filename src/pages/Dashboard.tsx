import React, { useState } from 'react';
import {
  Wallet,
  Building,
  TrendingUp,
  Coins,
  Percent,
  Banknote,
  LineChart as LineChartIcon,
  Table as TableIcon,
  ArrowRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate = () => {} }) => {
  const [allocTab, setAllocTab] = useState<'class' | 'business' | 'project'>('class');
  const [allocView, setAllocView] = useState<'chart' | 'table'>('chart');
  const [incomeView, setIncomeView] = useState<'chart' | 'table'>('chart');

  // Portfolio Allocation Donut Data by Class (Net Worth: PKR 445M)
  const classAllocData = [
    { name: 'Property & buildings', value: 183, pct: 41, color: '#8b3ac9', pkr: 'PKR 183M' },
    { name: 'Agricultural land', value: 110, pct: 25, color: '#0e8443', pkr: 'PKR 110M' },
    { name: 'Cash & bank', value: 78.0, pct: 18, color: '#185f9f', pkr: 'PKR 78.0M' },
    { name: 'Cold-storage stock', value: 31.6, pct: 7, color: '#c2680a', pkr: 'PKR 31.6M' },
    { name: 'Machinery & vehicles', value: 20.0, pct: 5, color: '#0d9488', pkr: 'PKR 20.0M' },
    { name: 'Foreign currency', value: 9.4, pct: 2, color: '#92400e', pkr: 'PKR 9.4M' },
    { name: 'Loan book & arrears', value: 6.8, pct: 2, color: '#1189aa', pkr: 'PKR 6.8M' },
    { name: 'Listed equity', value: 5.7, pct: 1, color: '#c31f5e', pkr: 'PKR 5.7M' }
  ];

  // Allocation by Business (In ventures: PKR 367M)
  const businessAllocData = [
    { name: 'Farmland agriculture', value: 110, pct: 30, color: '#0e8443', pkr: 'PKR 110M' },
    { name: 'Property trading', value: 65.7, pct: 18, color: '#8b3ac9', pkr: 'PKR 65.7M' },
    { name: 'Rental properties', value: 59.9, pct: 16, color: '#185f9f', pkr: 'PKR 59.9M' },
    { name: 'Construction & dev', value: 57.9, pct: 16, color: '#0d9488', pkr: 'PKR 57.9M' },
    { name: 'Cold-storage operations', value: 31.6, pct: 9, color: '#c2680a', pkr: 'PKR 31.6M' },
    { name: 'Machinery fleet hire', value: 20.0, pct: 5, color: '#92400e', pkr: 'PKR 20.0M' },
    { name: 'FX & PSX equity liquid', value: 15.1, pct: 4, color: '#c31f5e', pkr: 'PKR 15.1M' },
    { name: 'Microfinance lending', value: 6.8, pct: 2, color: '#1189aa', pkr: 'PKR 6.8M' }
  ];

  // Allocation by Project
  const projectAllocData = [
    { name: 'Agri Land — Hyderabad', value: 110, pct: 30, color: '#0e8443', pkr: 'PKR 110M' },
    { name: 'Property Trading — Karachi', value: 65.7, pct: 18, color: '#8b3ac9', pkr: 'PKR 65.7M' },
    { name: 'Rental Portfolio — Hyd', value: 59.9, pct: 16, color: '#185f9f', pkr: 'PKR 59.9M' },
    { name: 'Gulshan Residency Const', value: 57.9, pct: 16, color: '#0d9488', pkr: 'PKR 57.9M' },
    { name: 'Date Cold Storage 2026', value: 31.6, pct: 9, color: '#c2680a', pkr: 'PKR 31.6M' },
    { name: 'Machinery Fleet — Sindh', value: 20.0, pct: 5, color: '#92400e', pkr: 'PKR 20.0M' },
    { name: 'FX Cash Reserves', value: 9.4, pct: 3, color: '#6cb2e8', pkr: 'PKR 9.4M' },
    { name: 'Hyderabad Microfinance', value: 6.8, pct: 2, color: '#1189aa', pkr: 'PKR 6.8M' },
    { name: 'PSX Listed Equities', value: 5.7, pct: 1, color: '#c31f5e', pkr: 'PKR 5.7M' }
  ];

  const activeAllocData =
    allocTab === 'business'
      ? businessAllocData
      : allocTab === 'project'
      ? projectAllocData
      : classAllocData;

  const activeAllocTotal =
    allocTab === 'class' ? 'PKR 445M' : 'PKR 367M';
  const activeAllocLabel =
    allocTab === 'class' ? 'NET WORTH' : 'IN VENTURES';

  // 12 Months Income & Expenditure Data (Operating only)
  const incomeExpData = [
    { month: "Sept '25", income: 7.1, expenditure: 5.6 },
    { month: "Oct '25", income: 6.0, expenditure: 4.9 },
    { month: "Nov '25", income: 9.2, expenditure: 6.2 },
    { month: "Dec '25", income: 5.1, expenditure: 5.0 },
    { month: "Jan '26", income: 8.6, expenditure: 6.1 },
    { month: "Feb '26", income: 8.1, expenditure: 6.9 },
    { month: "Mar '26", income: 1.6, expenditure: 1.2 },
    { month: "Apr '26", income: 2.0, expenditure: 1.3 },
    { month: "May '26", income: 1.7, expenditure: 1.1 },
    { month: "Jun '26", income: 1.6, expenditure: 2.5 },
    { month: "Jul '26", income: 6.3, expenditure: 6.8 },
    { month: "Aug '26", income: 6.5, expenditure: 7.3 }
  ];

  // Largest Holdings Data (Exact from screenshot)
  const holdings = [
    { name: 'Agriculture Land — Hyderabad', pkr: 'PKR 110M', pct: 100, path: '/projects' },
    { name: 'Property Trading — Karachi', pkr: 'PKR 65.7M', pct: 60, path: '/projects' },
    { name: 'Rental Portfolio — Hyderabad', pkr: 'PKR 59.9M', pct: 54, path: '/projects' },
    { name: 'Gulshan Residency Construction', pkr: 'PKR 57.9M', pct: 52, path: '/projects' },
    { name: 'Date Cold Storage 2026', pkr: 'PKR 31.6M', pct: 28, path: '/cold-storage' }
  ];

  // Needs Attention Alerts (Exact from screenshot — 7 items)
  const alerts = [
    {
      title: 'Rent overdue — Ghulam Hyder Jamali',
      detail: 'LS-2026-01, installment 1, 240 days late.',
      date: '01-Jan-2026'
    },
    {
      title: 'Rent overdue — Zeeshan Mobile Zone',
      detail: 'RN-2024-07, installment 23, 120 days late.',
      date: '01-May-2026'
    },
    {
      title: 'Rent overdue — Zeeshan Mobile Zone',
      detail: 'RN-2024-07, installment 24, 89 days late.',
      date: '01-Jun-2026'
    },
    {
      title: 'Rent overdue — Junaid Panhwar',
      detail: 'RN-2025-10, installment 10, 59 days late.',
      date: '01-Jul-2026'
    },
    {
      title: 'Installment overdue — LN-2026-005',
      detail: 'Installment 5 of 12, 52 days late.',
      date: '08-Jul-2026'
    },
    {
      title: 'Installment overdue — LN-2025-018',
      detail: 'Installment 9 of 12, 42 days late.',
      date: '18-Jul-2026'
    },
    {
      title: 'Installment overdue — LN-2026-019',
      detail: 'Installment 2 of 12, 40 days late.',
      date: '20-Jul-2026'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Row of 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {/* Net Worth */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#185f9f]/10 text-[#185f9f] dark:text-[#6cb2e8] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">PKR 445M</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Net worth</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">Assets plus receivables plus c...</div>
        </div>

        {/* Capital Invested */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#697683]/10 text-muted flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">PKR 411M</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Capital invested</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">Contributed by all investors</div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#697683]/10 text-muted flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">PKR 367M</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Portfolio value</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">Holdings and receivables at to...</div>
        </div>

        {/* Total Profit */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">PKR 39.7M</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Total profit</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">-PKR 350K banked · PKR 40.1...</div>
        </div>

        {/* Return on Capital */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">9.7%</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Return on capital</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">Realized and unrealized, over c...</div>
        </div>

        {/* Cash & Bank */}
        <div className="bg-card border border-hairline rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#697683]/10 text-muted flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-fg">PKR 78.0M</div>
              <div className="text-xs font-semibold text-fg mt-0.5">Cash & bank</div>
            </div>
          </div>
          <div className="text-[11px] text-muted mt-2 truncate">Across eight accounts</div>
        </div>
      </div>

      {/* Middle Row: Two-Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Card: Portfolio allocation */}
        <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header + Tabs */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-fg">Portfolio allocation</h2>
                <p className="text-[11px] text-muted mt-1 leading-relaxed max-w-sm">
                  By class this is net worth — every rupee, cash included. By business or project it
                  is only what sits inside ventures, so the total is smaller by the cash not yet
                  deployed.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* 3-way toggle: Class / Business / Project */}
                <div className="bg-wash/70 p-0.5 rounded-lg flex items-center border border-hairline text-[11px]">
                  <button
                    onClick={() => setAllocTab('class')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      allocTab === 'class' ? 'bg-card text-fg shadow-2xs font-semibold' : 'text-muted'
                    }`}
                  >
                    Class
                  </button>
                  <button
                    onClick={() => setAllocTab('business')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      allocTab === 'business' ? 'bg-card text-fg shadow-2xs font-semibold' : 'text-muted'
                    }`}
                  >
                    Business
                  </button>
                  <button
                    onClick={() => setAllocTab('project')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      allocTab === 'project' ? 'bg-card text-fg shadow-2xs font-semibold' : 'text-muted'
                    }`}
                  >
                    Project
                  </button>
                </div>

                {/* View Icons */}
                <div className="flex items-center border border-hairline rounded-lg p-0.5 bg-wash/50">
                  <button
                    onClick={() => setAllocView('chart')}
                    className={`p-1 rounded ${allocView === 'chart' ? 'bg-card text-fg shadow-2xs' : 'text-muted'}`}
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAllocView('table')}
                    className={`p-1 rounded ${allocView === 'table' ? 'bg-card text-fg shadow-2xs' : 'text-muted'}`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Donut Chart or Table View */}
            {allocView === 'chart' ? (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Donut */}
                <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activeAllocData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={54}
                        outerRadius={78}
                        paddingAngle={1.5}
                      >
                        {activeAllocData.map(entry => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any) => [`PKR ${val}M`, name]}
                        contentStyle={{
                          backgroundColor: '#101822',
                          borderColor: '#3b4756',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Donut Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {activeAllocLabel}
                    </div>
                    <div className="text-lg font-extrabold text-fg">{activeAllocTotal}</div>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 w-full space-y-1.5 text-xs">
                  {activeAllocData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-fg font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-fg">{item.pkr}</span>
                        <span className="text-muted w-7 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-hairline rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-wash/40 border-b border-hairline text-[11px] text-muted">
                      <th className="py-2.5 px-3 font-semibold">HOLDING / ASSET</th>
                      <th className="py-2.5 px-3 font-semibold text-right">CAPITAL</th>
                      <th className="py-2.5 px-3 font-semibold text-right">SHARE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {activeAllocData.map(item => (
                      <tr key={item.name} className="hover:bg-wash/30">
                        <td className="py-2 px-3 font-medium flex items-center gap-2 text-fg">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-right text-fg">{item.pkr}</td>
                        <td className="py-2 px-3 text-right font-medium text-muted">{item.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom color key strip */}
          <div className="mt-4 pt-3 border-t border-hairline flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
            {activeAllocData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Income and expenditure */}
        <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-fg">Income and expenditure</h2>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Operating only. Buying land and taking investor capital are excluded.
                </p>
              </div>

              <div className="flex items-center border border-hairline rounded-lg p-0.5 bg-wash/50 shrink-0">
                <button
                  onClick={() => setIncomeView('chart')}
                  className={`p-1 rounded ${incomeView === 'chart' ? 'bg-card text-fg shadow-2xs' : 'text-muted'}`}
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIncomeView('table')}
                  className={`p-1 rounded ${incomeView === 'table' ? 'bg-card text-fg shadow-2xs' : 'text-muted'}`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bar Chart or Table View */}
            {incomeView === 'chart' ? (
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeExpData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfe4ea25" />
                    <XAxis
                      dataKey="month"
                      stroke="#697683"
                      fontSize={10.5}
                      tickLine={false}
                      axisLine={{ stroke: '#dfe4ea50' }}
                    />
                    <YAxis
                      stroke="#697683"
                      fontSize={10.5}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 10]}
                      ticks={[0, 2.5, 5.0, 7.5, 10.0]}
                      tickFormatter={val => (val === 0 ? '0' : `${val.toFixed(1)}M`)}
                    />
                    <Tooltip
                      formatter={(val: any) => [`PKR ${val}M`]}
                      contentStyle={{
                        backgroundColor: '#101822',
                        borderColor: '#3b4756',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="income" name="Income" fill="#0d9488" radius={[2, 2, 0, 0]} />
                    <Bar
                      dataKey="expenditure"
                      name="Expenditure"
                      fill="#c2680a"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-4 border border-hairline rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="bg-wash/40 border-b border-hairline text-[11px] text-muted">
                      <th className="py-2 px-3 font-semibold">MONTH</th>
                      <th className="py-2 px-3 font-semibold text-right text-success">INCOME</th>
                      <th className="py-2 px-3 font-semibold text-right text-warning">EXPENDITURE</th>
                      <th className="py-2 px-3 font-semibold text-right">NET</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {incomeExpData.map(item => {
                      const net = item.income - item.expenditure;
                      const isPositive = net >= 0;
                      return (
                        <tr key={item.month} className="hover:bg-wash/30">
                          <td className="py-1.5 px-3 font-medium text-fg">{item.month}</td>
                          <td className="py-1.5 px-3 font-semibold text-right text-success">
                            PKR {item.income.toFixed(1)}M
                          </td>
                          <td className="py-1.5 px-3 font-semibold text-right text-warning">
                            PKR {item.expenditure.toFixed(1)}M
                          </td>
                          <td className={`py-1.5 px-3 font-semibold text-right ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? '+' : ''}PKR {net.toFixed(1)}M
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Chart Legend */}
          <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-center gap-6 text-xs text-fg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
              <span className="font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c2680a]" />
              <span className="font-medium">Expenditure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Two-Column Holdings & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Largest holdings */}
        <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-fg">Largest holdings</h2>
              <p className="text-[11px] text-muted">By current value. Click through to the project.</p>
            </div>
            <button
              onClick={() => onNavigate('/projects')}
              className="text-xs font-semibold text-brand dark:text-sky hover:underline flex items-center gap-1"
            >
              <span>All projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {holdings.map(item => (
              <div
                key={item.name}
                onClick={() => onNavigate(item.path)}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg group-hover:text-brand transition-colors truncate max-w-[280px]">
                    {item.name}
                  </span>
                  <span className="font-bold text-fg shrink-0">{item.pkr}</span>
                </div>
                <div className="w-full bg-wash rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#185f9f] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs attention */}
        <div className="bg-card border border-hairline rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-fg">Needs attention</h2>
              <p className="text-[11px] text-muted">
                Expiring leases, overdue installments, machines due for service.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/microfinance')}
              className="text-xs font-semibold text-brand dark:text-sky hover:underline flex items-center gap-1"
            >
              <span>All alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border border-hairline bg-wash/30"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-danger shrink-0 mt-1.5" />
                  <div>
                    <div className="text-xs font-bold text-fg">{alert.title}</div>
                    <div className="text-[11px] text-muted mt-0.5">{alert.detail}</div>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-full border border-danger/20">
                  {alert.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="pt-2 pb-1 text-center">
        <p className="text-[11px] text-muted leading-relaxed">
          Realized profit is <span className="font-semibold text-fg">~PKR 350K</span> and is cash.
          Unrealized profit is <span className="font-semibold text-fg">PKR 40.1M</span> and is value
          above cost on holdings that have not been sold. The two are never added together anywhere
          except in "total profit", which says so.
        </p>
      </div>
    </div>
  );
};
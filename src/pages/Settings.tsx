import React, { useState } from 'react';
import { Settings as SettingsIcon, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';

export const Settings: React.FC = () => {
  const { resetToDefaults } = useData();
  const [companyName, setCompanyName] = useState('Fidsor Holdings');
  const [owner, setOwner] = useState('Fakhar Memon');
  const [city, setCity] = useState('Hyderabad, Sindh');
  const [fiscalMonth, setFiscalMonth] = useState('7');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all modified records back to initial export seed data?')) {
      resetToDefaults();
      alert('Local database edits have been reset to default.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings & System Configuration"
        subtitle="Entity parameters, fiscal calendars, and local database cache controls."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info Card */}
        <div className="bg-card border border-hairline rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-fg">Entity Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">Managing Principal / Owner</label>
              <input
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fg mb-1">Principal City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg mb-1">Fiscal Year Start Month</label>
                <select
                  value={fiscalMonth}
                  onChange={e => setFiscalMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
                >
                  <option value="1">January (Calendar)</option>
                  <option value="7">July (Pakistan FY)</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              {saved && <span className="text-xs font-semibold text-success">Saved successfully!</span>}
            </div>
          </form>
        </div>

        {/* Database & Local Cache Management */}
        <div className="bg-card border border-hairline rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-fg">
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span>Database State Management</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              All added lots, new loans, and recorded properties are persisted in browser local
              storage under the <code className="font-mono bg-wash px-1 rounded">fidsor-invest.edits</code> key.
              You can restore the authentic initial seed data state at any time.
            </p>
          </div>

          <div className="pt-6 border-t border-hairline">
            <button
              onClick={handleReset}
              className="h-9 px-4 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database to Export Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

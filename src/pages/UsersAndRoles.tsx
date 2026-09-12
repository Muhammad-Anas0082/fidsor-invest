import React, { useState } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Toolbar } from '../components/ui/Toolbar';
import { Badge } from '../components/ui/Badge';
import { FormSheet } from '../components/ui/FormSheet';
import { formatDate } from '../lib/formatters';
import { exportToExcel, exportToPdf, ExportColumn } from '../lib/exporter';
import { User, RoleId } from '../types';

export const UsersAndRoles: React.FC = () => {
  const { getRecords, addRecord } = useData();
  const users = getRecords<User>('users');
  const roles = getRecords('roles');
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<RoleId>('operations');

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.roleId?.toLowerCase().includes(q);
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-0${users.length + 1}`,
      name: newName || 'Staff Member',
      email: newEmail || 'staff@fidsorholdings.pk',
      phone: newPhone || '+92 300 0000000',
      roleId: newRole,
      status: 'active',
      joinedOn: new Date().toISOString().slice(0, 10),
      lastActiveAt: new Date().toISOString()
    };
    addRecord('users', newUser);
    setIsSheetOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const exportColumns: ExportColumn[] = [
    { header: 'ID', key: 'id' },
    { header: 'Full Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    { header: 'Role', key: 'roleId' },
    { header: 'Status', key: 'status' },
    { header: 'Joined', key: 'joinedOn', format: val => formatDate(val) }
  ];

  const columns: Column<User>[] = [
    {
      header: 'USER',
      cell: row => (
        <div>
          <div className="font-bold text-fg">{row.name}</div>
          <div className="text-[11px] text-muted">{row.email}</div>
        </div>
      )
    },
    {
      header: 'ROLE',
      cell: row => {
        const roleLabels: Record<string, string> = {
          administrator: 'Administrator',
          'investment-manager': 'Investment Manager',
          operations: 'Operations',
          accountant: 'Accountant',
          viewer: 'Viewer'
        };
        return (
          <span className="capitalize font-semibold text-brand dark:text-sky text-xs">
            {roleLabels[row.roleId] || row.roleId}
          </span>
        );
      }
    },
    {
      header: 'PHONE',
      cell: row => <span className="text-muted text-xs">{row.phone}</span>
    },
    {
      header: 'LAST ACTIVE',
      cell: row => <span className="text-muted text-xs">{formatDate(row.lastActiveAt || row.joinedOn)}</span>
    },
    {
      header: 'STATUS',
      cell: row => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Users & Access Permissions"
        subtitle="Role-based access control, security policies, and team provisioning."
        onExportExcel={() => exportToExcel('User Directory', exportColumns, filtered, 'users')}
        onExportPdf={() => exportToPdf('User & Security Access Register', exportColumns, filtered, 'users')}
        primaryActionLabel="+ Invite user"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={`${users.length} Users`} label="Registered Staff" />
        <KpiCard value={`${roles.length} Roles`} label="Configured Security Roles" />
        <KpiCard value="5 Active" label="Demo Test Accounts" variant="info" />
        <KpiCard value="RBAC Active" label="Authorization Policy" variant="success" />
      </div>

      <Toolbar
        searchPlaceholder="Search users by name, email or role..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="+ Invite user"
        onPrimaryAction={() => setIsSheetOpen(true)}
      />

      <DataTable columns={columns} data={filtered} />

      <FormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Invite New User"
        subtitle="Provision account with defined role privileges."
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
              form="user-form"
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold"
            >
              Create User
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Asadullah Memon"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="user@fidsorholdings.pk"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">Phone</label>
            <input
              type="text"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">System Role</label>
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value as any)}
              className="w-full h-9 px-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus:border-brand"
            >
              <option value="administrator">Administrator</option>
              <option value="investment-manager">Investment Manager</option>
              <option value="operations">Operations</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </form>
      </FormSheet>
    </div>
  );
};

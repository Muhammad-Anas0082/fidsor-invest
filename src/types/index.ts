export type RoleId = 'administrator' | 'investment-manager' | 'operations' | 'accountant' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: RoleId;
  status: 'active' | 'invited' | 'disabled';
  lastActiveAt?: string;
  joinedOn: string;
}

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  capabilities: string[];
}

export interface Account {
  id: string;
  name: string;
  kind: 'cash' | 'bank' | 'brokerage' | 'currency' | 'wallet';
  institution: string;
  number: string;
  currency: string;
  openingBalance: number; // in paise/cents
  openedOn: string;
  status: 'active' | 'closed';
  note?: string;
  projectId?: string;
}

export interface Property {
  id: string;
  code: string;
  name: string;
  kind: 'agricultural-land' | 'commercial-plot' | 'residential-plot' | 'residential-apartment' | 'commercial-building';
  intent: 'hold' | 'lease' | 'rent' | 'resale' | 'develop';
  status: 'held' | 'leased' | 'rented' | 'partially-rented' | 'under-construction' | 'sold';
  location: string;
  city: string;
  area: string;
  sizeSqFt?: number;
  sizeAcres?: number;
  sizeLabel: string;
  purchasedOn: string;
  acquisitionCost: number; // paise/cents
  incidentalCost: number;
  totalCost: number;
  currentValue: number;
  gain: number;
  gainPct: number;
  occupancyUnits?: { total: number; let: number };
  monthlyRent?: number;
  description?: string;
}

export interface StorageLot {
  id: string;
  code: string;
  projectId: string;
  product: string;
  supplier: string;
  origin: string;
  chamberCode: string;
  purchasedOn: string;
  boughtKg: number;
  leftKg: number;
  purchasePricePerKg: number;
  transportHandlingPerKg: number;
  landedCostPerKg: number;
  currentGatePricePerKg: number;
  stockValue: number;
  revenue: number;
  grossMargin: number;
  grossMarginPct: number;
  status: 'in-storage' | 'partially-sold' | 'exhausted';
  daysHeld: number;
}

export interface StorageOverhead {
  id: string;
  projectId: string;
  month: string;
  category: 'electricity' | 'labour' | 'facility-rent' | 'maintenance' | 'other';
  amount: number;
  note?: string;
}

export interface Loan {
  id: string;
  code: string;
  borrowerId: string;
  borrowerName: string;
  borrowerLocation: string;
  projectId: string;
  purpose: string;
  rating: 'A' | 'B' | 'C';
  principal: number; // paise/cents
  tenorMonths: number;
  interestRatePct: number;
  disbursedOn: string;
  recoveryPct: number;
  collectedAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  daysLate: number;
  status: 'active' | 'overdue' | 'settled' | 'written-off';
}

export interface Borrower {
  id: string;
  code: string;
  name: string;
  cnic: string;
  phone: string;
  businessType: string;
  location: string;
  rating: 'A' | 'B' | 'C';
  joinedOn: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  type: 'cold-storage' | 'microfinance' | 'agriculture' | 'real-estate' | 'construction' | 'stocks' | 'currency' | 'rental';
  status: 'operations' | 'active' | 'completed' | 'pipeline';
  currency: string;
  startedOn: string;
  managerId: string;
  location: string;
  description: string;
  budget: number;
  targetRoi: number;
  tags: string[];
}

export interface Opportunity {
  id: string;
  code: string;
  title: string;
  type: string;
  sector?: string;
  targetAmount?: number;
  askingPrice?: number;
  estimatedValue?: number;
  minInvestment?: number;
  expectedRoi?: number;
  estimatedRoi?: number;
  tenorMonths?: number;
  horizonMonths?: number;
  stage?: 'due-diligence' | 'open-for-funding' | 'closed' | 'review' | string;
  status?: string;
  location: string;
  summary?: string;
  notes?: string;
  sizeLabel?: string;
}

export interface Investor {
  id: string;
  code: string;
  name: string;
  kind: 'individual' | 'corporate' | 'family-office';
  phone: string;
  email: string;
  totalCommitted: number;
  totalContributed: number;
  totalDistributed: number;
  activeProjectsCount: number;
  joinedOn: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  assetClass: 'land' | 'property' | 'machinery' | 'vehicle' | 'infrastructure';
  location: string;
  acquiredOn: string;
  acquisitionCost: number;
  currentValue: number;
  depreciation: number;
  bookValue: number;
  status: 'operational' | 'leased' | 'maintenance' | 'disposed';
}

export interface Lease {
  id: string;
  code: string;
  kind: 'land' | 'commercial' | 'residential';
  propertyName: string;
  tenantName: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'active' | 'notice' | 'expired' | 'terminated';
}

export interface ResourceItem {
  id: string;
  code: string;
  name: string;
  kind: 'machinery' | 'workforce';
  category: string;
  dailyRate: number;
  location: string;
  status: 'available' | 'assigned' | 'maintenance';
  operatorOrSkills?: string;
}

export interface Security {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGain: number;
  gainPct: number;
}

export interface Transaction {
  id: string;
  code: string;
  date: string;
  accountId: string;
  accountName?: string;
  projectId?: string;
  direction: 'in' | 'out';
  category: string;
  amount: number; // paise/cents
  reference: string;
  description: string;
  status: 'cleared' | 'pending' | 'reconciled';
}

export interface AuditEntry {
  id: string;
  at: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}

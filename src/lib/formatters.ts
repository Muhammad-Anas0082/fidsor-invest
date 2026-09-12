// Monetary values in the dataset are stored in cents/paise (e.g. 330000000 = PKR 3,300,000)
// Formatters convert this to 'PKR 3.3M', 'PKR 130K', '-PKR 3.0M'

export function formatPKR(paiseOrRupees: number, isRupees = false): string {
  if (paiseOrRupees === null || paiseOrRupees === undefined || isNaN(paiseOrRupees)) return '—';
  
  const rupees = isRupees ? paiseOrRupees : paiseOrRupees / 100;
  const isNegative = rupees < 0;
  const abs = Math.abs(rupees);
  
  let formatted = '';
  if (abs >= 1_000_000_000) {
    formatted = `${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    const val = abs / 1_000_000;
    formatted = val >= 100 ? `${Math.round(val)}M` : `${val.toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `${Math.round(abs / 1_000)}K`;
  } else {
    formatted = `${Math.round(abs)}`;
  }



  return isNegative ? `-PKR ${formatted}` : `PKR ${formatted}`;
}

export function formatPKRFull(paiseOrRupees: number, isRupees = false): string {
  if (paiseOrRupees === null || paiseOrRupees === undefined || isNaN(paiseOrRupees)) return '—';
  const rupees = isRupees ? paiseOrRupees : paiseOrRupees / 100;
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(rupees);
}

export function formatKg(kg: number): string {
  if (kg === null || kg === undefined || isNaN(kg)) return '—';
  return `${new Intl.NumberFormat('en-US').format(kg)} kg`;
}

export function formatPercent(val: number, isFraction = true): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const pct = isFraction ? val * 100 : val;
  return `${pct.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

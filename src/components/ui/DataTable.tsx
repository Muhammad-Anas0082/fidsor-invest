import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface Column<T = any> {
  header: string;
  accessor?: keyof T | string;
  align?: 'left' | 'right' | 'center';
  className?: string;
  cell?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T | string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records found matching your filters.',
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-wash/40">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-[11px] font-semibold text-muted tracking-wider uppercase ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline text-xs">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-12 text-center text-muted italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const rowKey = String(row[keyField] ?? rowIdx);
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-wash/50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-4 py-3.5 align-middle ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.cell
                          ? col.cell(row, rowIdx)
                          : col.accessor
                          ? String(row[col.accessor] ?? '—')
                          : '—'}
                      </td>
                    ))}

                    <td className="px-4 py-3.5 text-right align-middle">
                      <button
                        title="More options"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        className="p-1 rounded-md text-muted hover:text-fg hover:bg-wash transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count */}
      <div className="px-4 py-3 border-t border-hairline bg-wash/20 text-[11px] text-muted flex items-center justify-between">
        <span>Showing {data.length} records</span>
        <span>Filtered live</span>
      </div>
    </div>
  );
}

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
  format?: (val: any, row?: any) => string;
}

export function exportToExcel(
  title: string,
  columns: ExportColumn[],
  rows: any[],
  fileNamePrefix: string = 'export'
) {
  try {
    // Transform rows to plain objects matching columns
    const sheetData = rows.map(row => {
      const obj: Record<string, any> = {};
      columns.forEach(col => {
        const rawVal = row[col.key];
        obj[col.header] = col.format ? col.format(rawVal, row) : rawVal ?? '—';
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 30));

    const dateStr = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileNamePrefix}-${dateStr}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);
  } catch (err) {
    console.error('Failed to export Excel file:', err);
  }
}

export function exportToPdf(
  title: string,
  columns: ExportColumn[],
  rows: any[],
  fileNamePrefix: string = 'report'
) {
  try {
    const doc = new jsPDF({
      orientation: columns.length > 5 ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    // Branded Header
    doc.setFillColor(11, 32, 54); // Navy #0b2036
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Fidsor Invest', 40, 32);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(169, 205, 234);
    doc.text('Investment Platform — Official Report', 40, 48);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 40, 90);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleString()} · Total records: ${rows.length}`, 40, 105);

    // Table Data
    const headers = columns.map(c => c.header);
    const body = rows.map(row =>
      columns.map(col => {
        const rawVal = row[col.key];
        return col.format ? col.format(rawVal, row) : String(rawVal ?? '—');
      })
    );

    autoTable(doc, {
      startY: 120,
      head: [headers],
      body: body,
      theme: 'striped',
      headStyles: {
        fillColor: [24, 95, 159],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        overflow: 'linebreak'
      },
      alternateRowStyles: {
        fillColor: [246, 248, 250]
      },
      margin: { left: 40, right: 40 }
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`${fileNamePrefix}-${dateStr}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF file:', err);
  }
}

import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// --- Excel Export ---
export async function exportExcel(res, filename, columns, rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");

  sheet.columns = columns;
  rows.forEach((r) => sheet.addRow(r));

  // Style header
  const header = sheet.getRow(1);
  header.font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
}

// --- PDF Export ---
export async function exportPDF(res, filename, columns, rows) {
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);

  doc.pipe(res);

  // Title
  doc.fontSize(16).text(filename, { align: "center" });
  doc.moveDown();

  // Header row
  doc.font("Helvetica-Bold").fontSize(12);
  columns.forEach((c) => doc.text(c.header, { continued: true, width: 100 }));
  doc.moveDown();

  // Data rows
  doc.font("Helvetica").fontSize(10);
  rows.forEach((row) => {
    columns.forEach((c) => {
      doc.text(row[c.key] != null ? row[c.key].toString() : "", {
        continued: true,
        width: 100,
      });
    });
    doc.moveDown();
  });

  doc.end();
}

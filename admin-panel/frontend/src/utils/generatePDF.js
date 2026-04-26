import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DARK_BLUE = [30, 58, 138];
const AMBER     = [245, 158, 11];
const WHITE     = [255, 255, 255];
const LIGHT     = [248, 250, 252];

// ── Header & Footer ──────────────────────────────────────
const addHeader = (doc, title) => {
  doc.setFillColor(...DARK_BLUE);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setFillColor(...AMBER);
  doc.rect(0, 32, 210, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18); doc.setFont('helvetica', 'bold');
  doc.text('PARAMOUNT ENTERPRISES', 14, 14);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Hardware Shop Management System', 14, 22);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text(title, 196, 14, { align: 'right' });
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('Generated: ' + new Date().toLocaleString(), 196, 22, { align: 'right' });
  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc) => {
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK_BLUE);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('2026 Paramount Enterprises. Confidential.', 14, 292);
    doc.text(`Page ${i} of ${pages}`, 196, 292, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }
};

const summaryBox = (doc, items, startY = 40) => {
  const w = Math.floor(182 / items.length);
  items.forEach((item, i) => {
    const x = 14 + i * (w + 2);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(x, startY, w, 22, 2, 2, 'F');
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, x + w / 2, startY + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_BLUE);
    doc.text(String(item.value), x + w / 2, startY + 17, { align: 'center' });
  });
  doc.setTextColor(0, 0, 0);
  return startY + 28;
};

// ── Draw Bar Chart ────────────────────────────────────────
const drawBarChart = (doc, data, x, y, w, h, title) => {
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_BLUE);
  doc.text(title, x, y - 2);
  doc.setTextColor(0, 0, 0);

  if (!data || data.length === 0) {
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text('No data available', x + w / 2, y + h / 2, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    return;
  }

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW   = (w - 10) / data.length - 4;
  const chartH = h - 20;

  // Background
  doc.setFillColor(248, 250, 252);
  doc.rect(x, y, w, h, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.rect(x, y, w, h);

  // Grid lines
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for (let g = 1; g <= 4; g++) {
    const gy = y + chartH - (chartH * g / 4);
    doc.line(x + 5, gy, x + w - 5, gy);
  }

  // Bars
  data.forEach((d, i) => {
    const bx  = x + 7 + i * (barW + 4);
    const bh  = (d.value / maxVal) * chartH;
    const by  = y + chartH - bh;

    // Shadow
    doc.setFillColor(200, 200, 200);
    doc.rect(bx + 1, by + 1, barW, bh, 'F');

    // Bar with gradient effect
    doc.setFillColor(...AMBER);
    doc.rect(bx, by, barW, bh, 'F');

    // Value on top
    doc.setFontSize(6); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_BLUE);
    if (bh > 8) doc.text(String(d.value), bx + barW / 2, by - 1, { align: 'center' });

    // Label below
    doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const label = d.name.length > 8 ? d.name.slice(0, 8) + '..' : d.name;
    doc.text(label, bx + barW / 2, y + h - 4, { align: 'center' });
  });
  doc.setTextColor(0, 0, 0);
};

// ── Draw Pie Chart ────────────────────────────────────────
const drawPieChart = (doc, data, cx, cy, r, title) => {
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_BLUE);
  doc.text(title, cx, cy - r - 4);
  doc.setTextColor(0, 0, 0);

  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text('No data', cx, cy, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    return;
  }

  const colors = [
    [245, 158, 11], [30, 58, 138], [16, 185, 129],
    [239, 68, 68],  [59, 130, 246], [139, 92, 246]
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;

  data.forEach((d, i) => {
    const slice = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + slice;
    const mid = startAngle + slice / 2;

    doc.setFillColor(...colors[i % colors.length]);

    // Draw pie slice using lines
    const steps = Math.max(8, Math.round(slice * 12));
    const points = [[cx, cy]];
    for (let s = 0; s <= steps; s++) {
      const a = startAngle + (slice * s) / steps;
      points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    doc.lines(
      points.slice(1).map((p, idx) => {
        const prev = points[idx];
        return [p[0] - prev[0], p[1] - prev[1]];
      }),
      points[0][0], points[0][1], [1, 1], 'F'
    );

    // Label
    const lx = cx + (r + 6) * Math.cos(mid);
    const ly = cy + (r + 6) * Math.sin(mid);
    doc.setFontSize(6); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors[i % colors.length]);
    const pct = Math.round((d.value / total) * 100);
    if (pct > 5) doc.text(`${pct}%`, lx, ly, { align: 'center' });

    startAngle = endAngle;
  });

  // Legend
  data.forEach((d, i) => {
    const ly = cy + r + 8 + i * 7;
    doc.setFillColor(...colors[i % colors.length]);
    doc.rect(cx - r, ly - 3, 4, 4, 'F');
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`${d.name}: ${d.value}`, cx - r + 6, ly);
  });
  doc.setTextColor(0, 0, 0);
};

// ══ STOCK REPORT ══════════════════════════════════════════
export const generateStockPDF = (stocks) => {
  const doc = new jsPDF();
  addHeader(doc, 'STOCK REPORT');

  const lowStock = stocks.filter(s => s.stockQuantity <= s.reorderLevel).length;
  const inStock  = stocks.length - lowStock;

  let y = summaryBox(doc, [
    { label: 'TOTAL PRODUCTS',   value: stocks.length },
    { label: 'TOTAL UNITS',      value: stocks.reduce((s, i) => s + i.stockQuantity, 0) },
    { label: 'LOW STOCK ITEMS',  value: lowStock },
    { label: 'TOTAL VALUE (LKR)', value: stocks.reduce((s, i) => s + (i.price || 0) * i.stockQuantity, 0).toLocaleString() },
  ], 40);

  // Bar chart — top 6 products by quantity
  const barData = stocks.slice(0, 6).map(s => ({ name: s.product, value: s.stockQuantity }));
  drawBarChart(doc, barData, 14, y + 2, 100, 50, 'Stock Quantity by Product');

  // Pie chart — stock status
  drawPieChart(doc, [
    { name: 'In Stock',   value: inStock },
    { name: 'Low Stock',  value: lowStock },
  ], 160, y + 32, 20, 'Stock Status');

  autoTable(doc, {
    startY: y + 72,
    head: [['#', 'Product', 'Supplier', 'Price (LKR)', 'Qty', 'Reorder', 'Status']],
    body: stocks.map((s, i) => [
      i + 1, s.product, s.supplier,
      (s.price || 0).toLocaleString(),
      s.stockQuantity, s.reorderLevel,
      s.stockQuantity <= s.reorderLevel ? 'Low Stock' : 'In Stock',
    ]),
    headStyles: { fillColor: DARK_BLUE, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT },
    didParseCell: (data) => {
      if (data.column.index === 6 && data.section === 'body') {
        data.cell.styles.textColor = data.cell.raw === 'Low Stock' ? [220, 38, 38] : [22, 163, 74];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('paramount-stock-report.pdf');
};

// ══ CUSTOMER REPORT ════════════════════════════════════════
export const generateCustomerPDF = (customers) => {
  const doc = new jsPDF();
  addHeader(doc, 'CUSTOMER REPORT');

  let y = summaryBox(doc, [
    { label: 'TOTAL CUSTOMERS', value: customers.length },
    { label: 'WITH EMAIL',      value: customers.filter(c => c.email).length },
    { label: 'WITH ADDRESS',    value: customers.filter(c => c.address).length },
  ], 40);

  // Bar chart — customers joined per month
  const monthCounts = {};
  customers.forEach(c => {
    const m = new Date(c.createdAt).toLocaleString('default', { month: 'short' });
    monthCounts[m] = (monthCounts[m] || 0) + 1;
  });
  const barData = Object.entries(monthCounts).slice(-6).map(([name, value]) => ({ name, value }));
  drawBarChart(doc, barData, 14, y + 2, 182, 50, 'Customers Registered by Month');

  autoTable(doc, {
    startY: y + 60,
    head: [['#', 'Name', 'Contact', 'Email', 'Address', 'Joined']],
    body: customers.map((c, i) => [
      i + 1, c.name, c.contact || '-', c.email || '-', c.address || '-',
      new Date(c.createdAt).toLocaleDateString(),
    ]),
    headStyles: { fillColor: DARK_BLUE, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('paramount-customer-report.pdf');
};

// ══ ORDER REPORT ════════════════════════════════════════════
export const generateOrderPDF = (orders) => {
  const doc = new jsPDF();
  addHeader(doc, 'ORDER REPORT');

  const pending   = orders.filter(o => o.status === 'Pending').length;
  const approved  = orders.filter(o => o.status === 'Approved').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;
  const revenue   = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  let y = summaryBox(doc, [
    { label: 'TOTAL ORDERS',    value: orders.length },
    { label: 'PENDING',         value: pending },
    { label: 'COMPLETED',       value: completed },
    { label: 'REVENUE (LKR)',   value: revenue.toLocaleString() },
  ], 40);

  // Bar chart — orders by status
  drawBarChart(doc, [
    { name: 'Pending',   value: pending },
    { name: 'Approved',  value: approved },
    { name: 'Completed', value: completed },
    { name: 'Cancelled', value: cancelled },
  ], 14, y + 2, 90, 50, 'Orders by Status');

  // Pie chart — revenue distribution
  const revenueByStatus = [
    { name: 'Pending',   value: orders.filter(o => o.status === 'Pending').reduce((s, o) => s + Number(o.total_amount || 0), 0) },
    { name: 'Completed', value: orders.filter(o => o.status === 'Completed').reduce((s, o) => s + Number(o.total_amount || 0), 0) },
  ].filter(d => d.value > 0);
  drawPieChart(doc, revenueByStatus, 165, y + 32, 20, 'Revenue Split');

  autoTable(doc, {
    startY: y + 72,
    head: [['#', 'Customer', 'Date', 'Total (LKR)', 'Status']],
    body: orders.map((o, i) => [
      i + 1,
      o.customer_name || o.customerName,
      new Date(o.createdAt).toLocaleDateString(),
      Number(o.total_amount || o.totalAmount || 0).toLocaleString(),
      o.status,
    ]),
    headStyles: { fillColor: DARK_BLUE, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('paramount-order-report.pdf');
};

// ══ SUPPLIER REPORT ════════════════════════════════════════
export const generateSupplierPDF = (suppliers) => {
  const doc = new jsPDF();
  addHeader(doc, 'SUPPLIER REPORT');

  let y = summaryBox(doc, [
    { label: 'TOTAL SUPPLIERS', value: suppliers.length },
    { label: 'WITH EMAIL',      value: suppliers.filter(s => s.email).length },
  ], 40);

  drawBarChart(doc, suppliers.slice(0, 6).map(s => ({ name: s.supplierName, value: 1 })),
    14, y + 2, 182, 45, 'Supplier Overview');

  autoTable(doc, {
    startY: y + 55,
    head: [['#', 'Supplier Name', 'Contact', 'Email', 'Products Supplied']],
    body: suppliers.map((s, i) => [
      i + 1, s.supplierName, s.contact, s.email || '-', s.productsSupplied || '-',
    ]),
    headStyles: { fillColor: DARK_BLUE, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('paramount-supplier-report.pdf');
};

// ══ EMPLOYEE REPORT ════════════════════════════════════════
export const generateEmployeePDF = (employees) => {
  const doc = new jsPDF();
  addHeader(doc, 'EMPLOYEE REPORT');

  const paid       = employees.filter(e => e.paymentStatus === 'Paid').length;
  const unpaid     = employees.filter(e => e.paymentStatus === 'Unpaid').length;
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);

  let y = summaryBox(doc, [
    { label: 'TOTAL EMPLOYEES', value: employees.length },
    { label: 'PAID',            value: paid },
    { label: 'UNPAID',          value: unpaid },
    { label: 'TOTAL SALARY (LKR)', value: totalSalary.toLocaleString() },
  ], 40);

  // Bar chart — salary by employee
  drawBarChart(doc,
    employees.slice(0, 6).map(e => ({ name: e.name, value: e.salary })),
    14, y + 2, 100, 50, 'Salary Distribution');

  // Pie chart — payment status
  drawPieChart(doc, [
    { name: 'Paid',   value: paid },
    { name: 'Unpaid', value: unpaid },
  ], 163, y + 30, 20, 'Payment Status');

  autoTable(doc, {
    startY: y + 72,
    head: [['#', 'Employee ID', 'Name', 'Role', 'Salary (LKR)', 'Payment']],
    body: employees.map((e, i) => [
      i + 1, e.employeeId, e.name, e.role,
      e.salary.toLocaleString(), e.paymentStatus,
    ]),
    headStyles: { fillColor: DARK_BLUE, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === 'body') {
        data.cell.styles.textColor = data.cell.raw === 'Paid' ? [22, 163, 74] : [220, 38, 38];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('paramount-employee-report.pdf');
};
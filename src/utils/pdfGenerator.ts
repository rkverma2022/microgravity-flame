import { jsPDF } from 'jspdf';
import { TECHNICAL_SPECS, HISTORIC_INCIDENTS } from '../data/nasaData';
import { toPlainMath } from '@/lib/mathText';

/**
 * jsPDF's built-in fonts cannot typeset KaTeX or Unicode math, so all text that goes into the
 * PDF is converted to a plain-text equivalent (x^2, CO_2, ->, ~ ...). On-screen math stays KaTeX.
 */
function pdfSafe(doc: jsPDF): jsPDF {
  const clean = (t: unknown): unknown => {
    if (typeof t === 'string') return toPlainMath(t).replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#{1,4}\s+/gm, '');
    if (Array.isArray(t)) return t.map(clean);
    return t;
  };
  const origText = doc.text.bind(doc) as (...a: unknown[]) => jsPDF;
  const origSplit = doc.splitTextToSize.bind(doc) as (...a: unknown[]) => string[];
  (doc as unknown as { text: unknown }).text = (t: unknown, ...rest: unknown[]) => origText(clean(t), ...rest);
  (doc as unknown as { splitTextToSize: unknown }).splitTextToSize = (t: unknown, ...rest: unknown[]) => origSplit(clean(t), ...rest);
  return doc;
}

export interface FlameReportData {
  sampleName: string;
  sampleId: string;
  regime: string;
  notes: string;
  sphericity: string;
  temperature: string;
  filterMode: string;
  scanlineY: number;
  canvasElement?: HTMLCanvasElement | null;
  aiAnalysis?: string | null;
  contactEmail?: string;
}

export function generateFlameSummaryPdf(data: FlameReportData): void {
  // Create jsPDF document: A4 portrait, in millimeters
  const doc = pdfSafe(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }));

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // --- Header Background Banner ---
  doc.setFillColor(11, 15, 25); // Deep space navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent line
  doc.setFillColor(6, 182, 212); // Cyan accent
  doc.rect(0, 27.2, pageWidth, 0.8, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FLAME IN FREEFALL · NASA COMBUSTION RESEARCH REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(
    '2026 NASA Space Apps Challenge · Physical Science Informatics (PSI) Microgravity Analysis',
    margin,
    18
  );
  doc.text(
    `Generated: ${new Date().toUTCString()} · Contact: ${data.contactEmail || 'rajkumarverma70790@gmail.com'}`,
    margin,
    23
  );

  y = 35;

  // --- Document Metadata & Overview ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('1. SELECTED EXPERIMENTAL FLAME ANALYSIS', margin, y);
  y += 5;

  // Meta box
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Investigation Target: ${data.sampleName}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Flight Notes / Facility: ${data.notes}`, margin + 4, y + 11);
  doc.text(
    `Flow Regime: ${data.regime}   |   Active Optical Filter: ${data.filterMode.toUpperCase()}   |   Scanline: Y=${data.scanlineY}%`,
    margin + 4,
    16 + y
  );

  y += 26;

  // --- Image Snapshot & Metrics Table (Side by Side) ---
  const leftColWidth = 92;
  const rightColWidth = contentWidth - leftColWidth - 6;

  // Attempt to capture canvas snapshot
  let hasImage = false;
  if (data.canvasElement) {
    try {
      const imgDataUrl = data.canvasElement.toDataURL('image/png');
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(margin, y, leftColWidth, 52, 1.5, 1.5, 'F');
      // embed image (preserving aspect ratio 640x360 ~ 16:9)
      const imgW = leftColWidth - 4;
      const imgH = (imgW * 360) / 640;
      doc.addImage(imgDataUrl, 'PNG', margin + 2, y + (52 - imgH) / 2, imgW, imgH);
      hasImage = true;
    } catch {
      hasImage = false;
    }
  }

  if (!hasImage) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, leftColWidth, 52, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Optical Frame Snapshot (Calibrated)', margin + 12, y + 26);
  }

  // Right Column: Morphological Flame Metrics Table
  const rightX = margin + leftColWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(rightX, y, rightColWidth, 52, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(14, 116, 144); // Cyan 700
  doc.text('QUANTITATIVE FLAME METRICS', rightX + 4, y + 6);

  const metrics = [
    { label: 'Sphericity Index (Ψ):', val: data.sphericity, desc: '98%+ indicates pure quiescent 0g' },
    { label: 'Peak Core Temp:', val: data.temperature, desc: 'Pyrometric / emission estimate' },
    { label: 'Dominant Wavelength:', val: 'CH* 431.4 nm', desc: 'Chemiluminescent blue envelope' },
    { label: 'Radiation Loss (χ_rad):', val: '≈ 0.38 - 0.45', desc: 'Stefan-Boltzmann cooling dominant' },
    { label: 'Soot Yield Reduction:', val: '-85% vs Earth', desc: 'Absence of buoyant soot pocket' },
  ];

  let metricY = y + 13;
  metrics.forEach((m) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, rightX + 4, metricY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, rightX + 40, metricY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.desc, rightX + 40, metricY + 3.2);

    metricY += 7.2;
  });

  y += 57;

  // --- AI Diagnostics / Deep Combustion Insights ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SUPER INTELLIGENCE (SI) & PHYSICAL REASONING INTERPRETATION', margin, y);
  y += 4.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  const aiBoxHeight = 36;
  doc.roundedRect(margin, y, contentWidth, aiBoxHeight, 1.5, 1.5, 'FD');

  const defaultInsight =
    data.aiAnalysis ||
    `This flame demonstrates characteristic microgravity combustion physics: natural buoyant convection is suppressed (Grashof number Gr < 10⁻⁴), establishing a spherically symmetric reaction zone governed by molecular Fickian diffusion. Radiative heat loss (q_rad ∝ T⁴) becomes the primary thermal dissipation mechanism, lowering the peak flame temperature compared to buoyant terrestrial flames. In quiescent conditions, combustion products linger at the boundary layer, self-limiting oxidizer flux. Under forced ventilation (such as spacecraft cabin airflow at 2-5 cm/s), the flame transforms into an opposed-flow diffusion boundary that can sustain low-temperature cool flame pathways without luminous soot emission.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  // Split text to fit width
  const splitAiText = doc.splitTextToSize(defaultInsight, contentWidth - 8);
  doc.text(splitAiText.slice(0, 7), margin + 4, y + 6);

  y += aiBoxHeight + 6;

  // --- Technical Specifications Matrix ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. FLIGHT HARDWARE & ENVIRONMENT TECHNICAL SPECIFICATIONS', margin, y);
  y += 4.5;

  // 4 Column Mini Matrix
  const colW = (contentWidth - 6) / 4;
  TECHNICAL_SPECS.forEach((cat, idx) => {
    const colX = margin + idx * (colW + 2);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colX, y, colW, 36, 1, 1, 'FD');

    // Header
    doc.setFillColor(241, 245, 249);
    doc.rect(colX, y, colW, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cat.category, colX + 2, y + 4.2);

    // List specs
    let itemY = y + 9.5;
    cat.specs.slice(0, 3).forEach((sp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(14, 116, 144);
      doc.text(sp.name, colX + 2, itemY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(sp.value, colX + 2, itemY + 3);

      itemY += 7.5;
    });
  });

  y += 42;

  // --- Spacecraft Fire Safety Pillars & Historic Lessons ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4. HUMAN EXPLORATION FIRE SAFETY ACTIONABLE INSIGHTS', margin, y);
  y += 4.5;

  const pillarW = (contentWidth - 4) / 3;
  const pillars = [
    {
      title: 'A. PREVENTION',
      subtitle: 'Materials & Atmosphere Limits',
      desc: 'Lunar habitats (34% O₂ at 8.2 psi) increase material flammability index by 1.72×. Screening must follow NASA-STD-6001 with forced low-velocity ventilation testing.',
    },
    {
      title: 'B. DETECTION',
      subtitle: 'Particle Discrimination',
      desc: 'Microgravity suppresses smoke plumes; optical alarms must distinguish benign cabin dust from low-temperature pyrolysis (as learned on Artemis II & SAME tests).',
    },
    {
      title: 'C. SUPPRESSION',
      subtitle: 'Extinguishing in Freefall',
      desc: 'Zero-g lacks chimney dissipation; gaseous CO₂/Helium must be applied without dispersing smoldering debris. Cool flames require prolonged soaking to prevent re-ignition.',
    },
  ];

  pillars.forEach((p, idx) => {
    const px = margin + idx * (pillarW + 2);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(px, y, pillarW, 26, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(p.title, px + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(p.subtitle, px + 3, y + 8.5);

    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    const splitPillar = doc.splitTextToSize(p.desc, pillarW - 6);
    doc.text(splitPillar, px + 3, y + 13);
  });

  y += 31;

  // --- Historic Mission Precedents (Artemis II, Mir, Apollo 13, Apollo 1) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Historic Mission Case Studies:', margin, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  const incidentsLine = HISTORIC_INCIDENTS.map(
    (inc) => `${inc.mission} (${inc.year}): ${inc.outcome.split(';')[0]}`
  ).join('  |  ');
  const splitIncidents = doc.splitTextToSize(incidentsLine, contentWidth);
  doc.text(splitIncidents.slice(0, 2), margin, y);

  // --- Footer Notice & Citations ---
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'NASA Physical Science Informatics (PSI) · ISS CIR (ACME, MDCA, SoFIE) · Cygnus Saffire · 2026 NASA Space Apps Challenge',
    margin,
    pageHeight - 8
  );
  doc.text(`Page 1 of 1 · Archival Report`, pageWidth - margin - 35, pageHeight - 8);

  // Trigger browser download
  const cleanFilename = `NASA_Microgravity_Flame_Summary_${data.sampleId}_${Date.now()}.pdf`;
  doc.save(cleanFilename);
}

export interface InquiryReportData {
  topicTitle: string;
  contextNote: string;
  promptText: string;
  responseModel: string;
  responseText: string;
  contactEmail?: string;
}

export function generateInquirySummaryPdf(data: InquiryReportData): void {
  const doc = pdfSafe(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }));

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Header Background Banner
  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 27.2, pageWidth, 0.8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SUPER INTELLIGENCE (SI) COMBUSTION INQUIRY DOSSIER', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `2026 NASA Space Apps Challenge · Engine: ${data.responseModel} · Flame in Freefall`,
    margin,
    18
  );
  doc.text(
    `Timestamp: ${new Date().toUTCString()} · Contact: ${data.contactEmail || 'rajkumarverma70790@gmail.com'}`,
    margin,
    23
  );

  y = 35;

  // Scientific Topic Header
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Topic: ${data.topicTitle}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Context: ${data.contextNote}`, margin + 4, y + 11);
  doc.text(`Inquiry Query: "${data.promptText.slice(0, 110)}..."`, margin + 4, y + 16);

  y += 26;

  // Inquiry Response Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(14, 116, 144);
  doc.text('AI MULTIDISCIPLINARY SYNTHESIS & REASONING', margin, y);
  y += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  const respHeight = 160;
  doc.roundedRect(margin, y, contentWidth, respHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const splitResp = doc.splitTextToSize(data.responseText, contentWidth - 8);
  // Cap at what fits comfortably on the page
  doc.text(splitResp.slice(0, 36), margin + 4, y + 7);

  y += respHeight + 8;

  // Bottom Notice
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'NASA Physical Science Informatics (PSI) · Human Spaceflight Fire Safety · 2026 NASA Space Apps Challenge',
    margin,
    pageHeight - 8
  );
  doc.text('Archival Research Dossier', pageWidth - margin - 35, pageHeight - 8);

  const safeTitle = data.topicTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24);
  doc.save(`SI_Combustion_Dossier_${safeTitle}_${Date.now()}.pdf`);
}


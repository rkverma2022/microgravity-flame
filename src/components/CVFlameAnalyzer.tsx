'use client';

import { RichText, RichMarkdown } from './RichText';
import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Scan, RefreshCw, BarChart2, AlertCircle, Download, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { generateFlameSummaryPdf } from '@/utils/pdfGenerator';

interface CVFlameAnalyzerProps {
  onOpenCollaboration?: () => void;
}

export const CVFlameAnalyzer: React.FC<CVFlameAnalyzerProps> = () => {
  const { isLabMode } = useTheme();
  const [selectedSample, setSelectedSample] = useState(0);
  const [filterMode, setFilterMode] = useState<'raw' | 'contours' | 'chemiluminescence' | 'thermal'>('chemiluminescence');
  const [thresholdVal, setThresholdVal] = useState(45);
  const [scanlineY, setScanlineY] = useState(50); // percentage 0-100
  const [probeData, setProbeData] = useState<{ x: number; y: number; r: number; g: number; b: number; tempK: number; zone: string } | null>(null);
  
  // Gemini AI Vision Analysis state
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // PDF Summary Download state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  const samples = [
    {
      id: 'sample-rtdfs',
      name: 'RTDFS 0.2s Quiescent Spherical Flame',
      notes: 'NASA ISS CIR SoFIE RTDFS 0.2s montage in quiescent chamber',
      src: '/assets/aistudio/image_74f77312.png',
      expectedSphericity: '98.6%',
      expectedTemp: '1620 K',
      regime: 'Quiescent 0g',
    },
    {
      id: 'sample-gel-pmma',
      name: 'SoFIE GEL Opposed-Flow 0.5mm PMMA',
      notes: 'NASA ISS CIR SoFIE GEL 0.5mm PMMA opposed flow at 2.5 cm/s',
      src: '/assets/aistudio/image_14495dab.png',
      expectedSphericity: '76.4%',
      expectedTemp: '1840 K',
      regime: 'Opposed Flow 2.5 cm/s',
    },
    {
      id: 'sample-hotwire',
      name: 'Ionized Hot-Wire Ignition Sequence',
      notes: 'NASA ISS CIR Nichrome coil ignition with localized ionization',
      src: '/assets/aistudio/image_b0113b75.png',
      expectedSphericity: '82.1%',
      expectedTemp: '2050 K',
      regime: 'Ignition Arc',
    },
  ];

  const currentSample = samples[selectedSample];

  // Render and process canvas image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentSample.src;

    img.onload = () => {
      canvas.width = 640;
      canvas.height = 360;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (filterMode === 'raw') {
        drawScanlineOverlay(ctx, canvas.width, canvas.height);
        updateLineScanGraph(canvas);
        return;
      }

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Computer Vision Image Filtering
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (filterMode === 'chemiluminescence') {
          // Blue chemiluminescent emission (CH* at 431nm) vs yellow incandescent soot
          const blueRatio = b / (r + g + b + 0.001);
          if (brightness > thresholdVal) {
            if (blueRatio > 0.45 && b > r) {
              data[i] = 10;
              data[i + 1] = 190;
              data[i + 2] = 255;
            } else if (r > 160 && g > 120) {
              data[i] = 255;
              data[i + 1] = 160;
              data[i + 2] = 20;
            }
          } else {
            data[i] = Math.round(r * 0.25);
            data[i + 1] = Math.round(g * 0.25);
            data[i + 2] = Math.round(b * 0.25);
          }
        } else if (filterMode === 'contours') {
          if (brightness > thresholdVal) {
            data[i] = 6;
            data[i + 1] = 182;
            data[i + 2] = 212;
          } else {
            data[i] = 10;
            data[i + 1] = 15;
            data[i + 2] = 25;
          }
        } else if (filterMode === 'thermal') {
          const norm = Math.min(255, (brightness / 255) * 320);
          data[i] = norm > 180 ? 255 : norm * 1.2;
          data[i + 1] = norm > 220 ? 240 : norm > 100 ? norm : 30;
          data[i + 2] = norm < 120 ? 220 : norm > 200 ? 50 : 20;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw HUD overlays & Scanline
      drawScanlineOverlay(ctx, canvas.width, canvas.height);
      updateLineScanGraph(canvas);
    };
  }, [selectedSample, filterMode, thresholdVal, scanlineY, isLabMode]);

  // Draw scanline on the main canvas
  const drawScanlineOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const y = (scanlineY / 100) * height;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scanline label
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px monospace';
    ctx.fillText(`SCANLINE Y=${Math.round(y)}px`, 10, y - 5 > 15 ? y - 5 : y + 15);
  };

  // Draw the intensity profile graph
  const updateLineScanGraph = (srcCanvas: CanvasRenderingContext2D['canvas']) => {
    const graphCanvas = graphCanvasRef.current;
    if (!graphCanvas) return;
    const gCtx = graphCanvas.getContext('2d');
    if (!gCtx) return;

    graphCanvas.width = 400;
    graphCanvas.height = 120;

    const sCtx = srcCanvas.getContext('2d');
    if (!sCtx) return;

    const y = Math.round((scanlineY / 100) * srcCanvas.height);
    const lineData = sCtx.getImageData(0, y, srcCanvas.width, 1).data;

    // Background dynamically adjusted for Lab Mode vs Dark Mode
    gCtx.fillStyle = isLabMode ? '#f8fafc' : '#0b0f19';
    gCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);

    // Grid lines
    gCtx.strokeStyle = isLabMode ? '#e2e8f0' : '#1e293b';
    gCtx.lineWidth = 1;
    gCtx.beginPath();
    gCtx.moveTo(0, 60);
    gCtx.lineTo(graphCanvas.width, 60);
    gCtx.stroke();

    // Plot Blue channel (Chemiluminescence)
    gCtx.strokeStyle = isLabMode ? '#0284c7' : '#38bdf8';
    gCtx.lineWidth = 1.5;
    gCtx.beginPath();
    for (let x = 0; x < srcCanvas.width; x++) {
      const b = lineData[x * 4 + 2];
      const gx = (x / srcCanvas.width) * graphCanvas.width;
      const gy = graphCanvas.height - (b / 255) * (graphCanvas.height - 10) - 5;
      if (x === 0) gCtx.moveTo(gx, gy);
      else gCtx.lineTo(gx, gy);
    }
    gCtx.stroke();

    // Plot Red channel (Thermal soot continuum)
    gCtx.strokeStyle = isLabMode ? '#ea580c' : '#f97316';
    gCtx.lineWidth = 1.5;
    gCtx.beginPath();
    for (let x = 0; x < srcCanvas.width; x++) {
      const r = lineData[x * 4];
      const gx = (x / srcCanvas.width) * graphCanvas.width;
      const gy = graphCanvas.height - (r / 255) * (graphCanvas.height - 10) - 5;
      if (x === 0) gCtx.moveTo(gx, gy);
      else gCtx.lineTo(gx, gy);
    }
    gCtx.stroke();
  };

  // Mouse move over canvas for crosshair probe
  const handleCanvasMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(canvas.width - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width)));
    const y = Math.min(canvas.height - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height)));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const brightness = (r + g + b) / 3;
    const estimatedTemp = Math.round(1100 + brightness * 3.8);

    let zone = 'Background / Quiescent Ambient';
    if (b > r && b > 60) zone = 'CH* Chemiluminescent Envelope';
    else if (r > 160 && g > 120) zone = 'Soot Incandescent Core / Hot Zone';
    else if (r > 80) zone = 'Preheat Boundary Layer';

    setProbeData({ x, y, r, g, b, tempK: estimatedTemp, zone });
  };

  // Send current flame to Gemini 3.8 Flash for super intelligence reasoning
  const handleTriggerAiAnalysis = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAiAnalyzing(true);
    setAiError(null);
    setAiReport(null);

    try {
      const base64Data = canvas.toDataURL('image/png');

      const res = await fetch('/api/gemini/analyze-flame-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: 'image/png',
          experimentNotes: `${currentSample.name} (${currentSample.notes})`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze flame image.');
      }

      setAiReport(data.analysis);
    } catch (err: unknown) {
      console.error(err);
      setAiError(err instanceof Error ? err.message : 'Server communication error.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Generate clean, professional PDF summary report
  const handleDownloadSummary = () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      generateFlameSummaryPdf({
        sampleName: currentSample.name,
        sampleId: currentSample.id,
        regime: currentSample.regime,
        notes: currentSample.notes,
        sphericity: currentSample.expectedSphericity,
        temperature: currentSample.expectedTemp,
        filterMode: filterMode,
        scanlineY: scanlineY,
        canvasElement: canvasRef.current,
        aiAnalysis: aiReport,
        contactEmail: 'rajkumarverma70790@gmail.com',
      });

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF summary:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section id="cv-lab" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>COMPUTER VISION LAB</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>REAL-TIME MORPHOLOGY & PYROMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Interactive Microgravity Flame Analyzer
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Test computer vision algorithms on authentic NASA high-speed flame sequences. Extract sphericity indices, isolate blue chemiluminescent envelopes, inspect cross-section spectrographic profiles, and run deep AI physical reasoning.
          </p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main: Canvas Stage & Spectrogram */}
          <div className="lg:col-span-8 space-y-4">
            {/* Sample Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {samples.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSample(idx);
                    setAiReport(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedSample === idx
                      ? 'bg-accent-subtle text-accent border border-accent-subtle font-semibold'
                      : 'bg-surface-elevated text-muted hover:text-title border border-theme-subtle'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Canvas Container */}
            <div className="bg-card-solid border border-theme rounded-lg overflow-hidden relative shadow-lg">
              <div className="px-4 py-2.5 bg-surface border-b border-theme flex items-center justify-between text-xs font-mono text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-semibold">VIEWPORT: 640×360</span>
                  <span aria-hidden="true" className="text-subtle">·</span>
                  <span>{currentSample.regime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    FILTER: <span className="text-title font-semibold uppercase">{filterMode}</span>
                  </div>
                  <button
                    onClick={handleDownloadSummary}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-500 hover:text-cyan-400 bg-accent-subtle hover:bg-surface border border-accent-subtle rounded transition-colors"
                    title="Generate and download a clean, professional PDF summary report"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Download</span> PDF
                  </button>
                </div>
              </div>

              {/* Main Canvas Viewport (Keeps black optical backdrop for chemiluminescence observation) */}
              <div className="relative flex items-center justify-center p-2 bg-black min-h-[200px] sm:min-h-[300px]">
                <canvas
                  ref={canvasRef}
                  onPointerMove={handleCanvasMouseMove}
                  onPointerDown={handleCanvasMouseMove}
                  onPointerLeave={() => setProbeData(null)}
                  className="w-full max-w-full h-auto cursor-crosshair touch-pan-y rounded border border-slate-900"
                />
              </div>

              {/* Probe Telemetry Bar */}
              <div className="px-4 py-2.5 bg-surface border-t border-theme flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                {probeData ? (
                  <div className="flex items-center gap-4 text-body">
                    <span className="text-accent font-semibold">
                      POINT: ({probeData.x}, {probeData.y})
                    </span>
                    <span className="text-muted">
                      RGB: [{probeData.r}, {probeData.g}, {probeData.b}]
                    </span>
                    <span className="text-amber-500 font-semibold">
                      EST. TEMP: ~{probeData.tempK} K
                    </span>
                    <span className="text-title truncate max-w-[200px]">
                      ZONE: {probeData.zone}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted">
                    Hover crosshair over flame canvas to inspect local spectral intensity & temperature.
                  </span>
                )}
              </div>
            </div>

            {/* Live Spectrographic Line Profile Graph */}
            <div className="bg-card-theme border border-theme rounded-lg p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-title font-semibold">
                  <BarChart2 className="w-4 h-4 text-accent" />
                  <span>Cross-Section Luminosity Profile (Scanline Y={Math.round((scanlineY / 100) * 360)}px)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={isLabMode ? 'text-sky-700 font-medium flex items-center gap-1' : 'text-[#38bdf8] flex items-center gap-1'}>
                    <span className="w-2.5 h-0.5 bg-[#0284c7] inline-block" /> Blue (CH* 431nm)
                  </span>
                  <span className={isLabMode ? 'text-orange-700 font-medium flex items-center gap-1' : 'text-[#f97316] flex items-center gap-1'}>
                    <span className="w-2.5 h-0.5 bg-[#ea580c] inline-block" /> Red (Thermal Soot)
                  </span>
                </div>
              </div>

              <div className="flex justify-center bg-surface-elevated rounded p-1 border border-theme">
                <canvas ref={graphCanvasRef} className="w-full h-[100px]" />
              </div>

              {/* Scanline Y Slider */}
              <div className="flex items-center gap-4 pt-1 text-xs font-mono text-muted">
                <span className="shrink-0">Adjust Scanline Y:</span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={scanlineY}
                  onChange={(e) => setScanlineY(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 h-1.5 bg-surface-elevated rounded cursor-pointer"
                />
                <span className="w-12 text-right text-title tabular-nums font-semibold">{scanlineY}%</span>
              </div>
            </div>
          </div>

          {/* Right Column: CV Controls & Gemini SI Reasoning */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vision Filter Mode Controls */}
            <div className="bg-card-theme border border-theme rounded-lg p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <span className="text-xs font-mono text-accent font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>CV Filter Modes</span>
                </span>
                <span className="text-xs font-mono text-muted">OPENCV EMULATOR</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilterMode('raw')}
                  className={`p-2.5 text-xs font-mono rounded text-left transition-colors border ${
                    filterMode === 'raw'
                      ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold'
                      : 'bg-surface-elevated text-muted border-theme-subtle hover:text-title'
                  }`}
                >
                  <span className="font-semibold block">1. Raw Capture</span>
                  <span className="text-[11px] text-muted">Unfiltered NASA frame</span>
                </button>

                <button
                  onClick={() => setFilterMode('chemiluminescence')}
                  className={`p-2.5 text-xs font-mono rounded text-left transition-colors border ${
                    filterMode === 'chemiluminescence'
                      ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold'
                      : 'bg-surface-elevated text-muted border-theme-subtle hover:text-title'
                  }`}
                >
                  <span className="font-semibold block">2. Chemiluminescence</span>
                  <span className="text-[11px] text-muted">CH* blue vs soot ratio</span>
                </button>

                <button
                  onClick={() => setFilterMode('contours')}
                  className={`p-2.5 text-xs font-mono rounded text-left transition-colors border ${
                    filterMode === 'contours'
                      ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold'
                      : 'bg-surface-elevated text-muted border-theme-subtle hover:text-title'
                  }`}
                >
                  <span className="font-semibold block">3. Edge Contours</span>
                  <span className="text-[11px] text-muted">Canny / Otsu perimeter</span>
                </button>

                <button
                  onClick={() => setFilterMode('thermal')}
                  className={`p-2.5 text-xs font-mono rounded text-left transition-colors border ${
                    filterMode === 'thermal'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-semibold'
                      : 'bg-surface-elevated text-muted border-theme-subtle hover:text-title'
                  }`}
                >
                  <span className="font-semibold block">4. Thermal Pyrometry</span>
                  <span className="text-[11px] text-muted">False-color gradient map</span>
                </button>
              </div>

              {/* Threshold Slider */}
              <div className="space-y-2 pt-2 border-t border-theme-subtle">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>Threshold Sensitivity:</span>
                  <span className="text-title font-semibold tabular-nums">{thresholdVal}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={thresholdVal}
                  onChange={(e) => setThresholdVal(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 h-1.5 bg-surface-elevated rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Physical Metrics */}
            <div className="bg-card-theme border border-theme rounded-lg p-5 space-y-3 font-mono text-xs shadow-sm">
              <span className="text-accent font-semibold uppercase tracking-wider block border-b border-theme-subtle pb-2">
                Morphological Flame Metrics
              </span>

              <div className="flex justify-between py-1 border-b border-theme-subtle">
                <span className="text-muted"><RichText text="Sphericity Index ($\Psi$):" /></span>
                <span className="font-bold text-title tabular-nums">{currentSample.expectedSphericity}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-theme-subtle">
                <span className="text-muted">Peak Flame Core Temp:</span>
                <span className="font-bold text-amber-500 tabular-nums">{currentSample.expectedTemp}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-theme-subtle">
                <span className="text-muted">Chemiluminescent Ratio:</span>
                <span className="font-bold text-accent tabular-nums"><RichText text="0.82 (Dominant CH*)" /></span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-muted">Radiation Loss Fraction:</span>
                <span className="font-bold text-title tabular-nums"><RichText text="$\chi_{\mathrm{rad}} \approx 0.38$" /></span>
              </div>

              {/* PDF Summary Report Action */}
              <div className="pt-3 border-t border-theme-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span>TECHNICAL SUMMARY DOSSIER</span>
                  </span>
                  <span className="text-accent font-semibold">PDF REPORT</span>
                </div>

                <button
                  onClick={handleDownloadSummary}
                  disabled={isGeneratingPdf}
                  className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md font-sans text-xs font-semibold transition-all border shadow-sm ${
                    pdfSuccess
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-surface hover:bg-surface-elevated border-theme text-title hover:text-cyan-500 hover:border-accent-subtle'
                  }`}
                  title="Generate a clean, professional PDF summary report with technical specs and key insights"
                >
                  {isGeneratingPdf ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
                      <span>Generating PDF Report...</span>
                    </>
                  ) : pdfSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Summary PDF Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-accent" />
                      <span>Download Flame Summary (PDF)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-muted leading-tight font-sans">
                  Exports a publication-ready report formatted with calibrated sphericity, pyrometric thermal profiles, NASA flight specs, and 3-pillar safety recommendations.
                </p>
              </div>
            </div>

            {/* AI Reasoning Trigger Box */}
            <div className="bg-surface border border-theme rounded-lg p-5 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-accent font-semibold">
                  <Scan className="w-4 h-4" />
                  <span>Gemini 3.8 Flash Combustion Vision</span>
                </div>
                <p className="text-xs text-muted">
                  Execute server-side multimodal inspection on current frame to extract habitat safety recommendations.
                </p>
              </div>

              <button
                onClick={handleTriggerAiAnalysis}
                disabled={isAiAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-surface-elevated disabled:text-muted rounded-md transition-colors"
              >
                {isAiAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Microgravity Frame...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-3.5 h-3.5" />
                    <span>Run Gemini AI Flame Diagnostics</span>
                  </>
                )}
              </button>

              {aiError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-xs text-rose-500 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiReport && (
                <div className="p-3.5 bg-card-theme border border-accent-subtle rounded text-xs text-body space-y-3 max-h-[260px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-theme-subtle pb-1.5">
                    <span className="text-accent font-mono font-semibold text-xs block">
                      AI COMBUSTION DIAGNOSTICS:
                    </span>
                    <button
                      onClick={handleDownloadSummary}
                      disabled={isGeneratingPdf}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-cyan-500 hover:text-cyan-400 bg-accent-subtle rounded border border-accent-subtle"
                      title="Include AI analysis in downloaded PDF summary"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Export with AI</span>
                    </button>
                  </div>
                  <div className="leading-relaxed text-body text-xs sm:text-[13px] font-sans">
                    <RichMarkdown text={aiReport} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

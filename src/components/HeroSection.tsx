'use client';

import { RichText } from './RichText';
import React, { useState, useRef } from 'react';
import { Eye, Cpu, Database, Flame, ShieldAlert, Sparkles, Crosshair, ChevronRight, Layers, Award } from 'lucide-react';

interface HeroSectionProps {
  onOpenCollaboration: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCollaboration }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [probePos, setProbePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const heroCaptures = [
    {
      id: 'rtdfs-montage',
      title: 'RTDFS 0.2s Microgravity Pulsing Montage',
      subtitle: 'Quiescent chamber fabric combustion aboard ISS CIR',
      path: '/assets/aistudio/image_74f77312.png',
      regime: '0g Quiescent',
      flowNote: 'Vaporization-driven self-induced flow; 0.2s oscillatory breathing',
      sphericity: '98.6%',
      sootIndex: '< 0.04 (Blue Chemiluminescent)',
    },
    {
      id: 'sofie-gel-opposed',
      title: 'SoFIE GEL 0.5mm PMMA Opposed Flow',
      subtitle: 'Growth and Extinction Limits under 2.5 cm/s counterflow',
      path: '/assets/aistudio/image_14495dab.png',
      regime: '0g Opposed Flow',
      flowNote: 'Uninterrupted oxygen diffusion front anchored against incoming draft',
      sphericity: '76.2%',
      sootIndex: '0.42 (Luminous Yellow Core)',
    },
    {
      id: 'hotwire-ignition',
      title: 'Ionized Hot-Wire Ignition Sequence',
      subtitle: 'Nichrome coil high-temperature energy transfer in microgravity',
      path: '/assets/aistudio/image_b0113b75.png',
      regime: '0g Ignition Phase',
      flowNote: 'Localized thermal boundary layer anchoring; no convective plume',
      sphericity: '82.4%',
      sootIndex: '0.28 (Localized Thermal Glow)',
    },
  ];

  const currentCapture = heroCaptures[activeImageIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setProbePos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <section className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 lg:pt-14 lg:pb-24 overflow-hidden border-b border-theme bg-canvas transition-colors duration-200">
      {/* Background space/lab grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b0d_1px,transparent_1px),linear-gradient(to_bottom,#64748b0d_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Unboxed Challenge Metadata Kicker */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tracking-wider text-accent mb-4">
          <span className="inline-flex items-center gap-1.5 font-bold text-accent">
            <Award className="w-3.5 h-3.5" />
            <span>2026 NASA Space Apps Challenge</span>
          </span>
          <span aria-hidden="true" className="text-subtle">·</span>
          <span>Challenge: Flame in Freefall</span>
          <span aria-hidden="true" className="text-subtle">·</span>
          <span>NASA PSI Database</span>
        </div>

        {/* 2-Column Split: Headline & Narrative on Left, NASA Interactive Visualizer on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="font-display text-[1.75rem] leading-[1.15] sm:text-4xl lg:text-5xl font-bold tracking-tight text-title leading-[1.15]" style={{ textWrap: 'balance' }}>
                Flame in Freefall: SI-Powered Fire Safety Insights
              </h1>

              <p className="text-base sm:text-lg text-body leading-relaxed font-normal">
                For decades, NASA has studied how flames and fire behave in microgravity, gathering a trove of experimental data along the way. That knowledge matters more than ever as humans gear up to return to the Moon with Artemis and press on to Mars.
              </p>

              <p className="text-sm text-body leading-relaxed">
                Flames in microgravity become ghostly blue spheres reliant on diffusion for oxygen. Our challenge is to build an <strong className="text-title font-semibold">interactive, Super Intelligence (SI) powered dashboard</strong> that summarizes, ranks, and interprets NASA’s Physical Science Informatics (PSI) database—from BASS and Saffire flammability tests to SAME smoke detection and FLEX water-mist suppression—to protect human space exploration and advance fire safety on Earth.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#atmosphere-calc"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-md transition-colors shadow-sm shadow-cyan-500/20 whitespace-nowrap min-h-[44px]"
              >
                <Flame className="w-4 h-4" />
                <span>Atmosphere & Flammability Sim</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#cv-lab"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-title bg-surface hover:bg-surface-elevated border border-theme rounded-md transition-colors whitespace-nowrap min-h-[44px]"
              >
                <Eye className="w-4 h-4 text-accent" />
                <span>CV Flame Analyzer</span>
              </a>

              <button
                onClick={onOpenCollaboration}
                className="text-xs font-medium text-muted hover:text-accent transition-colors flex items-center gap-1.5 py-2 whitespace-nowrap"
              >
                <span>Join Challenge Team</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            {/* Research Scope Badges (Unboxed) */}
            <div className="pt-4 border-t border-theme-subtle flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-muted">
              <span className="flex items-center gap-1.5 text-body">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span>BASS, Saffire & FLEX Datasets</span>
              </span>
              <span aria-hidden="true" className="text-subtle">/</span>
              <span className="flex items-center gap-1.5 text-body">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>NASA PSI Repository</span>
              </span>
              <span aria-hidden="true" className="text-subtle">/</span>
              <span className="flex items-center gap-1.5 text-body">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Moon Base & Rover Safety</span>
              </span>
            </div>
          </div>

          {/* Right Column: NASA Interactive Flame Visualizer */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-card-solid rounded-lg border border-theme overflow-hidden flex flex-col flex-1 shadow-lg">
              {/* Telemetry Header */}
              <div className="px-4 py-3 bg-surface border-b border-theme flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-body">
                  <span className="text-accent font-semibold">ISS CIR / PSI TELEMETRY</span>
                  <span aria-hidden="true" className="text-subtle">·</span>
                  <span className="text-muted">{currentCapture.regime}</span>
                </div>
                <div className="text-muted tabular-nums">
                  PROBE: X={probePos.x}% Y={probePos.y}%
                </div>
              </div>

              {/* Interactive Flame Canvas / Image Viewport */}
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative flex-1 min-h-[280px] sm:min-h-[340px] bg-black flex items-center justify-center overflow-hidden cursor-crosshair select-none group"
              >
                <img
                  src={currentCapture.path}
                  alt={currentCapture.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[380px] transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* HUD Crosshair on hover */}
                {isHovering && (
                  <div
                    className="absolute pointer-events-none transition-all duration-75"
                    style={{ left: `${probePos.x}%`, top: `${probePos.y}%` }}
                  >
                    <div className="relative -left-4 -top-4 w-8 h-8 flex items-center justify-center">
                      <Crosshair className="w-6 h-6 text-cyan-400 stroke-[1.5]" />
                      <div className="absolute left-6 top-0 bg-slate-950/95 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                        <RichText text="λ: 431nm (CH*) · T~1780K" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualizer Floating Overlay */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-sm border border-slate-800 p-2.5 rounded text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span className="truncate">{currentCapture.title}</span>
                    <span className="text-cyan-400 tabular-nums text-xs shrink-0">{currentCapture.sphericity} SPHERICITY</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">
                    {currentCapture.flowNote}
                  </p>
                </div>
              </div>

              {/* Capture Selector Tabs */}
              <div className="p-2 bg-surface border-t border-theme grid grid-cols-3 gap-1.5">
                {heroCaptures.map((capture, idx) => (
                  <button
                    key={capture.id}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`px-2 py-2 text-left rounded transition-colors text-xs font-mono flex flex-col justify-between ${
                      activeImageIdx === idx
                        ? 'bg-accent-subtle text-accent border border-accent-subtle font-semibold'
                        : 'bg-surface-elevated text-muted hover:text-title border border-transparent'
                    }`}
                  >
                    <span className="font-semibold truncate block">#{idx + 1} {capture.id.split('-')[0].toUpperCase()}</span>
                    <span className="text-[11px] text-subtle truncate mt-0.5">{capture.regime}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-theme-subtle grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted">Buoyancy Suppression</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-title tabular-nums">
              100.0 <span className="text-xs font-mono uppercase text-accent ml-1">%</span>
            </div>
            <p className="text-xs text-muted">Ghostly blue spherical flames reliant on pure diffusion</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted"><RichText text="Exploration O₂ Envelope" /></span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-title tabular-nums">
              34.0 <span className="text-xs font-mono uppercase text-accent ml-1">% <RichText text="O₂" /></span>
            </div>
            <p className="text-xs text-muted">+40% increase in oxygen for Moon Base & Pressurized Rover</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted">NASA Investigations</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-title tabular-nums">
              12+ <span className="text-xs font-mono uppercase text-accent ml-1">SERIES</span>
            </div>
            <p className="text-xs text-muted">BASS, Saffire, SAME, DAFT, FLEX, CFI-G & E-FIELD indexed</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted">Exploration Gravity Regimes</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-title tabular-nums">
              4 <span className="text-xs font-mono uppercase text-accent ml-1">MODELS</span>
            </div>
            <p className="text-xs text-muted">0g (ISS), 0.16g (Moon), 0.38g (Mars), 1g (Earth)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

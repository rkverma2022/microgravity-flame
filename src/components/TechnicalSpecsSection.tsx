'use client';

import { MathView } from './MathView';
import { RichText } from './RichText';
import React, { useState } from 'react';
import { TECHNICAL_SPECS } from '../data/nasaData';
import { Info } from 'lucide-react';

export const TechnicalSpecsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="specs" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>EXPERIMENTAL BENCHMARKS</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>EMPIRICAL CALIBRATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Key Technical Specifications & Regimes
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Data-driven combustion parameters calibrated across decades of orbital trials aboard the International Space Station, parabolic flights, and robotic Cygnus test vehicles.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-theme-subtle scrollbar-none">
          {TECHNICAL_SPECS.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(idx)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === idx
                  ? 'bg-accent-subtle text-accent border border-accent-subtle font-semibold'
                  : 'bg-surface-elevated text-muted hover:text-title border border-theme-subtle'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Selected Specification Table & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECHNICAL_SPECS[activeCategory].specs.map((item, idx) => (
            <div
              key={item.name}
              className="bg-card-theme border border-theme rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-theme-strong transition-colors shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-wider text-muted flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-xs text-subtle font-mono">SPEC #{idx + 1}</span>
                </span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-title tabular-nums tracking-tight">
                  <RichText text={item.value} />
                </div>
              </div>

              <div className="pt-3 border-t border-theme-subtle flex items-start gap-2 text-xs text-muted">
                <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span><RichText text={item.note} /></span>
              </div>
            </div>
          ))}
        </div>

        {/* Mathematical Reference Formula Box */}
        <div className="mt-10 p-6 bg-surface border border-theme rounded-lg font-mono text-xs text-body space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <span className="text-accent font-semibold uppercase tracking-wider">
              Governing Physical Equations: Microgravity Combustion Limit
            </span>
            <span className="text-muted">ISO/ASTM / NASA TM-2026-BPS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 bg-card-theme p-3 rounded border border-theme">
              <span className="text-muted text-xs">1. Grashof Number Suppression:</span>
              <div className="text-sm font-bold text-accent">
                <MathView math={"Gr = \\frac{g\\,\\beta\\,(T_f - T_\\infty)\\,L^{3}}{\\nu^{2}} \\to 0"} block />
              </div>
              <p className="text-xs text-muted">
                <RichText text="Since $g \approx 10^{-6}\,g_0$, buoyancy-driven Rayleigh instability collapses completely." />
              </p>
            </div>

            <div className="space-y-1.5 bg-card-theme p-3 rounded border border-theme">
              <span className="text-muted text-xs">2. Fickian Species Diffusion:</span>
              <div className="text-sm font-bold text-accent">
                <MathView math={"\\frac{\\partial Y_{\\mathrm{O_2}}}{\\partial t} = D_{AB}\\,\\nabla^{2} Y_{\\mathrm{O_2}} - \\frac{\\dot{\\omega}_{\\mathrm{O_2}}}{\\rho}"} block />
              </div>
              <p className="text-xs text-muted">
                Oxygen reaches the flame boundary purely via molecular diffusion gradients.
              </p>
            </div>

            <div className="space-y-1.5 bg-card-theme p-3 rounded border border-theme">
              <span className="text-muted text-xs">3. Radiative Quenching Limit:</span>
              <div className="text-sm font-bold text-accent">
                <MathView math={"\\dot{q}_{\\mathrm{rad}} = 4\\sigma a_p \\left(T_f^{4} - T_\\infty^{4}\\right)"} block />
              </div>
              <p className="text-xs text-muted">
                Without convective heat replenishment, radiative losses cause sudden flame extinction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

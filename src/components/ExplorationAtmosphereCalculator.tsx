'use client';

import { RichText } from './RichText';
import React, { useState } from 'react';
import { ATMOSPHERE_ENVIRONMENTS } from '../data/nasaData';
import { Gauge, Flame, Wind, ShieldAlert, Sparkles, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const ExplorationAtmosphereCalculator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('moon-base-habitat');
  const [oxygenPct, setOxygenPct] = useState<number>(34.0);
  const [pressurePsi, setPressurePsi] = useState<number>(8.2);
  const [flowVelocity, setFlowVelocity] = useState<number>(3.0);
  const [gravityRegime, setGravityRegime] = useState<string>('0.16g (Moon)');

  // Handle Preset Selection
  const handleSelectPreset = (envId: string) => {
    setSelectedPreset(envId);
    const env = ATMOSPHERE_ENVIRONMENTS.find((e) => e.id === envId);
    if (env) {
      setOxygenPct(env.oxygenPercent);
      setPressurePsi(env.pressurePsi);
      if (envId === 'moon-base-habitat') setGravityRegime('0.16g (Moon)');
      else if (envId === 'iss-standard' || envId === 'acme-cfig-extreme') setGravityRegime('0g (ISS)');
      else if (envId === 'earth-sea-level') setGravityRegime('1g (Earth)');
    }
  };

  // Derived Calculations
  const pressureKPa = Math.round(pressurePsi * 6.89476 * 10) / 10;
  const po2KPa = Math.round(((oxygenPct / 100) * pressureKPa) * 10) / 10;
  const po2Psi = Math.round(((oxygenPct / 100) * pressurePsi) * 100) / 100;
  
  // Flammability Multiplier: Scales strongly with O2% and flow, modulated by pressure
  // Earth standard is 21% O2 at 101.3 kPa => reference PO2 = 21.3 kPa
  const flammabilityFactor = Math.max(
    0.4,
    Math.round(
      (Math.pow(oxygenPct / 21.0, 1.45) * Math.pow(pressureKPa / 101.3, 0.25) * (1 + flowVelocity * 0.04)) * 100
    ) / 100
  );

  // Pre-breathe time estimation based on nitrogen partial pressure
  const pn2KPa = Math.max(0, pressureKPa - po2KPa);
  const estimatedPreBreatheMinutes = Math.max(
    0,
    Math.round((pn2KPa / 80.0) * 240)
  );

  const getRiskLevel = (factor: number) => {
    if (factor > 2.2) return { label: 'CRITICAL FLASHOVER RISK', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (factor > 1.35) return { label: 'ELEVATED FLAMMABILITY', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'NOMINAL ENVELOPE', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const risk = getRiskLevel(flammabilityFactor);

  return (
    <section id="atmosphere-calc" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>NASA 2026 SPACE APPS CHALLENGE TOOL</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>EXPLORATION ATMOSPHERE & FLAMMABILITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Exploration Atmosphere & Flammability Simulator
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            <RichText text="To enable spacesuit flexibility (100% O₂ at 4.3 psi) and minimize 4-hour pre-breathe times, future Moon bases and rovers will operate under oxygen-enriched atmospheres (≥30% O₂ at low pressure). Simulate how these environmental tradeoffs alter material ignition and fire propagation." />
          </p>
        </div>

        {/* Preset Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {ATMOSPHERE_ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              onClick={() => handleSelectPreset(env.id)}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all whitespace-nowrap shrink-0 border ${
                selectedPreset === env.id
                  ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold shadow-sm'
                  : 'bg-surface-elevated text-muted hover:text-title border-theme-subtle'
              }`}
            >
              <span>{env.name}</span>
              <span className="text-[11px] text-muted ml-1.5 font-normal">
                (<RichText text={`${env.oxygenPercent}% O₂ / ${env.pressurePsi} psi`} />)
              </span>
            </button>
          ))}
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (Left) */}
          <div className="lg:col-span-5 bg-card-theme border border-theme rounded-lg p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <span className="text-xs font-mono text-accent font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                <span>Atmospheric Parameters</span>
              </span>
              <span className="text-xs font-mono text-muted">INTERACTIVE CONTROLS</span>
            </div>

            {/* Oxygen % Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Oxygen Concentration:</span>
                <span className="text-title font-bold text-sm tabular-nums text-accent"><RichText text={`${oxygenPct.toFixed(1)}% O₂`} /></span>
              </div>
              <input
                type="range"
                min="15.0"
                max="100.0"
                step="0.5"
                value={oxygenPct}
                onChange={(e) => {
                  setOxygenPct(parseFloat(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>15% (Hypoxic)</span>
                <span>21% (Earth)</span>
                <span>34% (Moon Base)</span>
                <span>100% (Suit)</span>
              </div>
            </div>

            {/* Total Pressure Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Total Cabin Pressure:</span>
                <span className="text-title font-bold text-sm tabular-nums">
                  {pressurePsi.toFixed(1)} psi <span className="text-muted font-normal">({pressureKPa} kPa)</span>
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="16.0"
                step="0.1"
                value={pressurePsi}
                onChange={(e) => {
                  setPressurePsi(parseFloat(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>4.3 psi (EVA Suit)</span>
                <span>8.2 psi (Rover)</span>
                <span>10.2 psi (Artemis)</span>
                <span>14.7 psi (1 atm)</span>
              </div>
            </div>

            {/* Forced Airflow Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Cabin Airflow Speed:</span>
                <span className="text-title font-bold text-sm tabular-nums">{flowVelocity.toFixed(1)} cm/s</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="25.0"
                step="0.5"
                value={flowVelocity}
                onChange={(e) => setFlowVelocity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>0 cm/s (Quiescent)</span>
                <span>3 cm/s (BASS Test)</span>
                <span>20 cm/s (Saffire Duct)</span>
              </div>
            </div>

            {/* Gravity Level Selector */}
            <div className="space-y-2 pt-2 border-t border-theme-subtle">
              <span className="text-xs font-mono text-muted uppercase block">Gravitational Environment:</span>
              <div className="grid grid-cols-2 gap-2">
                {['0g (ISS)', '0.16g (Moon)', '0.38g (Mars)', '1g (Earth)'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGravityRegime(g)}
                    className={`p-2 text-xs font-mono rounded text-center transition-colors border ${
                      gravityRegime === g
                        ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold'
                        : 'bg-surface text-muted border-theme-subtle hover:text-title'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results & Safety Output Column (Right) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg border ${risk.bg} flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-3">
                <ShieldAlert className={`w-5 h-5 shrink-0 ${risk.color}`} />
                <div>
                  <div className={`text-xs font-mono font-bold tracking-wider ${risk.color}`}>
                    {risk.label}
                  </div>
                  <div className="text-xs text-body mt-0.5">
                    {flammabilityFactor > 1.35
                      ? 'Solid polymers ignite faster and sustain flame spread at wider extinction limits than on Earth.'
                      : 'Atmosphere is within the controlled combustion research baseline.'}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className="text-[11px] text-muted block uppercase">FLAMMABILITY INDEX</span>
                <span className={`text-2xl font-bold tabular-nums ${risk.color}`}>
                  <RichText text={`${flammabilityFactor}×`} />
                </span>
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card-theme border border-theme rounded-lg p-4 space-y-1 shadow-sm">
                <span className="text-xs font-mono uppercase text-muted block">Oxygen Partial Pressure</span>
                <div className="text-2xl font-mono font-bold text-title tabular-nums">
                  {po2KPa} <span className="text-xs font-normal text-accent">kPa</span>
                </div>
                <div className="text-[11px] font-mono text-muted"><RichText text={`${po2Psi} psi O₂`} /></div>
              </div>

              <div className="bg-card-theme border border-theme rounded-lg p-4 space-y-1 shadow-sm">
                <span className="text-xs font-mono uppercase text-muted block">Pre-Breathe Required</span>
                <div className="text-2xl font-mono font-bold text-title tabular-nums flex items-baseline gap-1">
                  <Clock className="w-4 h-4 text-accent self-center" />
                  <span>~{estimatedPreBreatheMinutes}</span> <span className="text-xs font-normal text-accent">min</span>
                </div>
                <div className="text-[11px] font-mono text-muted">Before spacesuit EVA exit</div>
              </div>

              <div className="bg-card-theme border border-theme rounded-lg p-4 space-y-1 shadow-sm">
                <span className="text-xs font-mono uppercase text-muted block"><RichText text="O₂ Concentration Delta" /></span>
                <div className="text-2xl font-mono font-bold text-title tabular-nums">
                  {oxygenPct > 21 ? `+${Math.round(((oxygenPct - 21) / 21) * 100)}%` : `${Math.round(((oxygenPct - 21) / 21) * 100)}%`}
                </div>
                <div className="text-[11px] font-mono text-muted">vs Earth Sea Level (21%)</div>
              </div>
            </div>

            {/* Detailed Space Safety Interpretation Card */}
            <div className="bg-surface border border-theme rounded-lg p-6 space-y-4 shadow-sm text-xs font-sans">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>NASA Physical Science Informatics (PSI) Correlation</span>
                </span>
                <span className="font-mono text-xs text-muted">NASA SPACE APPS BRIEF</span>
              </div>

              <div className="space-y-3 text-body leading-relaxed">
                <p>
                  <strong><RichText text="Why does the Moon Base increase O₂?" /></strong> <RichText text="In Apollo 13, the cabin was at 5 psi with pure oxygen, but modern spacesuits operate at 4.3 psi 100% O₂. When transitioning from 14.7 psi (ISS) to 4.3 psi (spacesuit), astronauts must breathe pure oxygen for 4 hours to avoid decompression sickness. Operating the Moon Base at " /><strong><RichText text="34% O₂ at 8.2 psi" /></strong><RichText text=" slashes pre-breathe to 30 minutes, enabling rapid daily surface exploration." />
                </p>

                <p>
                  <strong>The Flammability Tradeoff:</strong> At 34% oxygen, materials normally considered flame-retardant on Earth (like Nomex blends and treated PMMA) burn readily in microgravity and lunar gravity (0.16g). As proven by the <strong>BASS-II and Saffire</strong> flight tests, low airflow velocities (1–5 cm/s) provide the maximum opposed-flow combustion rate without convective flame blowout.
                </p>
              </div>

              {/* Related NASA Investigation Tag Strip */}
              <div className="pt-3 border-t border-theme-subtle flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-muted">Primary PSI Reference Studies:</span>
                <span className="bg-surface-elevated px-2 py-0.5 rounded border border-theme text-title font-semibold">BASS-II</span>
                <span className="bg-surface-elevated px-2 py-0.5 rounded border border-theme text-title font-semibold">Saffire-I..VI</span>
                <span className="bg-surface-elevated px-2 py-0.5 rounded border border-theme text-title font-semibold">ACME CFI-G</span>
                <span className="bg-surface-elevated px-2 py-0.5 rounded border border-theme text-title font-semibold">SAME-R</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

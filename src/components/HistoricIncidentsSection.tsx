'use client';

import { RichText } from './RichText';
import React, { useState } from 'react';
import { HISTORIC_INCIDENTS } from '../data/nasaData';
import { AlertOctagon, ShieldCheck, Flame, LifeBuoy, Droplets, Radio, ChevronRight } from 'lucide-react';

export const HistoricIncidentsSection: React.FC = () => {
  const [activeIncidentIdx, setActiveIncidentIdx] = useState(0);
  const activeIncident = HISTORIC_INCIDENTS[activeIncidentIdx];

  const pillars = [
    {
      title: '1. Prevention',
      icon: ShieldCheck,
      color: 'text-cyan-500',
      subtitle: 'Controlling Ignition & Material Selection',
      summary:
        'Eliminating ignition sources and testing solid polymers/fabrics in exploration atmospheres (≥30% O₂ at 8.2–10.2 psi). Evaluated through BASS, BASS-II, and Saffire meter-scale trials.',
    },
    {
      title: '2. Detection',
      icon: Radio,
      color: 'text-amber-500',
      subtitle: 'Microgravity Smoke vs Lunar Regolith Dust',
      summary:
        'Microgravity smoke particles form large fractal aggregates up to 10× Earth size. SAME, SAME-R, and DAFT developed sensors that discriminate lethal wire pyrolysis from abrasive lunar dust.',
    },
    {
      title: '3. Suppression',
      icon: Droplets,
      color: 'text-indigo-500',
      subtitle: 'Atmospheric Dilution & Fine Water Mist',
      summary:
        'Studied in FLEX & FLEX-2 using CO₂ and He dilution. Led to clean water-mist extinguishers deployed aboard ISS, avoiding hazardous toxic residues and preventing cool-flame reignitions.',
    },
  ];

  return (
    <section id="incidents-pillars" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>NASA MISSION BACKGROUND</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>WHY FIRE SAFETY DECIDES HUMAN EXPLORATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Historic Space Fires & NASA’s 3 Pillars of Safety
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            In microgravity, warm gases do not rise, smoke does not layer at the ceiling, and astronauts cannot evacuate. Every NASA human mission relies on empirical data to prevent, detect, and suppress combustion in sealed habitats.
          </p>
        </div>

        {/* 3 Core Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-card-theme border border-theme rounded-lg p-6 space-y-3 flex flex-col justify-between shadow-sm hover:border-theme-strong transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                      PILLAR #{idx + 1}
                    </span>
                    <Icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-title">{p.title}</h3>
                  <div className="text-xs font-mono text-muted">{p.subtitle}</div>
                  <p className="text-xs text-body leading-relaxed">
                    <RichText text={p.summary} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Historic Incidents Interactive Showcase */}
        <div className="bg-card-solid border border-theme rounded-lg overflow-hidden shadow-lg">
          <div className="px-6 py-4 bg-surface border-b border-theme flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              <span className="font-mono text-xs uppercase tracking-wider text-title font-bold">
                Lessons from Spaceflight Fire Emergencies
              </span>
            </div>
            <div className="text-xs font-mono text-muted">
              4 HISTORIC BENCHMARKS
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Incident Selector Buttons */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-theme p-4 space-y-2 bg-surface-elevated">
              {HISTORIC_INCIDENTS.map((inc, idx) => (
                <button
                  key={inc.mission}
                  onClick={() => setActiveIncidentIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs font-mono flex items-center justify-between ${
                    activeIncidentIdx === idx
                      ? 'bg-card-solid border-cyan-500/50 text-title shadow-sm'
                      : 'bg-surface border-theme-subtle text-muted hover:text-title hover:bg-surface'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-title">{inc.mission} ({inc.year})</div>
                    <div className="text-xs text-muted truncate max-w-[220px]">
                      {inc.cause}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${activeIncidentIdx === idx ? 'text-accent' : 'text-muted'}`} />
                </button>
              ))}
            </div>

            {/* Right: Selected Incident Deep Dive */}
            <div className="lg:col-span-8 p-6 sm:p-8 space-y-5 bg-card-theme flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-title">{activeIncident.mission} Fire Incident</h4>
                    <span className="text-xs font-mono text-accent">YEAR: {activeIncident.year}</span>
                  </div>
                  <div className="text-xs font-mono bg-surface border border-theme px-3 py-1 rounded text-muted">
                    ATMOSPHERE: <RichText text={activeIncident.atmosphere} />
                  </div>
                </div>

                {activeIncident.quote && (
                  <blockquote className="p-3.5 bg-surface border-l-2 border-cyan-500 rounded-r text-xs sm:text-sm font-sans italic text-title leading-relaxed">
                    {activeIncident.quote}
                  </blockquote>
                )}

                <div className="space-y-2 text-xs sm:text-sm text-body leading-relaxed">
                  <div>
                    <strong className="text-title font-mono text-xs uppercase block text-muted mb-0.5">Root Cause:</strong>
                    {activeIncident.cause}
                  </div>

                  <div>
                    <strong className="text-title font-mono text-xs uppercase block text-muted mb-0.5">Mission Outcome:</strong>
                    {activeIncident.outcome}
                  </div>
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="p-4 bg-surface border border-theme rounded-lg text-xs space-y-1">
                <span className="text-accent font-mono text-[11px] font-bold uppercase tracking-wider block">
                  Foundational Fire Safety Insight:
                </span>
                <p className="text-body leading-relaxed">
                  {activeIncident.lessonsLearned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earth Applications Callout */}
        <div className="mt-12 p-6 bg-surface border border-theme rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-emerald-500 mb-2 font-semibold">
            <span>NASA PHYSICAL SCIENCE INFORMATICS (PSI) TECHNOLOGY TRANSFER</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>TERRESTRIAL SAFETY APPLICATIONS</span>
          </div>
          <h3 className="text-lg font-bold text-title mb-3">
            How NASA Microgravity Combustion Data Protects Earth
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-body leading-relaxed">
            <div>
              <strong className="text-title block mb-1 font-semibold">Fine-Water-Mist Suppression:</strong>
              Extinguishers pioneered in the FLEX experiment replace toxic Halon systems in aircraft cabins, hospital ICUs, and commercial data centers with microscopic non-conductive water droplets.
            </div>
            <div>
              <strong className="text-title block mb-1 font-semibold">Advanced Firefighter Gear:</strong>
              Flame-resistant fabrics and lightweight composite air tanks developed for spacecraft EVA and flammability testing now shield municipal and wildland firefighters across the globe.
            </div>
            <div>
              <strong className="text-title block mb-1 font-semibold">Underground Wildfire Smolder:</strong>
              Quiescent diffusion experiments in SoFIE provide mathematical models for predicting subterranean peat moss and forest duff holdover fires that smolder invisibly under snow and reignite in spring.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

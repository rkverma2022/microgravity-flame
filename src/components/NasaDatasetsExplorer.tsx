'use client';

import { RichText } from './RichText';
import React, { useState } from 'react';
import { NASA_EXPERIMENTS } from '../data/nasaData';
import { NasaExperiment } from '../types/nasa';
import { Search, ExternalLink, Eye, ArrowRightLeft, Check, X, ShieldAlert, Radio, Droplets, Zap, Filter } from 'lucide-react';

export const NasaDatasetsExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [selectedFacility, setSelectedFacility] = useState<string>('All');
  const [activeExpModal, setActiveExpModal] = useState<NasaExperiment | null>(null);
  const [compareList, setCompareList] = useState<NasaExperiment[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const filtered = NASA_EXPERIMENTS.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPillar =
      selectedPillar === 'All' || exp.safetyPillar === selectedPillar;

    const matchesFacility =
      selectedFacility === 'All' || exp.facility.toLowerCase().includes(selectedFacility.toLowerCase());

    return matchesSearch && matchesPillar && matchesFacility;
  });

  const toggleCompare = (exp: NasaExperiment) => {
    if (compareList.some((e) => e.id === exp.id)) {
      setCompareList(compareList.filter((e) => e.id !== exp.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], exp]);
      } else {
        setCompareList([...compareList, exp]);
      }
    }
  };

  const getPillarIcon = (pillar: NasaExperiment['safetyPillar']) => {
    switch (pillar) {
      case 'Prevention': return ShieldAlert;
      case 'Detection': return Radio;
      case 'Suppression': return Droplets;
      case 'Partial-g Simulation': return Zap;
      default: return ShieldAlert;
    }
  };

  return (
    <section id="datasets" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>NASA PHYSICAL SCIENCE INFORMATICS (PSI) ARCHIVE</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>RESEARCHER & STUDENT DIRECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            NASA Microgravity Combustion Investigations
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Index, rank, and compare flight investigations from the Combustion Integrated Rack (CIR), Microgravity Science Glovebox (MSG), and Cygnus Saffire vehicles. Tailored for aerospace engineers, researchers, and students.
          </p>
        </div>

        {/* Filters and Comparison Launcher */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search by acronym (BASS, Saffire, FLEX, SAME), fuel, or hardware..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-theme rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm font-sans text-title placeholder-muted focus:outline-none focus:border-cyan-500 shadow-sm"
              />
            </div>

            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Compare Selected ({compareList.length}/2)</span>
              </button>
            )}
          </div>

          {/* Safety Pillar Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="text-muted mr-1 hidden sm:inline">Pillar:</span>
            {['All', 'Prevention', 'Detection', 'Suppression', 'Partial-g Simulation'].map((pillar) => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap border ${
                  selectedPillar === pillar
                    ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold shadow-sm'
                    : 'bg-surface-elevated text-muted hover:text-title border-theme-subtle'
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>

          {/* Facility Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <span className="text-muted mr-1 shrink-0">Facility:</span>
            {['All', 'ISS CIR', 'ISS MSG', 'Cygnus Saffire'].map((fac) => (
              <button
                key={fac}
                onClick={() => setSelectedFacility(fac)}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 border ${
                  selectedFacility === fac
                    ? 'bg-surface text-title border-theme-strong font-semibold'
                    : 'bg-surface-elevated text-muted hover:text-title border-theme-subtle'
                }`}
              >
                {fac}
              </button>
            ))}
          </div>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => {
            const PillarIcon = getPillarIcon(exp.safetyPillar);
            const isSelectedForCompare = compareList.some((e) => e.id === exp.id);

            return (
              <div
                key={exp.id}
                className="bg-card-theme border border-theme rounded-lg overflow-hidden flex flex-col justify-between hover:border-theme-strong transition-all shadow-sm group"
              >
                {/* Image Preview */}
                <div className="relative h-44 bg-black overflow-hidden flex items-center justify-center border-b border-theme">
                  <img
                    src={exp.imagePath}
                    alt={exp.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge: Pillar */}
                  <div className="absolute top-3 left-3 bg-black/90 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                    <PillarIcon className="w-3 h-3 text-cyan-400" />
                    <span>{exp.safetyPillar}</span>
                  </div>

                  {/* Top Right: Compare Checkbox */}
                  <button
                    onClick={() => toggleCompare(exp)}
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                      isSelectedForCompare
                        ? 'bg-cyan-500 text-slate-900 border-cyan-400 font-bold'
                        : 'bg-black/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelectedForCompare ? '✓ Compared' : '+ Compare'}
                  </button>

                  <div className="absolute bottom-3 left-3 text-xs font-mono text-slate-200">
                    FLOW: <span className="text-white font-semibold">{exp.flowVelocity}</span> ({exp.flowRegime})
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted">
                      <span>{exp.facility}</span>
                      <span className="text-accent font-semibold">{exp.hardwareApparatus}</span>
                    </div>

                    <h3 className="text-base font-bold text-title group-hover:text-cyan-500 transition-colors">
                      {exp.title}
                    </h3>

                    <div className="text-xs font-mono text-muted">
                      FUEL: <span className="text-body font-medium"><RichText text={exp.fuelType} /></span>
                    </div>

                    <p className="text-xs text-body leading-relaxed line-clamp-3">
                      <RichText text={exp.description} />
                    </p>
                  </div>

                  {/* Fire Safety Insight Banner */}
                  <div className="p-3 bg-surface border border-theme rounded text-xs space-y-1">
                    <span className="text-accent font-mono text-[11px] font-semibold uppercase block">
                      Safety Finding:
                    </span>
                    <p className="text-body text-xs leading-relaxed line-clamp-2">
                      <RichText text={exp.keyFinding} />
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-theme-subtle flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => setActiveExpModal(exp)}
                      className="text-accent hover:text-cyan-600 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Deep Inspector</span>
                    </button>

                    <a
                      href={exp.citationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted hover:text-title flex items-center gap-1"
                    >
                      <span>PSI Entry</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Modal */}
        {showCompareModal && compareList.length >= 1 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card-solid border border-theme rounded-lg max-w-4xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 space-y-6 relative shadow-2xl">
              <button
                onClick={() => setShowCompareModal(false)}
                className="absolute top-4 right-4 p-2 text-muted hover:text-title rounded-md bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 border-b border-theme-subtle pb-4">
                <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                  NASA INVESTIGATION COMPARATOR
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-title">
                  Side-by-Side Experimental Attribute Comparison
                </h3>
                <p className="text-xs text-muted">
                  Compare fuels, oxygen limits, flow speeds, and safety findings across investigations.
                </p>
              </div>

              {/* 2-Column Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {compareList.map((exp, idx) => (
                  <div key={exp.id} className="bg-surface border border-theme rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                      <span className="text-xs font-mono text-accent font-bold">
                        INVESTIGATION #{idx + 1}: {exp.acronym}
                      </span>
                      <span className="text-xs font-mono text-muted">{exp.facility}</span>
                    </div>

                    <h4 className="text-base font-bold text-title">{exp.title}</h4>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2 bg-card-theme rounded border border-theme flex justify-between">
                        <span className="text-muted">Safety Pillar:</span>
                        <span className="text-title font-semibold">{exp.safetyPillar}</span>
                      </div>
                      <div className="p-2 bg-card-theme rounded border border-theme flex justify-between">
                        <span className="text-muted">Hardware:</span>
                        <span className="text-title font-semibold">{exp.hardwareApparatus}</span>
                      </div>
                      <div className="p-2 bg-card-theme rounded border border-theme flex justify-between">
                        <span className="text-muted">Fuel Type:</span>
                        <span className="text-title font-semibold truncate max-w-[200px]"><RichText text={exp.fuelType} /></span>
                      </div>
                      <div className="p-2 bg-card-theme rounded border border-theme flex justify-between">
                        <span className="text-muted">Flow Velocity:</span>
                        <span className="text-title font-semibold">{exp.flowVelocity}</span>
                      </div>
                      <div className="p-2 bg-card-theme rounded border border-theme flex justify-between">
                        <span className="text-muted">Oxygen %:</span>
                        <span className="text-accent font-bold">{exp.oxygenPercent}% <RichText text="O₂" /></span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-title font-mono text-xs uppercase block text-muted">Core Finding:</strong>
                        <p className="text-body leading-relaxed bg-card-theme p-2.5 rounded border border-theme">
                          <RichText text={exp.keyFinding} />
                        </p>
                      </div>

                      <div>
                        <strong className="text-title font-mono text-xs uppercase block text-accent">Earth Application:</strong>
                        <p className="text-body leading-relaxed bg-card-theme p-2.5 rounded border border-theme">
                          {exp.earthApplication}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-theme-subtle flex justify-end">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-5 py-2.5 bg-surface hover:bg-surface-elevated text-title border border-theme rounded text-xs font-mono font-medium"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deep Inspector Modal */}
        {activeExpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card-solid border border-theme rounded-lg max-w-3xl w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 space-y-6 relative shadow-2xl">
              <button
                onClick={() => setActiveExpModal(null)}
                className="absolute top-4 right-4 p-2 text-muted hover:text-title rounded-md bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold">
                  <span>{activeExpModal.facility}</span>
                  <span aria-hidden="true" className="text-subtle">·</span>
                  <span>{activeExpModal.hardwareApparatus}</span>
                  <span aria-hidden="true" className="text-subtle">·</span>
                  <span>PILLAR: {activeExpModal.safetyPillar}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-title">
                  {activeExpModal.title}
                </h3>
              </div>

              {/* Large Image Preview */}
              <div className="bg-black rounded-lg overflow-hidden border border-theme flex items-center justify-center">
                <img
                  src={activeExpModal.imagePath}
                  alt={activeExpModal.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[360px] object-contain"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-surface rounded-lg text-xs font-mono border border-theme">
                <div>
                  <span className="text-muted block text-xs">FUEL TYPE</span>
                  <span className="text-title font-semibold"><RichText text={activeExpModal.fuelType} /></span>
                </div>
                <div>
                  <span className="text-muted block text-xs">FLOW VELOCITY</span>
                  <span className="text-title font-semibold">{activeExpModal.flowVelocity}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">OXYGEN CONC.</span>
                  <span className="text-accent font-semibold">{activeExpModal.oxygenPercent}% <RichText text="O₂" /></span>
                </div>
                <div>
                  <span className="text-muted block text-xs">GRAVITY LEVEL</span>
                  <span className="text-title font-semibold">{activeExpModal.gravityLevel}</span>
                </div>
              </div>

              {/* Detailed Findings & Earth App */}
              <div className="space-y-4 text-xs sm:text-sm text-body">
                <div className="space-y-1">
                  <h4 className="font-semibold font-mono text-xs uppercase text-accent">
                    Experimental Objective & Finding:
                  </h4>
                  <p className="leading-relaxed bg-surface p-3.5 rounded border border-theme">
                    <RichText text={activeExpModal.keyFinding} />
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold font-mono text-xs uppercase text-amber-500">
                    Spacecraft Fire Safety Protocol:
                  </h4>
                  <p className="leading-relaxed bg-surface p-3.5 rounded border border-theme">
                    <RichText text={activeExpModal.fireSafetyInsight} />
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold font-mono text-xs uppercase text-emerald-500">
                    Terrestrial Application (Earth Safety):
                  </h4>
                  <p className="leading-relaxed bg-surface p-3.5 rounded border border-theme">
                    {activeExpModal.earthApplication}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-theme-subtle flex items-center justify-between text-xs font-mono">
                <a
                  href={activeExpModal.citationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:text-cyan-600 font-semibold"
                >
                  <span>NASA PSI / SVS Citation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveExpModal(null)}
                  className="px-4 py-2 bg-surface hover:bg-surface-elevated text-title border border-theme rounded font-medium"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

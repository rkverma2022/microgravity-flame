'use client';

import { RichText } from './RichText';
import React from 'react';
import { Target, Compass, AlertOctagon, Flame, Trees, Zap } from 'lucide-react';

export const VisionMissionSection: React.FC = () => {
  return (
    <section id="vision" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme relative bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>CORE DIRECTIVE</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>HUMAN SPACE EXPLORATION SAFETY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Vision, Mission & The Problem of Fire in the Void
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Understanding fire where gravity disappears is not just fundamental physics—it is the cornerstone of keeping astronauts alive on the Moon, during Mars transit, and on planetary bases.
          </p>
        </div>

        {/* 3 Pillar Cards: Problem, Vision, Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* 1. Problem Statement */}
          <div className="bg-card-theme border border-theme rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-title">The Problem Statement</h3>
              <p className="text-sm text-body leading-relaxed">
                In a closed spacecraft 200 million miles from Earth, <strong className="text-title font-semibold">astronauts cannot evacuate and cannot dial 911</strong>. Gravity clouds terrestrial combustion studies; in orbit, the absence of natural buoyant convection causes flames to burn as slow, deceptively cool, sootless spheres. Traditional optical smoke detectors fail to detect them until pyrolysis is catastrophic. Furthermore, decades of NASA microgravity experiments (CIR, SoFIE, Saffire) have produced massive datasets that remain isolated in scientific repositories, hard to search, cross-reference, and apply in real time.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-theme-subtle text-xs font-mono text-rose-500 font-medium">
              RISK: RADIATIVE QUENCHING & SATELLITE PYROLYSIS
            </div>
          </div>

          {/* 2. What We Want to Achieve (Vision) */}
          <div className="bg-card-theme border border-theme rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle border border-accent-subtle flex items-center justify-center text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-title">Our Vision</h3>
              <p className="text-sm text-body leading-relaxed">
                To build an autonomous <strong className="text-title font-semibold">Super Intelligence (SI) Combustion Engine</strong> that ingests raw telemetry, high-speed camera frames, and material flammability trials to predict, rank, and simulate fire behavior across variable gravity (0g, Lunar 0.16g, Mars 0.38g). We envision a future where autonomous habitat life-support systems detect smoldering before flame emergence, dynamically adjusting atmospheric composition and local airflow vectors to extinguish risks instantly.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-theme-subtle text-xs font-mono text-accent font-medium">
              TARGET: AUTONOMOUS HABITAT FIRE DEFENSE
            </div>
          </div>

          {/* 3. Our Mission */}
          <div className="bg-card-theme border border-theme rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-title">Our Mission</h3>
              <p className="text-sm text-body leading-relaxed">
                As a multidisciplinary team of AI/ML engineers, data scientists, software developers, and space exploration enthusiasts, our mission is to democratize NASA physical science data through <strong className="text-title font-semibold">computer vision pipelines, interactive web tooling, and deep AI synthesis</strong>. We are turning raw high-speed flame imagery into quantifiable metrics—sphericity, chemiluminescent emission ratios, energy transfer rates, and extinction thresholds.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-theme-subtle text-xs font-mono text-emerald-500 font-medium">
              METHOD: COMPUTER VISION + ML + OPEN SCIENCE
            </div>
          </div>
        </div>

        {/* Deep Theoretical Hypotheses */}
        <div className="bg-surface border border-theme rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 mb-2">
            <span>EXPANDING THE BOUNDARIES OF COMBUSTION</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>CROSS-DOMAIN PHYSICS HYPOTHESES</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-title mb-6">
            Beyond Microgravity: Wildfires, Energy Transfer & Plasma Dynamics
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Terrestrial Wildfire smoldering */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Trees className="w-4 h-4" />
                <span>Terrestrial Forest Fire Smoldering</span>
              </div>
              <p className="text-sm text-body leading-relaxed">
                Deep beneath forest floors, peat moss and packed organic duff burn in a slow, low-oxygen, diffusion-dominated regime with minimal buoyant draft. Microgravity SoFIE experiments on porous solid fuels provide the exact mathematical analog needed to model underground wildfire holdovers and sudden reignition triggers on Earth.
              </p>
            </div>

            {/* Energy Transfer Rates */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <Flame className="w-4 h-4" />
                <span>Energy Transfer Rate Physics</span>
              </div>
              <p className="text-sm text-body leading-relaxed">
                <RichText text={String.raw`When two compounds fuse and generate energy during combustion, the rate of energy dissipation determines flame stability. In 0g, convective losses vanish, leaving Stefan-Boltzmann radiation ($\dot{q}_{\mathrm{rad}} \propto T^{4}$) and molecular conduction to dominate. This isolates the fundamental chemical kinetics of fuels without turbulent gravity interference.`} />
              </p>
            </div>

            {/* Plasma Thrusters & Electrostatic Effects */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
                <Zap className="w-4 h-4" />
                <span>Electrostatic Coupling & Plasma Thrusters</span>
              </div>
              <p className="text-sm text-body leading-relaxed">
                <RichText text={String.raw`Flames are naturally weakly ionized gases containing chemi-ions (H₃O⁺, CHO⁺, e⁻). Applying an electrostatic field creates an "ionic wind" that exerts body forces on the flame zone. In plasma thrusters (Hall-effect and gridded ion thrusters), electrostatic fields accelerate ions to high specific impulse ($I_{\mathrm{sp}}$). Understanding ionized flame boundaries in microgravity bridges chemical combustion with electrical propulsion physics.`} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

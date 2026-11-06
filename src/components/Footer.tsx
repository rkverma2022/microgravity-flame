'use client';

import React from 'react';
import { Flame, ExternalLink, ArrowUp, ArrowUpRight, Mail, Users, Rocket } from 'lucide-react';

interface FooterProps {
  onOpenCollaboration: () => void;
}

const EXPLORE = [
  { label: 'Vision & Safety', href: '#vision' },
  { label: 'Historic Fires', href: '#incidents-pillars' },
  { label: 'Atmosphere Sim', href: '#atmosphere-calc' },
  { label: 'Course', href: '#course' },
  { label: 'Equations', href: '#equations' },
];

const LAB = [
  { label: 'CV Flame Lab', href: '#cv-lab' },
  { label: 'SI Intelligence', href: '#si-engine' },
  { label: 'PSI Datasets', href: '#datasets' },
  { label: 'System Architecture', href: '#architecture' },
  { label: 'Team', href: '#team' },
];

const SOURCES = [
  { label: 'NASA SVS 31394', href: 'http://svs.gsfc.nasa.gov/31394/' },
  { label: 'NASA Space Apps Challenge', href: 'https://www.spaceappschallenge.org' },
  { label: 'NASA.gov', href: 'https://www.nasa.gov' },
];

const EMAIL = 'rajkumarverma70790@gmail.com';

export const Footer: React.FC<FooterProps> = ({ onOpenCollaboration }) => {
  const linkClass = 'inline-block py-1 text-sm text-body hover:text-accent transition-colors';
  const headingClass = 'mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-subtle';

  return (
    <footer className="relative bg-inset border-t border-theme transition-colors duration-200">
      {/* Accent hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        {/* Top: brand + team card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 border-b border-theme-subtle">
          <div className="lg:col-span-5 space-y-5">
            <a href="#" className="inline-flex items-center gap-3 group" aria-label="Flame in Microgravity — back to top">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/25 to-indigo-500/20 border border-accent-subtle flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <Flame className="w-5 h-5 text-accent" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-title">Flame in Microgravity</span>
            </a>
            <p className="max-w-md text-sm leading-relaxed text-body">
              A multidisciplinary research platform turning NASA microgravity combustion experiments into actionable
              fire-safety intelligence for deep space exploration and terrestrial applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenCollaboration}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 transition-colors shadow-sm shadow-cyan-500/25"
              >
                <Users className="w-4 h-4" />
                Collaborate with us
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium text-title border border-theme bg-surface hover:border-theme-strong transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
                Email the team
              </a>
            </div>
          </div>

          {/* Team / challenge card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-theme bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-subtle">
                <Rocket className="w-3.5 h-3.5 text-accent" />
                Mission details
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-xl bg-surface-elevated border border-theme-subtle p-4">
                  <dt className="text-[11px] font-mono uppercase tracking-wider text-muted">Team name</dt>
                  <dd className="mt-1.5 font-display text-lg font-semibold text-title">Flame in Microgravity</dd>
                </div>
                <div className="rounded-xl bg-surface-elevated border border-theme-subtle p-4">
                  <dt className="text-[11px] font-mono uppercase tracking-wider text-muted">Challenge</dt>
                  <dd className="mt-1.5 font-display text-lg font-semibold text-title">NASA App Challenge</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Data sourced from the NASA Biological and Physical Sciences (BPS) Division, the ISS Combustion
                Integrated Rack (CIR), and the SoFIE and Saffire programs.
              </p>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-theme-subtle">
          <nav aria-label="Explore">
            <h2 className={headingClass}>Explore</h2>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Lab and data">
            <h2 className={headingClass}>Lab & data</h2>
            <ul>
              {LAB.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sources">
            <h2 className={headingClass}>Sources</h2>
            <ul>
              {SOURCES.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer noopener" className={`${linkClass} inline-flex items-center gap-1.5`}>
                    {l.label}
                    <ExternalLink className="w-3 h-3 text-subtle" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-1">
            <h2 className={headingClass}>Contact</h2>
            <a href={`mailto:${EMAIL}`} className="block py-1 text-sm text-body hover:text-accent transition-colors break-all">
              {EMAIL}
            </a>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Researchers, engineers, designers and space-safety enthusiasts are welcome to join.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 text-xs text-muted">
          <p>© 2026 Flame in Microgravity · NASA App Challenge · Open Science & Research Initiative.</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-theme bg-surface text-body hover:text-title hover:border-theme-strong transition-colors"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
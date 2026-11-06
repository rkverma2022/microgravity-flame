'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Flame,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  FlaskConical,
  Moon,
  ShieldAlert,
  History,
  Wind,
  GraduationCap,
  Sigma,
  ScanEye,
  BrainCircuit,
  Database,
  Users,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface NavbarProps {
  onOpenCollaboration: (track?: string) => void;
}

type NavItem = { label: string; href: string; desc: string; icon: React.ElementType };
type NavGroup = { id: string; label: string; href?: string; items: NavItem[] };

// 8 flat links were too many for one row, so they are grouped by intent.
const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { label: 'Vision & Safety', href: '#vision', desc: 'Why fire in freefall matters', icon: ShieldAlert },
      { label: 'Historic Fires', href: '#incidents-pillars', desc: 'Apollo, Mir, Artemis & NASA’s 3 pillars', icon: History },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { label: 'Atmosphere Sim', href: '#atmosphere-calc', desc: 'Flammability in Moon-base air', icon: Wind },
      { label: 'Course', href: '#course', desc: 'Microgravity flame science, step by step', icon: GraduationCap },
      { label: 'Equations', href: '#equations', desc: 'Governing equations compendium', icon: Sigma },
    ],
  },
  {
    id: 'lab',
    label: 'Lab',
    items: [
      { label: 'CV Flame Lab', href: '#cv-lab', desc: 'Computer-vision flame analyzer', icon: ScanEye },
      { label: 'SI Intelligence', href: '#si-engine', desc: 'Ask the combustion AI engine', icon: BrainCircuit },
    ],
  },
  {
    id: 'data',
    label: 'Datasets',
    href: '#datasets',
    items: [{ label: 'PSI Datasets', href: '#datasets', desc: 'NASA flight investigations', icon: Database }],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.id })));
const SECTION_IDS = ALL_ITEMS.map((i) => i.href.slice(1));

export const Navbar: React.FC<NavbarProps> = ({ onOpenCollaboration }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);
  const { isLabMode, toggleTheme } = useTheme();

  const navRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-spy + reading progress + compact header on scroll
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

      let current = '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Close dropdown on outside click / Escape; close mobile sheet on Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock page scroll while the mobile sheet is open; auto-close when resized to desktop
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setMobileOpen(false);
    mq.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = '';
      mq.removeEventListener('change', onChange);
    };
  }, [mobileOpen]);

  const activeGroup = ALL_ITEMS.find((i) => i.href === `#${activeId}`)?.group ?? '';

  const hoverOpen = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(id);
  }, []);
  const hoverClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140);
  }, []);

  const ThemeIcon = isLabMode ? Moon : FlaskConical;
  const themeLabel = isLabMode ? 'Switch to dark mode' : 'Switch to lab mode (high-contrast light)';

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-200 bg-nav backdrop-blur-xl ${
          scrolled ? 'border-theme shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]' : 'border-theme-subtle'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={navRef} className={`flex items-center justify-between gap-4 transition-[height] duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>
            {/* Brand */}
            <a href="#" className="flex items-center gap-2.5 shrink-0 group" aria-label="Flame in Freefall — back to top">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/25 to-indigo-500/20 border border-accent-subtle flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <Flame className="w-[18px] h-[18px] text-accent" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-[15px] font-semibold tracking-tight text-title">Flame in Freefall</span>
                <span className="hidden sm:block mt-1 text-[10.5px] font-mono uppercase tracking-[0.14em] text-subtle">NASA Microgravity Fire Safety</span>
              </span>
            </a>

            {/* Desktop navigation — grouped pill */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-surface border border-theme-subtle">
              {NAV_GROUPS.map((g) => {
                const isActive = activeGroup === g.id;
                const hasMenu = g.items.length > 1;
                const base =
                  'relative inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap';
                const state = isActive
                  ? 'text-title bg-accent-subtle ring-1 ring-inset ring-[color:var(--color-accent-border)]'
                  : 'text-body hover:text-title hover:bg-surface';

                if (!hasMenu) {
                  return (
                    <a key={g.id} href={g.items[0].href} className={`${base} ${state}`} aria-current={isActive ? 'true' : undefined}>
                      {g.label}
                    </a>
                  );
                }
                const open = openGroup === g.id;
                return (
                  <div key={g.id} className="relative" onMouseEnter={() => hoverOpen(g.id)} onMouseLeave={hoverClose}>
                    <button
                      type="button"
                      className={`${base} ${state}`}
                      aria-haspopup="menu"
                      aria-expanded={open}
                      onClick={() => setOpenGroup(open ? null : g.id)}
                    >
                      {g.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                      <div
                        role="menu"
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72 z-50"
                      >
                        <div className="rounded-xl border border-theme bg-card-solid shadow-2xl shadow-black/40 p-1.5 animate-in">
                          {g.items.map((item) => {
                            const Icon = item.icon;
                            const itemActive = activeId === item.href.slice(1);
                            return (
                              <a
                                key={item.href}
                                role="menuitem"
                                href={item.href}
                                onClick={() => setOpenGroup(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                                  itemActive ? 'bg-accent-subtle' : 'hover:bg-surface-elevated'
                                }`}
                              >
                                <span className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-surface-elevated border border-theme-subtle flex items-center justify-center text-accent">
                                  <Icon className="w-4 h-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-title">{item.label}</span>
                                  <span className="block text-xs text-muted leading-snug">{item.desc}</span>
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center gap-2 h-9 w-9 xl:w-auto xl:px-3 rounded-full border border-theme bg-surface text-body hover:text-title hover:border-theme-strong transition-colors"
                title={themeLabel}
                aria-label={themeLabel}
              >
                <ThemeIcon className={`w-4 h-4 ${isLabMode ? 'text-indigo-500' : 'text-cyan-400'}`} />
                <span className="hidden xl:inline text-xs font-medium">{isLabMode ? 'Dark' : 'Lab'} mode</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCollaboration()}
                className="hidden md:inline-flex items-center gap-1.5 h-9 pl-4 pr-3 rounded-full text-[13px] font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 transition-colors shadow-sm shadow-cyan-500/25"
              >
                Collaborate
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-theme bg-surface text-body hover:text-title"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Reading progress */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] pointer-events-none" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>

      {/* Mobile / tablet sheet */}
      {mobileOpen && (
        <div id="mobile-nav" className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-30">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative max-h-full overflow-y-auto overscroll-contain bg-card-solid border-b border-theme shadow-2xl animate-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
              {NAV_GROUPS.filter((g) => g.id !== 'data').map((g) => (
                <section key={g.id}>
                  <h2 className="mb-2 px-1 text-[11px] font-mono uppercase tracking-[0.16em] text-subtle">{g.label}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {g.items.map((item) => {
                      const Icon = item.icon;
                      const itemActive = activeId === item.href.slice(1);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors min-h-[56px] ${
                            itemActive
                              ? 'bg-accent-subtle border-accent-subtle'
                              : 'bg-surface border-theme-subtle hover:border-theme-strong'
                          }`}
                        >
                          <span className="w-9 h-9 shrink-0 rounded-lg bg-surface-elevated border border-theme-subtle flex items-center justify-center text-accent">
                            <Icon className="w-[18px] h-[18px]" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-title">{item.label}</span>
                            <span className="block text-xs text-muted leading-snug truncate">{item.desc}</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              ))}

              <a
                href="#datasets"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border bg-surface border-theme-subtle hover:border-theme-strong min-h-[56px]"
              >
                <span className="w-9 h-9 shrink-0 rounded-lg bg-surface-elevated border border-theme-subtle flex items-center justify-center text-accent">
                  <Database className="w-[18px] h-[18px]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-title">PSI Datasets</span>
                  <span className="block text-xs text-muted">NASA flight investigations</span>
                </span>
              </a>

              <div className="flex flex-col sm:flex-row gap-2 pt-1 pb-[env(safe-area-inset-bottom)]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenCollaboration();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300"
                >
                  <Users className="w-4 h-4" />
                  Join the team & collaborate
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center gap-2 h-12 px-4 rounded-xl border border-theme bg-surface text-sm font-medium text-title"
                >
                  <ThemeIcon className={`w-4 h-4 ${isLabMode ? 'text-indigo-500' : 'text-cyan-400'}`} />
                  {isLabMode ? 'Dark mode' : 'Lab mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
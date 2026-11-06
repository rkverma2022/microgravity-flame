'use client';

import React, { useState } from 'react';
import { TEAM_TRACKS } from '../data/nasaData';
import { Mail, MessageCircle, ArrowRight, Check, Users, Copy, CheckCheck } from 'lucide-react';

interface TeamSectionProps {
  onOpenCollaboration: (trackId?: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onOpenCollaboration }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const userEmail = 'rajkumarverma70790@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="team" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>MULTIDISCIPLINARY COLLABORATION</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>OPEN RESEARCH INITIATIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Join Our Team: Translating Space Combustion to Earth & Beyond
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            We are a multidisciplinary team exploring how AI, machine learning, and data visualization can turn NASA microgravity combustion data into useful fire-safety insights. We’re looking for creative teammates interested in <span className="text-accent font-semibold">AI/ML, Python, data science, software development, visualization, and space exploration</span>.
          </p>
        </div>

        {/* Contact Strip: Email & WhatsApp Direct Connect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Email Connect Card */}
          <div className="bg-card-theme border border-theme rounded-lg p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>Direct Email Collaboration</span>
                </span>
                <span className="text-xs font-mono text-muted">PRIMARY CONTACT</span>
              </div>
              <h3 className="text-lg font-bold text-title break-all">{userEmail}</h3>
              <p className="text-xs text-body leading-relaxed">
                Send research inquiries, collaboration proposals, or portfolio links directly to lead researcher Rajkumar Verma.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`mailto:${userEmail}?subject=Flame%20in%20Microgravity%20Collaboration&body=Hi%20Rajkumar,%0A%0AI%20am%20interested%20in%20joining%20the%20Flame%20in%20Microgravity%20initiative.%20My%20background%20is%20in:%0A%0A`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Collaboration Email</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-title bg-surface hover:bg-surface-elevated rounded-md transition-colors border border-theme"
              >
                {copiedEmail ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Connect Card */}
          <div className="bg-card-theme border border-theme rounded-lg p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Fast Outreach</span>
                </span>
                <span className="text-xs font-mono text-muted">INSTANT MESSAGING</span>
              </div>
              <h3 className="text-lg font-bold text-title">Chat on WhatsApp</h3>
              <p className="text-xs text-body leading-relaxed">
                Connect directly for rapid technical syncs, theoretical discussions on energy transfer, or agile sprint coordination.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onOpenCollaboration()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Connect via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Multidisciplinary Tracks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-theme pb-3">
            <h3 className="text-lg font-bold text-title flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span>Open Collaboration Tracks</span>
            </h3>
            <span className="text-xs font-mono text-muted">4 ACTIVE FOCUS AREAS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_TRACKS.map((track) => (
              <div
                key={track.id}
                className="bg-card-theme border border-theme rounded-lg p-6 space-y-5 flex flex-col justify-between hover:border-theme-strong transition-colors shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-title">{track.title}</h4>
                    <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
                      OPEN TRACK
                    </span>
                  </div>

                  <p className="text-xs text-body leading-relaxed">
                    {track.focusArea}
                  </p>

                  {/* Skills (Unboxed with · separator) */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-muted uppercase block mb-1.5">
                      Target Technical Skills:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-body">
                      {track.skills.map((skill, i) => (
                        <React.Fragment key={skill}>
                          <span className="bg-surface px-2 py-0.5 rounded border border-theme text-title">
                            {skill}
                          </span>
                          {i < track.skills.length - 1 && <span className="text-muted">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-mono text-muted uppercase block">
                      Target Deliverables:
                    </span>
                    {track.deliverables.map((del, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-body">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-theme-subtle flex items-center justify-between">
                  <button
                    onClick={() => onOpenCollaboration(track.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:text-cyan-600"
                  >
                    <span>Apply for this track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

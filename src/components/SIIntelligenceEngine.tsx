'use client';

import { RichMarkdown } from './RichText';
import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, AlertCircle, Flame, Trees, Zap, Orbit, CheckCircle, Download, FileText } from 'lucide-react';
import { generateInquirySummaryPdf } from '@/utils/pdfGenerator';

export const SIIntelligenceEngine: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('rtdfs-pulsing');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<{ text: string; model: string; timestamp: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const curatedScenarios = [
    {
      id: 'rtdfs-pulsing',
      title: 'RTDFS 0.2s Breathing Oscillations in Quiescent Chambers',
      tag: 'SoFIE Fluid Dynamics',
      icon: Flame,
      context: 'NASA ISS CIR SoFIE RTDFS test on thin fabric in quiescent microgravity',
      prompt:
        'Explain the exact fluid dynamic and fuel vaporization physics behind why the microgravity flame pulses and breathes at 0.2s intervals in a quiescent chamber. Detail why oxygen is drawn periodically and how this changes emergency ventilation shutdown protocols for astronaut habitats.',
    },
    {
      id: 'wildfire-smolder',
      title: 'Terrestrial Forest Fire & Subterranean Smolder Translation',
      tag: 'Earth Forest Fire Dynamics',
      icon: Trees,
      context: 'Cross-domain physics linking zero-buoyancy smolder to deep forest duff and peat fires',
      prompt:
        'How does diffusion-limited combustion in microgravity directly inform our understanding of subterranean forest fires and peat duff smoldering on Earth where buoyancy is physically suppressed by porous ground packing? Detail energy transfer rates and sudden reignition triggers.',
    },
    {
      id: 'plasma-thruster',
      title: 'Flame Energy Transfer, Ion Kinetics & Plasma Thrusters',
      tag: 'Electrostatic Ionization Link',
      icon: Zap,
      context: 'Rajkumar Verma theoretical hypothesis connecting combustion energy transfer rate and electrostatic ionic wind to plasma propulsion',
      prompt:
        'Analyze the theoretical link between energy transfer rates in combustion flames (where 2 compounds fuse/react exothermically) and plasma thrusters. Specifically explore how the electrostatic effect and chemi-ions (H3O+, CHO+, electrons) affect energy dissipation and whether electrostatic fields can accelerate combustion or stabilize thruster ion extraction.',
    },
    {
      id: 'lunar-mars-paradox',
      title: 'Partial Gravity Paradox: Lunar (0.16g) vs Mars (0.38g)',
      tag: 'Artemis & Mars Transit Safety',
      icon: Orbit,
      context: 'NASA combustion science models comparing 0g, 0.16g, 0.38g, and 1g',
      prompt:
        'Why are solid spacecraft materials sometimes more flammable in partial gravity (Moon 0.16g or Mars 0.38g) than in either pure microgravity (0g) or normal Earth gravity (1g)? Detail the unstable chimney effect and provide explicit fire safety specs for lunar surface habitats.',
    },
  ];

  const handleSelectScenario = (scenario: typeof curatedScenarios[0]) => {
    setSelectedTopic(scenario.id);
    setCustomPrompt(scenario.prompt);
    executeInquiry(scenario.title, scenario.context, scenario.prompt);
  };

  const executeInquiry = async (topicTitle: string, contextNote: string, promptText: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setResponseResult(null);

    try {
      const res = await fetch('/api/gemini/scientific-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTitle,
          context: contextNote,
          customPrompt: promptText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to query combustion intelligence.');
      }

      setResponseResult(data);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Server communication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    executeInquiry('Custom Combustion Hypothesis', 'User-Initiated Combustion Inquiry', customPrompt);
  };

  const handleDownloadInquirySummary = () => {
    if (!responseResult) return;
    const activeScenario = curatedScenarios.find((s) => s.id === selectedTopic);
    generateInquirySummaryPdf({
      topicTitle: activeScenario ? activeScenario.title : 'Custom Combustion Hypothesis',
      contextNote: activeScenario ? activeScenario.context : 'Human Spaceflight Research Inquiry',
      promptText: customPrompt || (activeScenario ? activeScenario.prompt : ''),
      responseModel: responseResult.model,
      responseText: responseResult.text,
      contactEmail: 'rajkumarverma70790@gmail.com',
    });
  };

  return (
    <section id="si-engine" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>SUPER INTELLIGENCE REASONING</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>GEMINI 3.8 FLASH ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            SI Combustion & Fire Safety Intelligence
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Harness our server-side Gemini 3.8 Flash combustion intelligence engine to synthesize complex microgravity findings, validate hypotheses on energy transfer and electrostatic effects, and extract actionable fire safety rules.
          </p>
        </div>

        {/* 4 Curated Deep Science Inquiries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {curatedScenarios.map((sc) => {
            const IconComponent = sc.icon;
            const isSelected = selectedTopic === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all shadow-sm ${
                  isSelected
                    ? 'bg-card-solid border-cyan-500/50 text-title shadow-cyan-500/5'
                    : 'bg-surface-elevated border-theme-subtle text-body hover:text-title hover:bg-surface'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                      {sc.tag}
                    </span>
                    <IconComponent className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-xs font-semibold leading-snug text-title">
                    {sc.title}
                  </h3>
                </div>
                <div className="pt-3 mt-3 border-t border-theme-subtle text-[11px] font-mono text-muted flex items-center justify-between">
                  <span>RUN INQUIRY</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Query Console & Response Display */}
        <div className="bg-card-solid border border-theme rounded-lg overflow-hidden shadow-xl">
          {/* Console Header */}
          <div className="px-5 py-3 bg-surface border-b border-theme flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-body">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-semibold text-title">COMBUSTION INTELLIGENCE CONSOLE</span>
              <span aria-hidden="true" className="text-subtle">·</span>
              <span className="text-muted">ENGINE: GEMINI-3.8-FLASH</span>
            </div>
            {responseResult && (
              <span className="text-xs text-muted font-mono">
                GENERATED AT: {new Date(responseResult.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Custom Input Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <label htmlFor="custom-prompt-input" className="block text-xs font-mono text-title uppercase tracking-wider font-semibold">
                Inquire or Test Custom Combustion Hypothesis:
              </label>
              <div className="flex gap-3">
                <textarea
                  id="custom-prompt-input"
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ask about flame propagation rates, radiation quenching, Moon vs Mars habitat safety, or plasma thruster electrostatic analogies..."
                  className="w-full bg-inset border border-theme rounded-lg p-3 text-xs sm:text-sm font-sans text-title placeholder-muted focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || !customPrompt.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-surface-elevated disabled:text-muted rounded-md transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Combustion Physics...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Execute SI Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-500 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="space-y-1">
                  <div className="font-semibold">Execution Error</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            )}

            {/* Response Presentation */}
            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-muted">
                <RefreshCw className="w-6 h-6 animate-spin text-accent" />
                <span className="text-xs font-mono">
                  Gemini 3.8 Flash computing Fickian diffusion rates, extinction envelopes & habitat protocols...
                </span>
              </div>
            )}

            {responseResult && !isLoading && (
              <div className="bg-surface border border-theme rounded-lg p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold uppercase tracking-wider">SI Combustion Insight Synthesis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted hidden sm:inline">
                      MODEL: {responseResult.model}
                    </span>
                    <button
                      onClick={handleDownloadInquirySummary}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-500 hover:text-cyan-400 bg-accent-subtle hover:bg-surface border border-accent-subtle rounded transition-colors"
                      title="Download clean, professional PDF summary report of this inquiry"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Summary (PDF)</span>
                    </button>
                  </div>
                </div>

                <div className="max-w-none text-sm sm:text-[0.95rem] text-body leading-relaxed font-sans">
                  <RichMarkdown text={responseResult.text} />
                </div>
              </div>
            )}

            {!responseResult && !isLoading && !errorMsg && (
              <div className="py-8 text-center text-muted text-xs font-mono">
                Select one of the 4 curated scenarios above or type a custom question to execute SI combustion intelligence.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import { RichText } from './RichText';
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const SystemArchitectureSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState(1);

  const layers = [
    {
      id: 1,
      name: 'Layer 1: NASA Data Ingestion & Normalization',
      category: 'Data Engineering & Hardware Feeds',
      description:
        'Continuous ingestion of NASA Physical Sciences Informatics (PSI) raw datasets, ISS CIR chamber telemetry, SVS 31394 imagery, radiometer voltage curves, and pressure/oxygen timeseries.',
      techStack: ['Python', 'Pandas', 'NASA PSI API', 'NetCDF / HDF5', 'FFmpeg Raw Decompression'],
      subsystems: [
        'High-speed video frame extraction (0.2s - 1.0s interval sequences)',
        'Sensor time-synchronization (Pressure, O₂ molar fraction, Radiometer)',
        'Background noise subtraction & vignetting optical correction',
      ],
    },
    {
      id: 2,
      name: 'Layer 2: Computer Vision Flame Analysis Engine',
      category: 'Optical Vision & Contour Kinematics',
      description:
        'Real-time edge detection and morphological segmentation isolating spherical blue flame envelopes from incandescent soot zones, calculating sphericity, and measuring propagation vectors.',
      techStack: ['OpenCV', 'PyTorch Vision', 'RGB Color-Ratio Thermometry', 'Canny / Otsu Contours'],
      subsystems: [
        'Circularity index extraction: $\\Psi = \\dfrac{4\\pi \\cdot \\text{Area}}{\\text{Perimeter}^{2}}$',
        'Chemiluminescent blue (CH* 431nm) vs yellow soot luminosity separation',
        'Flame propagation velocity tracking: dr/dt across consecutive frames',
        'Ionized hot-wire proximity & thermal boundary gradient mapping',
      ],
    },
    {
      id: 3,
      name: 'Layer 3: Super Intelligence (SI) Physics Reasoning Core',
      category: 'Multimodal AI & Physics-Informed ML',
      description:
        'Powered by Google GenAI (Gemini 3.8 Flash) integrated with physics-informed surrogate models to interpret non-intuitive combustion anomalies, predict extinction limits, and rank habitat hazard levels.',
      techStack: ['@google/genai SDK', 'Gemini 3.8 Flash', 'Physics-Informed Neural Nets (PINNs)', 'Next.js Route Handlers'],
      subsystems: [
        'Extinction boundary forecasting across variable g (0g, 0.16g Moon, 0.38g Mars)',
        'Combustion anomaly explanation (e.g. 0.2s quiescent breathing pulse)',
        'Automated NASA scientific paper & dataset citation cross-referencing',
      ],
    },
    {
      id: 4,
      name: 'Layer 4: Cross-Domain Dual Translation Engine',
      category: 'Real-World Technology Transfer',
      description:
        'Bridging microgravity combustion physics to terrestrial forestry defense and electric space propulsion systems.',
      techStack: ['Electrostatic Ion Drift Modeling', 'Wildfire Smolder Kinetics', 'Python SciPy', 'Simulation'],
      subsystems: [
        'Forest floor / peat duff diffusion-limited smoldering transition predictor',
        'Electrostatic field interaction on flame ions & energy transfer rates',
        'Plasma thruster ionization efficiency & electrode wear cross-correlations',
      ],
    },
    {
      id: 5,
      name: 'Layer 5: Astronaut Fire Safety & Mission Ops Console',
      category: 'Human Spaceflight Decision Support',
      description:
        'Interactive mission control dashboard delivering real-time fire safety scores, material flammability rankings, and autonomous atmospheric suppression protocols.',
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Canvas 2D HUD', 'Next.js 15'],
      subsystems: [
        'Material Flammability Ranking Matrix for Artemis lunar surface modules',
        'Emergency cabin depressurization vs hypoxic nitrogen purging planner',
        'Quiescent smolder sensor warning system bypassing optical smoke lag',
      ],
    },
  ];

  const current = layers[activeLayer];

  return (
    <section id="architecture" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <span>FULL-STACK SYSTEM DESIGN</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>END-TO-END PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            System Architecture & Technology Stack
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            A modular AI and computer vision architecture bridging raw NASA microgravity telemetry to predictive spaceflight fire safety intelligence.
          </p>
        </div>

        {/* Interactive Architecture Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Layer Selector Buttons */}
          <div className="lg:col-span-5 space-y-2.5">
            {layers.map((layer, idx) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all text-xs font-mono flex items-center justify-between ${
                  activeLayer === idx
                    ? 'bg-card-solid border-cyan-500/50 text-title shadow-sm'
                    : 'bg-surface-elevated border-theme-subtle text-muted hover:text-title hover:bg-surface'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeLayer === idx ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                    <span className="font-semibold text-title">{layer.name}</span>
                  </div>
                  <div className="text-xs text-muted pl-4">{layer.category}</div>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${activeLayer === idx ? 'text-accent translate-x-1' : 'text-muted'}`} />
              </button>
            ))}
          </div>

          {/* Right: Layer Deep Dive Details */}
          <div className="lg:col-span-7 bg-card-theme border border-theme rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
              <div>
                <span className="text-xs font-mono text-accent uppercase tracking-wider block mb-1">
                  {current.category}
                </span>
                <h3 className="text-xl font-bold text-title">{current.name}</h3>
              </div>
              <span className="text-xs font-mono bg-surface text-muted px-2.5 py-1 rounded border border-theme">
                ACTIVE PIPELINE
              </span>
            </div>

            <p className="text-sm text-body leading-relaxed">
              <RichText text={current.description} />
            </p>

            {/* Core Subsystems */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                Integrated Subsystems & Capabilities
              </span>
              <ul className="space-y-2">
                {current.subsystems.map((sub, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-body">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><RichText text={sub} /></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technology Tags (Unboxed with · separator) */}
            <div className="pt-4 border-t border-theme-subtle">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-2">
                Primary Technology Stack:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-accent">
                {current.techStack.map((tech, i) => (
                  <React.Fragment key={tech}>
                    <span className="bg-surface px-2.5 py-1 rounded border border-theme text-title">
                      <RichText text={tech} />
                    </span>
                    {i < current.techStack.length - 1 && <span className="text-muted">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

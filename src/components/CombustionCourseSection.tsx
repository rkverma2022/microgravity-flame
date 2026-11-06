'use client';

import { RichText } from './RichText';
import { sciTex } from '@/lib/mathText';
import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calculator,
  Atom,
  Flame,
  Radio,
  Zap,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Sliders
} from 'lucide-react';
import { MathView } from './MathView';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CourseModule {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  discipline: 'Mathematics' | 'Physics' | 'Chemistry' | 'Spectroscopy' | 'Plasma Physics';
  readTime: string;
  summary: string;
  objectives: string[];
  keyFormulas: { name: string; formula: string; explanation: string }[];
  deepDiveContent: string[];
  nasaConnection: string;
  quiz: QuizQuestion;
}

export const CombustionCourseSection: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-physics');
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Interactive Sandbox states
  // Module 1: Grashof number calculator
  const [simGravityG0, setSimGravityG0] = useState<number>(0.0001); // in g0 (10^-4)
  const [simFlameDeltaT, setSimFlameDeltaT] = useState<number>(1400); // K

  // Module 4: EM Spectrum wavelength selector
  const [selectedWavelengthNm, setSelectedWavelengthNm] = useState<number>(431); // 431nm = CH*

  const modules: CourseModule[] = [
    {
      id: 'mod-math',
      number: '01',
      title: 'Mathematics of Transport & Fluid Mechanics',
      icon: Calculator,
      discipline: 'Mathematics',
      readTime: '18 min',
      summary:
        'Master the differential field equations, vector Laplacian operators, and dimensionless scaling numbers that govern the transition from convective buoyancy to pure molecular diffusion.',
      objectives: [
        'Derive Fick’s Second Law with chemical source terms in spherical coordinates.',
        'Understand the Grashof (Gr), Rayleigh (Ra), and Lewis (Le) dimensionless numbers.',
        'Solve the 1D steady-state spherical species diffusion boundary value problem.',
      ],
      keyFormulas: [
        {
          name: 'Grashof Number (Buoyancy Suppression)',
          formula: 'Gr = \\frac{g \\beta (T_f - T_\\infty) L^3}{\\nu^2}',
          explanation:
            'Quantifies the ratio of buoyant natural convection to viscous damping forces. When effective gravity g drops from 9.81 m/s² on Earth to 10⁻⁴ m/s² in freefall, Gr collapses from >10⁶ to near 0, completely suppressing buoyant chimneys.',
        },
        {
          name: 'Lewis Number (Oscillation Instability)',
          formula: 'Le = \\frac{\\alpha}{D_{AB}} = \\frac{k}{\\rho c_p D_{AB}}',
          explanation:
            'Ratio of thermal diffusivity (α) to mass species diffusivity (D_AB). For Le > 1 fuels in microgravity, thermal heat diffuses away faster than fuel mass diffuses into the flame, causing cellular flame splitting and the 0.2s breathing oscillation seen in SoFIE RTDFS.',
        },
        {
          name: 'Species Diffusion Equation (Fickian Diffusion)',
          formula: '\\frac{\\partial Y_i}{\\partial t} = D_{AB} \\nabla^2 Y_i + \\frac{\\dot{\\omega}_i}{\\rho}',
          explanation:
            'In spherical symmetry ($\\nabla^{2} = \\frac{1}{r^{2}}\\frac{\\partial}{\\partial r}\\left(r^{2}\\frac{\\partial}{\\partial r}\\right)$), oxygen replenishment is governed entirely by radial molecular diffusion gradients rather than convective draft.',
        },
      ],
      deepDiveContent: [
        'On Earth, combustion is intensely convective. Buoyant hot gases rise at velocities between 1 to 3 m/s, continuously sucking ambient air inward around the flame base. Mathematically, this couples the Navier-Stokes momentum equations directly with the energy conservation equation through the Boussinesq buoyant term $(\\rho_\\infty - \\rho)\\,\\mathbf{g}$.',
        'In orbital freefall aboard the International Space Station, the centrifugal acceleration of orbital velocity cancels the gravitational force: the net apparent acceleration is microgravity (10⁻⁶ to 10⁻⁴ g₀). When g → 0, the buoyant source term in the momentum equation vanishes identically.',
        'Without the convective velocity vector ($u_{\\text{conv}} = 0$), the Peclet number ($Pe = uL/D$) approaches zero. The governing differential system simplifies from turbulent advection-diffusion to clean, spherically symmetric elliptic diffusion equations.',
      ],
      nasaConnection: 'Applied in the Burning Rate Emulator (BRE) and SoFIE GEL insert aboard the ISS CIR.',
      quiz: {
        question: 'What happens to the Grashof number (Gr) when a flame enters freefall aboard the ISS?',
        options: [
          'It increases exponentially due to lack of air friction.',
          'It collapses toward zero because the effective gravitational acceleration (g) is suppressed.',
          'It remains constant at 1.0 because viscosity compensates for gravity.',
          'It becomes negative, reversing the direction of buoyancy.',
        ],
        correctIndex: 1,
        explanation:
          'Because $Gr = g\\beta\\Delta T L^{3}/\\nu^{2}$, when effective gravity g drops to $\\sim 10^{-5}\\,g_0$, the numerator approaches zero, reducing buoyant force to near zero.',
      },
    },
    {
      id: 'mod-physics',
      number: '02',
      title: 'Physics of Freefall, Buoyancy & Thermal Radiative Loss',
      icon: Atom,
      discipline: 'Physics',
      readTime: '22 min',
      summary:
        'Explore the Einstein Equivalence Principle in low Earth orbit, why candle flames form ghostly blue spheres, and how Stefan-Boltzmann radiative cooling causes sudden flame extinction in zero-g.',
      objectives: [
        'Contrast 1g buoyant upward flame geometry with 0g spherical flame architecture.',
        'Calculate Stefan-Boltzmann radiative heat loss fractions in microgravity.',
        'Explain radiative extinction and flammability boundaries in closed space habitats.',
      ],
      keyFormulas: [
        {
          name: 'Stefan-Boltzmann Radiative Cooling Flux',
          formula: '\\dot{q}_{\\text{rad}} = 4 \\sigma a_p (T_f^4 - T_\\infty^4)',
          explanation:
            'Where $\\sigma = 5.67\\times10^{-8}\\ \\mathrm{W/(m^{2}\\cdot K^{4})}$ and a_p is the Planck mean absorption coefficient. Without convective heat replenishment, radiative losses scale with T⁴ and trigger sudden radiative extinction.',
        },
        {
          name: 'Einstein Equivalence & Apparent Gravity',
          formula: 'g_{\\text{eff}} = g_{\\text{grav}} - a_{\\text{orbital}} \\approx 0',
          explanation:
            'Orbiting at 28,000 km/h, the ISS is in perpetual freefall around Earth. The gravitational acceleration is balanced by centripetal acceleration, creating sustained weightlessness for combustion.',
        },
        {
          name: 'Buoyant Convective Velocity Scale',
          formula: 'u_{\\text{buoyant}} \\approx \\sqrt{\\frac{2 g L (T_f - T_\\infty)}{T_\\infty}}',
          explanation:
            'On Earth, buoyant draft generates upward velocities of 1.5–2.5 m/s. In microgravity, u_buoyant = 0, leaving flames entirely reliant on quiescent molecular diffusion.',
        },
      ],
      deepDiveContent: [
        'Why does a candle flame on Earth take the shape of a teardrop? As fuel burns, combustion products heat up and become less dense than surrounding cold air. Cold air rushes underneath, while hot gases shoot upward. This buoyant chimney elongates the flame and drags incandescent soot particles into a bright yellow plume.',
        'In space, hot air does not rise because without a gravity gradient, there is no weight difference between hot and cold molecules. The reaction products diffuse uniformly outward in all directions, forming a perfectly symmetrical, ghostly blue sphere.',
        'Radiative Extinction Limit: On Earth, the fresh updraft constantly delivers fresh fuel and oxygen, keeping the reaction zone hot. In microgravity, heat slowly radiates away in all directions through infrared radiation from CO₂ and H₂O molecules. If the rate of heat loss exceeds the chemical energy release rate, the flame suddenly and silently extinguishes—a phenomenon known as radiative quenching.',
      ],
      nasaConnection: 'Studied in the Saffire series aboard Cygnus cargo vehicles and BASS in the MSG.',
      quiz: {
        question: 'Why does a candle flame in microgravity burn as a sphere rather than a teardrop?',
        options: [
          'Because spacecraft cabin air is pressurized higher than Earth atmosphere.',
          'Because surface tension pulls the flame into a spherical liquid bubble.',
          'Because the absence of gravity eliminates buoyant convective updrafts, allowing oxygen to diffuse symmetrically in all directions.',
          'Because the electric fields in the ISS force ions into a spherical lattice.',
        ],
        correctIndex: 2,
        explanation:
          'Without gravity, hot gases do not rise. Mass and heat diffuse isotropically in 3D, creating a symmetrical spherical reaction shell.',
      },
    },
    {
      id: 'mod-chemistry',
      number: '03',
      title: 'Combustion Chemistry, Radicals & Cool Flames',
      icon: Flame,
      discipline: 'Chemistry',
      readTime: '25 min',
      summary:
        'Unpack elementary radical chain branching, polymer pyrolysis, soot agglomeration suppression, and the historic discovery of low-temperature "cool flames" in NASA FLEX experiments.',
      objectives: [
        'Analyze the $\\mathrm{H + O_2 \\rightleftharpoons OH + O}$ chain branching mechanism and ignition limits.',
        'Explain how the absence of buoyant soot yields clean blue sootless chemiluminescence.',
        'Understand low-temperature cool flame oxidation chemistry (600 K–800 K) in droplet combustion.',
      ],
      keyFormulas: [
        {
          name: 'Chain Branching Rate Limiting Step',
          formula: '\\text{H} + \\text{O}_2 \\rightleftharpoons \\text{OH} + \\text{O} \\quad (E_a \\approx 70\\text{ kJ/mol})',
          explanation:
            'The primary high-temperature branching reaction that doubles the active radical pool. In microgravity, lower peak temperatures can suppress this reaction and shift combustion to cool flame pathways.',
        },
        {
          name: 'Cool Flame Alkylperoxy Isomerization',
          formula: '\\text{R}^\\bullet + \\text{O}_2 \\rightleftharpoons \\text{RO}_2^\\bullet \\rightleftharpoons \\text{}^\\bullet\\text{QOOH} \\to \\text{Ketohydroperoxides}',
          explanation:
            'Discovered in NASA FLEX and CFI experiments: after visible flame extinction, fuel droplets continue burning invisibly at 600–800 K supported by intermediate peroxide chemistry without high-temperature radical branching.',
        },
        {
          name: 'Soot Formation Precursor Inception',
          formula: '\\text{C}_2\\text{H}_2 + \\text{C}_3\\text{H}_3 \\to \\text{C}_6\\text{H}_6 \\to \\text{PAH}',
          explanation:
            'On Earth, residence time inside the hot fuel-rich buoyant core fosters massive soot growth. In microgravity quiescent diffusion, fuels burn near stoichiometric boundaries, suppressing soot by up to 85%.',
        },
      ],
      deepDiveContent: [
        'The discovery of "Cool Flames" aboard the ISS is one of the most celebrated physical science breakthroughs in modern spaceflight. In the Flame Extinguishment Experiment (FLEX), scientists burned liquid heptane droplets. When the visible spherical yellow/blue flame extinguished, researchers expected the drop to cool down. Instead, the droplet continued shrinking and vaporizing invisibly!',
        'Chemical diagnostics revealed that the droplet was burning in a low-temperature combustion mode (600 K–800 K) without soot and without visible light. In this regime, hydrocarbon chemistry produces intermediate formaldehyde and ketohydroperoxides rather than CO₂ and water.',
        'Space Fire Safety Consequence: Cool flames present a silent hazard for astronauts. A fire can appear extinguished to optical cameras while remaining chemically active, capable of reigniting into a vigorous high-temperature flame if forced ventilation is reintroduced.',
      ],
      nasaConnection: 'Discovered in FLEX and FLEX-2 in the Multi-user Droplet Combustion Apparatus (MDCA).',
      quiz: {
        question: 'What is a "cool flame" as discovered during NASA’s FLEX droplet experiments?',
        options: [
          'A flame cooled down using liquid nitrogen extinguishers.',
          'An invisible combustion regime burning at 600 K–800 K supported by low-temperature peroxide chemistry after visible flameout.',
          'A flame that absorbs heat from the spacecraft hull rather than releasing it.',
          'A computer simulation of a flame run on the astronaut laptops.',
        ],
        correctIndex: 1,
        explanation:
          'Cool flames burn invisibly at 600 K to 800 K via low-temperature chemical reaction pathways without producing the incandescent soot or visible light of normal fire.',
      },
    },
    {
      id: 'mod-spectroscopy',
      number: '04',
      title: 'Electromagnetic Spectrum & Optical Diagnostics',
      icon: Radio,
      discipline: 'Spectroscopy',
      readTime: '20 min',
      summary:
        'Decode the photonic signatures of flames: CH* and C₂* visible chemiluminescence, Planck blackbody infrared continuum, and UV OH* radical transitions used in spaceflight pyrometry.',
      objectives: [
        'Identify specific molecular emission bands across the EM spectrum (306nm, 431nm, 516nm, 4.3µm).',
        'Apply Planck’s Law to perform two-color ratio pyrometry for non-intrusive temperature mapping.',
        'Explain why optical fire detectors must distinguish particulate smoke from lunar dust (SAME vs DAFT).',
      ],
      keyFormulas: [
        {
          name: 'Planck’s Spectral Radiance Distribution',
          formula: 'E_\\lambda(\\lambda, T) = \\frac{2\\pi h c^2}{\\lambda^5 \\left(e^{\\frac{h c}{\\lambda k_B T}} - 1\\right)}',
          explanation:
            'Governs continuum thermal radiation emitted by hot soot particles. By measuring the ratio of radiance at two distinct wavelengths, optical pyrometers extract temperature without physical thermocouples.',
        },
        {
          name: 'CH* Radical Chemiluminescence Peak',
          formula: '\\lambda_{\\text{CH}^*} = 431.4\\text{ nm} \\quad (A^2\\Delta \\to X^2\\Pi)',
          explanation:
            'The signature blue-violet emission band of hydrocarbon combustion. In microgravity, where soot is suppressed, this electronic transition dominates, giving 0g flames their iconic ethereal blue glow.',
        },
        {
          name: 'CO₂ Infrared Asymmetric Stretch Band',
          formula: '\\lambda_{\\text{CO}_2} = 4.26\\,\\mu\\text{m} \\quad (\\nu_3\\text{ fundamental vibrational band})',
          explanation:
            'Strong mid-infrared emission band used by spacecraft fire sensors to track combustion gas accumulation through spacecraft ventilation filters.',
        },
      ],
      deepDiveContent: [
        'Flames emit light across three distinct regimes of the electromagnetic spectrum: ultraviolet (UV), visible, and infrared (IR). Each regime reveals a different fundamental aspect of combustion physics.',
        'In the UV spectrum (306.4 nm), excited hydroxyl radicals (OH*) emit as they transition back to ground state, tracing the narrow chemical reaction zone where heat release occurs.',
        'In the visible spectrum, microgravity flames emit strong chemiluminescent bands from CH* (431 nm, blue) and C₂* Swan bands (516 nm, green). On Earth, these faint blue bands are completely washed out by the blinding yellow thermal blackbody continuum from incandescent soot particles (1800 K).',
        'In the infrared spectrum, gases (CO₂ at 4.3 µm, H₂O at 2.7 µm) and warm soot radiate energy outward. The Smoke and Aerosol Measurement Experiment (SAME) and DAFT used optical light-scattering across multi-wavelength lasers to size microgravity smoke agglomerates and distinguish them from abrasive lunar regolith dust.',
      ],
      nasaConnection: 'Used in CIR optical cameras, Saffire radiometers, and SAME/DAFT particle spectrometers.',
      quiz: {
        question: 'Which molecular emission causes the distinct ethereal blue color of microgravity flames?',
        options: [
          'Infrared carbon dioxide radiation at 4.3 µm.',
          'Incandescent soot particles emitting blackbody radiation at 2000 K.',
          'CH* radical chemiluminescence transitioning at 431.4 nm in the blue-violet band.',
          'Radio frequency emissions from spacecraft communications.',
        ],
        correctIndex: 2,
        explanation:
          'When hydrocarbon radicals react, excited CH* molecules relax from A²Δ to X²Π state, emitting blue light at 431.4 nm. In microgravity, the lack of yellow soot allows this blue glow to dominate.',
      },
    },
    {
      id: 'mod-plasma',
      number: '05',
      title: 'Electrostatic Coupling, Chemi-Ions & Plasma Thrusters',
      icon: Zap,
      discipline: 'Plasma Physics',
      readTime: '20 min',
      summary:
        'Bridge chemical flames with electric space propulsion: analyze chemi-ionization, how electric fields (ACME E-FIELD) mimic partial gravity, and electrostatic energy transfer mechanisms.',
      objectives: [
        'Understand chemi-ionization mechanisms producing H₃O⁺, CHO⁺, and free electrons.',
        'Explain how electrostatic body forces (E-FIELD) generate an artificial "ionic wind".',
        'Connect flame ion dynamics to Hall-effect and gridded ion plasma thrusters.',
      ],
      keyFormulas: [
        {
          name: 'Chemi-Ionization Reaction in Flames',
          formula: '\\text{CH} + \\text{O} \\to \\text{CHO}^+ + e^- \\quad (\\Delta H \\approx -70\\text{ kJ/mol})',
          explanation:
            'The primary natural ionization reaction in hydrocarbon flames, creating positive ions and electrons without requiring extreme plasma temperatures.',
        },
        {
          name: 'Electrostatic Body Force (Ionic Wind)',
          formula: '\\mathbf{F}_{\\text{elec}} = \\rho_q \\mathbf{E} = (n_i - n_e) e \\mathbf{E}',
          explanation:
            'When an external electric field E is applied across a flame, it exerts a force on the chemi-ions. As positive ions drift toward the cathode, momentum transfer with neutral gas creates an "ionic wind" that alters flame shape and simulates partial gravity.',
        },
        {
          name: 'Plasma Thruster Specific Impulse Link',
          formula: 'I_{\\text{sp}} = \\frac{v_{\\text{exhaust}}}{g_0} = \\frac{1}{g_0}\\sqrt{\\frac{2 q V_{\\text{accel}}}{m_{\\text{ion}}}}',
          explanation:
            'In plasma thrusters, electrostatic fields accelerate ions to velocities >30 km/s. Understanding electric field interactions with ionized combustion gases informs next-generation magnetoplasmadynamic and hybrid propulsion.',
        },
      ],
      deepDiveContent: [
        'Flames are not just hot neutral gases—they are weakly ionized plasmas containing millions of ions and electrons per cubic millimeter. The collision between hydrocarbon radicals (CH + O) produces CHO⁺ and free electrons, which rapidly convert to hydronium ions (H₃O⁺).',
        'In the ACME E-FIELD Flames experiment aboard the ISS, NASA scientists applied high voltages (up to 10 kV) across microgravity flames. Because buoyancy was absent, they could cleanly observe how electrostatic fields pull and push the flame envelope.',
        'This proved that an electric field can act as an "artificial gravity switch", deflecting flames, stripping away soot, or even extinguishing fires electrically without releasing chemical extinguishants into crew breathing air—while unlocking valuable insights for electric plasma propulsion.',
      ],
      nasaConnection: 'Directly investigated in the ACME E-FIELD experiment aboard the ISS CIR.',
      quiz: {
        question: 'How did NASA’s ACME E-FIELD experiment simulate the effect of gravity on a microgravity flame?',
        options: [
          'By spinning the combustion rack inside a giant centrifuge.',
          'By applying high-voltage electric fields to exert electrostatic body forces on the flame’s naturally occurring chemi-ions, generating an artificial ionic wind.',
          'By pumping heavy liquid mercury into the chamber floor.',
          'By pressurizing the chamber to 100 atmospheres.',
        ],
        correctIndex: 1,
        explanation:
          'ACME E-FIELD applied electric potentials across the flame. The resulting force on positive and negative chemi-ions generated an "ionic wind" that mimicked buoyant gas acceleration.',
      },
    },
  ];

  const currentMod = modules.find((m) => m.id === activeModuleId) || modules[0];

  // Derived Sandbox Calculations
  // Grashof Number calculation for Module 1 sandbox
  // Gr = (g_eff * beta * deltaT * L^3) / nu^2
  // For air: beta ≈ 1/T_ambient = 1/300 K = 0.00333 1/K, L = 0.02 m, nu = 1.5e-5 m^2/s
  const beta = 0.00333;
  const L = 0.02;
  const nu = 0.000015;
  const gActual = simGravityG0 * 9.81;
  const calculatedGr = (gActual * beta * simFlameDeltaT * Math.pow(L, 3)) / Math.pow(nu, 2);

  // Wavelength metadata for Module 4 EM Spectrum sandbox
  const getEmBandInfo = (wl: number) => {
    if (wl < 380) {
      return {
        band: 'Ultraviolet (UV-A / UV-B)',
        molecule: 'OH* Radical Electronic Transition (306.4 nm)',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/30',
        description: 'Emits exclusively in the primary chemical reaction zone where high-energy fuel oxidation takes place.',
      };
    }
    if (wl >= 380 && wl < 470) {
      return {
        band: 'Visible Blue / Violet',
        molecule: 'CH* Chemiluminescence (431.4 nm)',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10 border-cyan-500/30',
        description: 'Signature ethereal blue glow of microgravity flames. Indicates stoichiometric, sootless reaction envelope.',
      };
    }
    if (wl >= 470 && wl < 560) {
      return {
        band: 'Visible Green',
        molecule: 'C₂* Swan Bands (516.5 nm)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        description: 'Excited diatomic carbon radical emissions tracing fuel-rich preheat zones.',
      };
    }
    if (wl >= 560 && wl < 750) {
      return {
        band: 'Visible Yellow / Orange',
        molecule: 'Soot Thermal Blackbody Incandescence (~600–700 nm)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        description: 'Continuum thermal radiation from incandescent carbon agglomerates (hot on Earth, heavily suppressed in 0g).',
      };
    }
    return {
      band: 'Infrared (Mid-IR)',
      molecule: 'CO₂ (4.26 µm) & H₂O (2.7 µm) Vibrational Radiation',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      description: 'Major heat loss pathway in microgravity responsible for radiative extinction limits.',
    };
  };

  const currentEmInfo = getEmBandInfo(selectedWavelengthNm);

  const handleAnswerClick = (index: number) => {
    setQuizSelectedAnswer(index);
    setShowQuizResult(true);
  };

  const handleModuleChange = (modId: string) => {
    setActiveModuleId(modId);
    setQuizSelectedAnswer(null);
    setShowQuizResult(false);
  };

  return (
    <section id="course" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>FOUNDATIONAL CURRICULUM</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>MATHEMATICS · PHYSICS · CHEMISTRY · EM SPECTRUM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Microgravity Combustion Science: The Fundamental Course
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            What knowledge is required to truly understand fire where gravity vanishes? We designed this university-grade, multi-disciplinary curriculum integrating vector calculus fluid transport, thermodynamics of freefall, cool-flame radical kinetics, and photonic spectroscopy.
          </p>
        </div>

        {/* 5-Module Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-theme-subtle scrollbar-none">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModuleId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModuleChange(m.id)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-mono transition-all whitespace-nowrap shrink-0 flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-accent-subtle text-accent border-accent-subtle font-bold shadow-sm'
                    : 'bg-surface-elevated text-muted hover:text-title border-theme-subtle hover:bg-surface'
                }`}
              >
                <span className="text-[11px] opacity-60">MODULE {m.number}</span>
                <Icon className="w-3.5 h-3.5" />
                <span className="font-sans font-semibold">{m.discipline}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Learning Stage (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Module Overview Card */}
            <div className="bg-card-solid border border-theme rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                    MODULE {currentMod.number}: {currentMod.discipline.toUpperCase()}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-title">{currentMod.title}</h3>
                </div>
                <div className="text-xs font-mono text-muted bg-surface px-2.5 py-1 rounded border border-theme">
                  {currentMod.readTime}
                </div>
              </div>

              <p className="text-sm text-body leading-relaxed font-normal">
                <RichText text={currentMod.summary} />
              </p>

              {/* Objectives List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                  Core Learning Objectives:
                </span>
                <ul className="space-y-1.5">
                  {currentMod.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-body">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span><RichText text={obj} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deep Dive Narrative Paragraphs */}
              <div className="pt-4 border-t border-theme-subtle space-y-3 text-xs sm:text-sm text-body leading-relaxed font-sans">
                {currentMod.deepDiveContent.map((para, i) => (
                  <p key={i}><RichText text={para} /></p>
                ))}
              </div>

              {/* NASA Connection Kicker */}
              <div className="p-3 bg-surface border border-theme rounded text-xs font-mono text-muted flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                <span>
                  <strong className="text-title">NASA Flight Facility:</strong> <RichText text={currentMod.nasaConnection} />
                </span>
              </div>
            </div>

            {/* Key Mathematical & Theoretical Formulas */}
            <div className="bg-card-theme border border-theme rounded-lg p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Governing Mathematical & Physical Laws</span>
                </span>
                <span className="text-xs font-mono text-muted">{currentMod.discipline}</span>
              </div>

              <div className="space-y-4">
                {currentMod.keyFormulas.map((kf, i) => (
                  <div key={i} className="bg-surface p-4 rounded-lg border border-theme space-y-2">
                    <span className="text-xs font-mono uppercase text-muted block font-semibold">
                      <RichText text={kf.name} />
                    </span>
                    <div className="bg-surface-elevated p-2 rounded border border-theme overflow-x-auto text-center">
                      <MathView math={kf.formula} block={true} className="text-accent text-sm sm:text-base font-bold" />
                    </div>
                    <p className="text-xs text-body leading-relaxed font-sans">
                      <RichText text={kf.explanation} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Lab Sandbox & Knowledge Check (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Concept Sandbox */}
            <div className="bg-card-solid border border-theme rounded-lg p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Interactive Concept Sandbox</span>
                </span>
                <span className="text-[11px] font-mono text-muted uppercase">LIVE MODEL</span>
              </div>

              {/* Conditional Sandbox UI based on Module */}
              {activeModuleId === 'mod-math' || activeModuleId === 'mod-physics' ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-title font-semibold block">Grashof Number Scaling Simulation</span>
                    <p className="text-muted text-xs font-sans">
                      Observe how reducing gravity from Earth (1g) to ISS freefall (10⁻⁴g) completely eliminates buoyant convection (Gr &lt; 1).
                    </p>
                  </div>

                  {/* Gravity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Gravitational Level:</span>
                      <span className="text-accent font-bold">
                        {simGravityG0 >= 1
                          ? <RichText text={`${simGravityG0.toFixed(2)} g₀ (Earth)`} />
                          : simGravityG0 >= 0.16
                          ? <RichText text={`${simGravityG0.toFixed(3)} g₀ (Moon)`} />
                          : <RichText text={`$${sciTex(simGravityG0, 1)}\\,g_0$ (ISS Freefall)`} />}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="0"
                      step="0.1"
                      value={Math.log10(simGravityG0)}
                      onChange={(e) => setSimGravityG0(Math.pow(10, parseFloat(e.target.value)))}
                      className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-muted">
                      <span><RichText text="10⁻⁴ g₀ (Freefall)" /></span>
                      <span><RichText text="0.16 g₀ (Moon)" /></span>
                      <span><RichText text="1.0 g₀ (Earth)" /></span>
                    </div>
                  </div>

                  {/* Flame Temp Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted"><RichText text="Flame Temperature $\Delta T$:" /></span>
                      <span className="text-title font-bold">{simFlameDeltaT} K</span>
                    </div>
                    <input
                      type="range"
                      min="600"
                      max="2200"
                      step="50"
                      value={simFlameDeltaT}
                      onChange={(e) => setSimFlameDeltaT(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded cursor-pointer"
                    />
                  </div>

                  {/* Computed Grashof Result */}
                  <div className="p-3.5 bg-surface rounded-lg border border-theme space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-muted text-xs">CALCULATED GRASHOF NUMBER:</span>
                      <span className="text-lg font-bold text-accent tabular-nums">
                        <RichText text={`$Gr \\approx ${calculatedGr > 1000 ? sciTex(calculatedGr, 2) : calculatedGr.toFixed(2)}$`} />
                      </span>
                    </div>
                    <div className="text-xs text-body font-sans">
                      {calculatedGr < 1 ? (
                        <span className="text-emerald-500 font-semibold">
                          ✓ Pure Microgravity Regime (Gr &lt; 1): Buoyancy is fully extinguished. Symmetrical spherical diffusion dominates.
                        </span>
                      ) : calculatedGr < 1000 ? (
                        <span className="text-amber-500 font-semibold">
                          ▲ Weak Buoyancy Transition (Moon/Mars): Unstable chimney dynamics; flame flickers intermittently.
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold">
                          ✖ Buoyancy Dominated (Earth 1g): Strong convective upward velocity creating teardrop flame plume.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeModuleId === 'mod-spectroscopy' ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-title font-semibold block">Electromagnetic Spectrum Diagnostic Probe</span>
                    <p className="text-muted text-xs font-sans">
                      Scrub across wavelengths from UV (300nm) to Mid-IR (4500nm) to reveal the quantum electronic transitions and soot blackbody continuum of space flames.
                    </p>
                  </div>

                  {/* Wavelength Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Probed Wavelength:</span>
                      <span className="text-accent font-bold">{selectedWavelengthNm} nm (<RichText text={selectedWavelengthNm >= 1000 ? `${(selectedWavelengthNm / 1000).toFixed(2)} µm` : `${selectedWavelengthNm} nm`} />)</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="4500"
                      step="20"
                      value={selectedWavelengthNm}
                      onChange={(e) => setSelectedWavelengthNm(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500 h-2 bg-surface-elevated rounded cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-muted">
                      <span><RichText text="300 nm (UV OH*)" /></span>
                      <span><RichText text="431 nm (CH* Blue)" /></span>
                      <span><RichText text="516 nm (C₂*)" /></span>
                      <span><RichText text="4.3 µm (CO₂ IR)" /></span>
                    </div>
                  </div>

                  {/* Emitted Species Card */}
                  <div className={`p-4 rounded-lg border ${currentEmInfo.bg} space-y-1.5`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold tracking-wider uppercase ${currentEmInfo.color}`}>
                        {currentEmInfo.band}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-title"><RichText text={currentEmInfo.molecule} /></div>
                    <p className="text-xs text-body leading-relaxed font-sans">
                      {currentEmInfo.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-mono">
                  <span className="text-title font-semibold block">Module Focus & Lab Exercise</span>
                  <div className="p-4 bg-surface rounded-lg border border-theme space-y-2 text-body font-sans leading-relaxed">
                    <p>
                      <strong>Laboratory Exercise:</strong> Examine how radical concentration gradients and electrostatic potentials govern reaction zone thickness. In the interactive <strong>CV Flame Lab</strong> below, you can inspect real pixel chemiluminescence ratios from NASA CIR high-speed footage.
                    </p>
                    <a
                      href="#cv-lab"
                      className="inline-flex items-center gap-1.5 text-accent hover:text-cyan-600 font-mono text-xs font-semibold"
                    >
                      <span>Jump to Interactive CV Lab</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Module Knowledge Check / Quiz */}
            <div className="bg-card-theme border border-theme rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Module {currentMod.number} Knowledge Check</span>
                </span>
                <span className="text-[11px] font-mono text-muted">1 QUESTION</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-title leading-snug">
                  <RichText text={currentMod.quiz.question} />
                </p>

                <div className="space-y-2">
                  {currentMod.quiz.options.map((opt, i) => {
                    const isSelected = quizSelectedAnswer === i;
                    const isCorrect = i === currentMod.quiz.correctIndex;

                    let btnStyle = 'bg-surface border-theme text-body hover:text-title hover:bg-surface-elevated';
                    if (showQuizResult) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-500';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerClick(i)}
                        className={`w-full text-left p-3 rounded-md border text-xs font-sans transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="font-mono text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span><RichText text={opt} /></span>
                      </button>
                    );
                  })}
                </div>

                {showQuizResult && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs font-sans leading-relaxed ${
                      quizSelectedAnswer === currentMod.quiz.correctIndex
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    }`}
                  >
                    <div className="font-bold font-mono text-xs uppercase mb-1">
                      {quizSelectedAnswer === currentMod.quiz.correctIndex ? '✓ Correct Answer!' : 'Explanation:'}
                    </div>
                    <div><RichText text={currentMod.quiz.explanation} /></div>
                  </div>
                )}
              </div>
            </div>

            {/* Authoritative NASA & Scientific Resources */}
            <div className="bg-surface border border-theme rounded-lg p-5 space-y-3 text-xs shadow-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold block border-b border-theme-subtle pb-2">
                Recommended Scientific Readings
              </span>
              <ul className="space-y-2 text-body">
                <li>
                  <a
                    href="https://www.nasa.gov/centers-and-facilities/glenn/studying-flame-behavior-in-microgravity-with-a-solid-high-five/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent flex items-center justify-between group"
                  >
                    <span className="group-hover:underline">NASA Glenn: Studying Flame Behavior in Microgravity</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-accent" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://science.nasa.gov/biological-physical/resources/explainers-infographics/why-nasa-is-studying-flames-in-space/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent flex items-center justify-between group"
                  >
                    <span className="group-hover:underline">NASA BPS Explainer: Why NASA Studies Flames in Space</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-accent" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://bigthink.com/hard-science/fire-in-space/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent flex items-center justify-between group"
                  >
                    <span className="group-hover:underline">Big Think: The Strange Physics of Fire in Space</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-accent" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

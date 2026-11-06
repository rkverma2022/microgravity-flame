'use client';

import { RichText } from './RichText';
import React, { useState } from 'react';
import {
  Sigma,
  Flame,
  Orbit,
  Sparkles,
  Wind,
  Thermometer,
  Zap,
  Search,
  Filter,
  Check,
  Copy,
  BookOpen,
} from 'lucide-react';
import { MathView } from './MathView';

interface EquationItem {
  id: string;
  name: string;
  category: 'Microgravity Buoyancy' | 'Droplet Kinetics' | 'Flame Temperature' | 'Spectroscopy & Color' | 'Particle Dynamics' | 'Spread & Safety';
  latex: string;
  variableDefs: { symbol: string; meaning: string }[];
  physicalMeaning: string;
  microgravityRelevance: string;
  tags: string[];
}

export const CombustionEquationsCompendium: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Microgravity Buoyancy',
    'Droplet Kinetics',
    'Flame Temperature',
    'Spectroscopy & Color',
    'Particle Dynamics',
    'Spread & Safety',
  ];

  const equations: EquationItem[] = [
    // 1. Grashof Number
    {
      id: 'eq-grashof',
      name: 'Grashof Number (Buoyancy Suppression)',
      category: 'Microgravity Buoyancy',
      latex: 'Gr = \\frac{g \\beta (T_f - T_\\infty) L^3}{\\nu^2}',
      variableDefs: [
        { symbol: 'g', meaning: 'Gravitational acceleration (m/s²)' },
        { symbol: '\\beta', meaning: 'Volumetric thermal expansion coefficient (1/T_∞, K⁻¹)' },
        { symbol: 'T_f - T_\\infty', meaning: 'Temperature difference between flame zone and ambient gas (K)' },
        { symbol: 'L', meaning: 'Characteristic physical flame length scale (m)' },
        { symbol: '\\nu', meaning: 'Kinematic viscosity of the ambient gas (m²/s)' },
      ],
      physicalMeaning:
        'Ratio of buoyant natural convective forces to viscous resisting forces in a fluid boundary layer.',
      microgravityRelevance:
        'In microgravity on the ISS (g ≈ 10⁻⁶ g₀), Gr → 0. This completely eliminates buoyant acceleration, preventing hot gases from rising and turning flickering teardrop flames into steady, quiescent spherical envelopes.',
      tags: ['Grashof', 'Buoyancy', 'Zero-G', 'Dimensionless'],
    },

    // 2. Rayleigh Number
    {
      id: 'eq-rayleigh',
      name: 'Rayleigh Number (Turbulence & Chimney Effect)',
      category: 'Microgravity Buoyancy',
      latex: 'Ra = Gr \\cdot Pr = \\frac{g \\beta (T_f - T_\\infty) L^3}{\\nu \\alpha}',
      variableDefs: [
        { symbol: 'Gr', meaning: 'Grashof number (buoyancy vs viscosity)' },
        { symbol: 'Pr', meaning: 'Prandtl number (momentum vs thermal diffusivity, ν/α)' },
        { symbol: '\\alpha', meaning: 'Thermal diffusivity (k / (ρ c_p), m²/s)' },
      ],
      physicalMeaning:
        'Determines whether heat transfer is governed by conduction (Ra < 10³) or turbulent natural convection (Ra > 10⁶).',
      microgravityRelevance:
        'Terrestrial candle flames operate at Ra ≈ 10⁴ - 10⁶, producing a vigorous vertical chimney flow. In orbital freefall, Ra collapses below 10⁻², placing the entire flame in the pure thermal conduction and molecular diffusion regime.',
      tags: ['Rayleigh', 'Prandtl', 'Thermal Diffusion'],
    },

    // 3. Navier-Stokes Momentum (Boussinesq Equation)
    {
      id: 'eq-navier-stokes',
      name: 'Navier-Stokes Momentum with Boussinesq Buoyancy',
      category: 'Microgravity Buoyancy',
      latex: '\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + (\\rho - \\rho_\\infty)\\mathbf{g}',
      variableDefs: [
        { symbol: '\\mathbf{u}', meaning: 'Fluid velocity vector (m/s)' },
        { symbol: 'p', meaning: 'Static thermodynamic pressure field (Pa)' },
        { symbol: '\\mu', meaning: 'Dynamic shear viscosity (Pa·s)' },
        { symbol: '(\\rho - \\rho_\\infty)\\mathbf{g}', meaning: 'Boussinesq gravitational buoyancy body force term (N/m³)' },
      ],
      physicalMeaning:
        'Governs fluid velocity and momentum transport driven by pressure gradients, shear stress, and gravity.',
      microgravityRelevance:
        'When g = 0, the body force vector $(\\rho - \\rho_\\infty)\\,\\mathbf{g}$ vanishes. Fluid motion is no longer induced by density differences, reducing the equations to pure creeping Stokes flow or forced convective duct flow.',
      tags: ['Navier-Stokes', 'Momentum', 'Boussinesq'],
    },

    // 4. Species Mass Conservation (Fickian Diffusion)
    {
      id: 'eq-species-diffusion',
      name: 'Species Conservation with Fickian Diffusion',
      category: 'Microgravity Buoyancy',
      latex: '\\rho \\frac{\\partial Y_i}{\\partial t} + \\rho (\\mathbf{u} \\cdot \\nabla) Y_i = \\nabla \\cdot (\\rho D_i \\nabla Y_i) + \\dot{\\omega}_i',
      variableDefs: [
        { symbol: 'Y_i', meaning: 'Mass fraction of chemical species i (fuel, O₂, CO₂, H₂O, radicals)' },
        { symbol: 'D_i', meaning: 'Fickian binary mass diffusion coefficient of species i into mixture (m²/s)' },
        { symbol: '\\dot{\\omega}_i', meaning: 'Net chemical production or consumption rate (kg/(m³·s))' },
      ],
      physicalMeaning:
        'Mass conservation tracking the transport, diffusion, and reaction kinetics of reactants and products.',
      microgravityRelevance:
        'With u ≈ 0 in quiescent space chambers, advection vanishes. Oxygen supply to the flame sheet is strictly governed by Fickian diffusion $\\nabla\\cdot(\\rho D_i \\nabla Y_i)$, making diffusion the sole rate-limiting mechanism.',
      tags: ['Diffusion', 'Fickian', 'Mass Transfer', 'Species'],
    },

    // 5. Lewis Number
    {
      id: 'eq-lewis',
      name: 'Lewis Number (Preferential Radical Diffusion)',
      category: 'Microgravity Buoyancy',
      latex: 'Le_i = \\frac{\\alpha}{D_i} = \\frac{k}{\\rho c_p D_i}',
      variableDefs: [
        { symbol: '\\alpha', meaning: 'Thermal diffusivity of the gas mixture (m²/s)' },
        { symbol: 'D_i', meaning: 'Mass diffusivity of species i (e.g., H₂, H, O₂, hydrocarbon, m²/s)' },
        { symbol: 'k', meaning: 'Thermal conductivity (W/(m·K))' },
        { symbol: 'c_p', meaning: 'Specific heat capacity at constant pressure (J/(kg·K))' },
      ],
      physicalMeaning:
        'Compares rate of thermal energy transport to molecular mass diffusion.',
      microgravityRelevance:
        'When Le < 1 (such as light H₂ or H radicals diffusing faster than heat diffuses away), cellular instabilities form stable, isolated "flame balls" in microgravity that burn indefinitely on trace fuel concentrations.',
      tags: ['Lewis Number', 'Flame Balls', 'Thermal Diffusivity'],
    },

    // 6. Droplet Combustion d²-Law
    {
      id: 'eq-d2-law',
      name: 'Droplet Burning d²-Law (Quiescent Evaporation)',
      category: 'Droplet Kinetics',
      latex: 'd^2(t) = d_0^2 - K t',
      variableDefs: [
        { symbol: 'd(t)', meaning: 'Instantaneous liquid droplet diameter at time t (m)' },
        { symbol: 'd_0', meaning: 'Initial droplet diameter at ignition (m)' },
        { symbol: 'K', meaning: 'Combustion / burning rate constant (m²/s or mm²/s)' },
        { symbol: 't', meaning: 'Elapsed burning duration (s)' },
      ],
      physicalMeaning:
        'Discovered by Godsave and Spalding: the square of droplet diameter decreases linearly with time during quasi-steady combustion.',
      microgravityRelevance:
        'On Earth, droplets drip, sag, and detach under gravity. In the NASA FLEX and MDCA investigations, droplets remain perfectly spherical and concentric with their flame envelope, proving the idealized d²-law holds with extreme mathematical precision.',
      tags: ['Droplet', 'd2-Law', 'FLEX', 'MDCA'],
    },

    // 7. Burning Rate Constant & Spalding B-Number
    {
      id: 'eq-burning-rate-k',
      name: 'Burning Rate Constant & Spalding Transfer Number',
      category: 'Droplet Kinetics',
      latex: 'K = \\frac{8 k_g}{\\rho_l c_{p,g}} \\ln(1 + B), \\quad B = \\frac{c_{p,g}(T_\\infty - T_b) + \\Delta h_c \\frac{Y_{O_2,\\infty}}{\\nu_{O_2}}}{L_v}',
      variableDefs: [
        { symbol: 'k_g, c_{p,g}', meaning: 'Thermal conductivity and specific heat of ambient vapor gas' },
        { symbol: '\\rho_l', meaning: 'Liquid fuel density (kg/m³)' },
        { symbol: 'B', meaning: 'Spalding mass transfer number (dimensionless driving force for evaporation)' },
        { symbol: '\\Delta h_c', meaning: 'Heat of combustion per unit mass of fuel (J/kg)' },
        { symbol: 'L_v', meaning: 'Latent heat of vaporization of the liquid fuel (J/kg)' },
      ],
      physicalMeaning:
        'Relates the thermodynamic driving force for phase change and flame heat feedback to droplet consumption speed.',
      microgravityRelevance:
        'Determines fuel lifetime and reveals the transition to low-temperature cool flame burning where B decreases abruptly once the hot flame quenches.',
      tags: ['Spalding', 'Evaporation', 'Latent Heat'],
    },

    // 8. Spherical Flame Standoff Ratio
    {
      id: 'eq-flame-standoff',
      name: 'Spherical Flame Standoff Ratio',
      category: 'Droplet Kinetics',
      latex: '\\frac{r_f}{r_s} = \\frac{\\ln(1 + B)}{\\ln\\left(1 + \\frac{\\nu_{O_2} Y_{F,s}}{Y_{O_2,\\infty}}\\right)}',
      variableDefs: [
        { symbol: 'r_f', meaning: 'Radius of the spherical flame reaction sheet (m)' },
        { symbol: 'r_s', meaning: 'Radius of the liquid droplet surface (m)' },
        { symbol: 'Y_{O_2,\\infty}', meaning: 'Ambient oxidizer mass fraction (e.g., 0.21 on Earth, 0.34 in Lunar base)' },
        { symbol: '\\nu_{O_2}', meaning: 'Stoichiometric mass ratio of oxygen to fuel' },
      ],
      physicalMeaning:
        'Calculates the radial standoff distance of the flame sheet from the liquid fuel droplet core.',
      microgravityRelevance:
        'In microgravity, r_f/r_s is significantly larger than in 1g (up to 15-20× droplet radius). The wide standoff allows substantial radiative heat loss from the large combustion volume, enabling radiative extinction.',
      tags: ['Standoff', 'Spherical Flame', 'Flame Sheet'],
    },

    // 9. Adiabatic Flame Temperature
    {
      id: 'eq-adiabatic-temp',
      name: 'Adiabatic Flame Temperature (1st Law Thermochemistry)',
      category: 'Flame Temperature',
      latex: 'T_{\\text{ad}} = T_0 + \\frac{-\\Delta H_c^\\circ(T_0)}{\\sum_i Y_{p,i} \\bar{c}_{p,i}}',
      variableDefs: [
        { symbol: 'T_{\\text{ad}}', meaning: 'Theoretical maximum flame temperature with zero heat loss (K)' },
        { symbol: 'T_0', meaning: 'Initial unburned reactant temperature (usually 298.15 K)' },
        { symbol: '\\Delta H_c^\\circ', meaning: 'Standard enthalpy of combustion (J/mol or J/kg)' },
        { symbol: 'Y_{p,i}, \\bar{c}_{p,i}', meaning: 'Mass fraction and mean specific heat of product species i' },
      ],
      physicalMeaning:
        'The absolute thermodynamic upper limit of flame temperature under constant pressure with zero heat dissipation.',
      microgravityRelevance:
        'Real microgravity flames never reach T_ad because the absence of buoyant updrafts allows radiant energy to escape in all directions for extended residence times.',
      tags: ['Thermodynamics', 'Enthalpy', 'Adiabatic'],
    },

    // 10. Stefan-Boltzmann Radiative Cooling Equation
    {
      id: 'eq-stefan-boltzmann',
      name: 'Stefan-Boltzmann Radiative Heat Loss (Dominant in 0g)',
      category: 'Flame Temperature',
      latex: '\\dot{q}_{\\text{rad}} = \\epsilon \\sigma (T_f^4 - T_\\infty^4) + 4 \\kappa_p \\sigma T_f^4',
      variableDefs: [
        { symbol: '\\dot{q}_{\\text{rad}}', meaning: 'Volumetric radiative emission rate (W/m³ or W/m²)' },
        { symbol: '\\epsilon', meaning: 'Surface or gas emissivity (dimensionless)' },
        { symbol: '\\sigma', meaning: 'Stefan-Boltzmann constant (5.670374 \\times 10^{-8} \\text{ W}/(\\text{m}^2\\cdot\\text{K}^4))' },
        { symbol: 'T_f', meaning: 'Flame zone temperature (K)' },
        { symbol: '\\kappa_p', meaning: 'Planck mean absorption coefficient for CO₂ and H₂O gases (m⁻¹)' },
      ],
      physicalMeaning:
        'Radiative heat loss scales with the fourth power of temperature (T⁴), dominating all other dissipation modes.',
      microgravityRelevance:
        'In 1g, 80-90% of heat is convected away vertically in the plume. In 0g, with convection suppressed, radiation accounts for 40-60% of total energy loss, lowering flame core temperatures by 150-300 K.',
      tags: ['Stefan-Boltzmann', 'Radiation', 'Cooling', 'T^4'],
    },

    // 11. Actual Microgravity Flame Temperature
    {
      id: 'eq-actual-temp-chi',
      name: 'Actual Flame Temperature with Radiation Fraction χ_rad',
      category: 'Flame Temperature',
      latex: 'T_f = T_0 + \\frac{(1 - \\chi_{\\text{rad}}) \\Delta H_c^\\circ}{c_p}, \\quad \\chi_{\\text{rad}} = \\frac{\\int_V \\dot{q}_{\\text{rad}} dV}{\\dot{m}_F \\Delta H_c^\\circ}',
      variableDefs: [
        { symbol: 'T_f', meaning: 'Actual non-adiabatic steady flame temperature (K)' },
        { symbol: '\\chi_{\\text{rad}}', meaning: 'Radiative heat loss fraction (typically 0.35 - 0.50 in microgravity)' },
        { symbol: '\\dot{m}_F', meaning: 'Fuel mass consumption rate (kg/s)' },
      ],
      physicalMeaning:
        'Corrects the adiabatic temperature for continuous radiant emission from gaseous combustion products and soot.',
      microgravityRelevance:
        'Directly explains why microgravity flames are dimmer and cooler (~1400-1650 K) compared to terrestrial flames (~1800-2200 K), causing fuels to approach their flammability extinction limits.',
      tags: ['Radiative Loss', 'Flame Temperature', 'Quenching'],
    },

    // 12. Radiative Extinction Criterion
    {
      id: 'eq-radiative-extinction',
      name: 'Radiative Extinction Limit (Microgravity Quench)',
      category: 'Flame Temperature',
      latex: '\\tau_{\\text{rad}} \\le \\tau_{\\text{chem}} \\implies \\frac{\\rho c_p T_f}{4 \\kappa_p \\sigma T_f^4} \\le \\frac{1}{A \\exp\\left(-\\frac{E_a}{R_u T_f}\\right)}',
      variableDefs: [
        { symbol: '\\tau_{\\text{rad}}', meaning: 'Radiative cooling timescale (s)' },
        { symbol: '\\tau_{\\text{chem}}', meaning: 'Chemical reaction induction timescale (Arrhenius, s)' },
        { symbol: 'E_a', meaning: 'Activation energy of the global combustion reaction (J/mol)' },
        { symbol: 'R_u', meaning: 'Universal gas constant (8.314 J/(mol·K))' },
      ],
      physicalMeaning:
        'When thermal radiation siphons heat faster than chemical kinetics can release it, the flame immediately quenches.',
      microgravityRelevance:
        'On Earth, extinction is caused by strain or convective blowoff. In microgravity, flames extinguish purely due to self-radiation cooling, setting the true low-speed flammability limit in spacecraft cabins.',
      tags: ['Extinction', 'Timescale', 'Arrhenius', 'Quench'],
    },

    // 13. Planck's Law of Blackbody Radiation
    {
      id: 'eq-planck-law',
      name: "Planck's Law (Soot Incandescence Spectrum)",
      category: 'Spectroscopy & Color',
      latex: 'I(\\lambda, T) = \\frac{2 h c^2}{\\lambda^5} \\frac{1}{\\exp\\left(\\frac{h c}{\\lambda k_B T}\\right) - 1}',
      variableDefs: [
        { symbol: 'I(\\lambda, T)', meaning: 'Spectral radiance per unit wavelength (W/(m³·sr))' },
        { symbol: 'h', meaning: "Planck's constant (6.626070 \\times 10^{-34} \\text{ J}\\cdot\\text{s})" },
        { symbol: 'c', meaning: 'Speed of light in vacuum (2.997924 \\times 10^8 \\text{ m/s})' },
        { symbol: 'k_B', meaning: "Boltzmann's constant (1.380649 \\times 10^{-23} \\text{ J/K})" },
        { symbol: '\\lambda', meaning: 'Wavelength of emitted photon (m or nm)' },
      ],
      physicalMeaning:
        'Describes the spectral energy distribution emitted by a glowing blackbody or soot particle cloud at temperature T.',
      microgravityRelevance:
        'On Earth, buoyant soot clumps form a glowing yellow/orange plume. In microgravity, soot residence time and temperature are altered, shifting continuous blackbody emission heavily toward the infrared.',
      tags: ['Planck', 'Blackbody', 'Soot', 'Color'],
    },

    // 14. Wien's Displacement Law
    {
      id: 'eq-wien-law',
      name: "Wien's Displacement Law (Peak Emission Wavelength)",
      category: 'Spectroscopy & Color',
      latex: '\\lambda_{\\text{max}} = \\frac{b}{T}, \\quad b \\approx 2897.77\\,\\mu\\text{m}\\cdot\\text{K}',
      variableDefs: [
        { symbol: '\\lambda_{\\text{max}}', meaning: 'Wavelength where spectral emission reaches maximum intensity (μm)' },
        { symbol: 'T', meaning: 'Absolute temperature of the radiating surface or soot cloud (K)' },
        { symbol: 'b', meaning: "Wien's displacement constant (2.89777 \\times 10^{-3} \\text{ m}\\cdot\\text{K})" },
      ],
      physicalMeaning:
        'As temperature increases, peak emission wavelength shifts toward shorter wavelengths (higher frequencies).',
      microgravityRelevance:
        'For hot terrestrial flames at T ≈ 2000 K, λ_max ≈ 1.45 μm (near-IR, with strong visible yellow tail). For cooler microgravity flames at 1450 K, λ_max shifts to ~2.0 μm, rendering them virtually invisible to human eyes under cabin lighting.',
      tags: ['Wien', 'Peak Wavelength', 'Infrared'],
    },

    // 15. Chemiluminescent Quantum Emission
    {
      id: 'eq-chemiluminescence',
      name: 'Chemiluminescent Photon Transition (CH* & OH*)',
      category: 'Spectroscopy & Color',
      latex: '\\Delta E = E_{\\text{upper}} - E_{\\text{lower}} = h \\nu = \\frac{h c}{\\lambda}',
      variableDefs: [
        { symbol: '\\Delta E', meaning: 'Electronic quantum state energy transition (Joules or eV)' },
        { symbol: '\\nu', meaning: 'Photon optical frequency (Hz)' },
        { symbol: '\\lambda', meaning: 'Discrete emission wavelength (nm)' },
      ],
      physicalMeaning:
        'Photons emitted when electronically excited intermediate free radicals transition to their ground quantum state.',
      microgravityRelevance:
        'Without soot incandescence blinding the camera, microgravity flames display pure quantum chemiluminescence: CH* emits at 431.4 nm (ethereal violet-blue), C₂* Swan band emits at 516.5 nm (cyan-green), and OH* emits at 306.4 nm (UV reaction front).',
      tags: ['Chemiluminescence', 'CH*', 'OH*', 'Blue Flame', 'Quantum'],
    },

    // 16. Chemiluminescence Intensity & Heat Release
    {
      id: 'eq-chemiluminescence-intensity',
      name: 'Chemiluminescent Intensity Proportionality',
      category: 'Spectroscopy & Color',
      latex: 'I_{CH^*} \\propto [CH] [O_2] \\propto \\dot{\\omega}_T \\approx A_{\\text{eff}} \\dot{m}^{\\prime\\prime}_{F} \\Delta H_c',
      variableDefs: [
        { symbol: 'I_{CH^*}', meaning: 'Blue chemiluminescence optical intensity (W/(m²·sr))' },
        { symbol: '[CH], [O_2]', meaning: 'Molar concentrations of methylidyne radical and molecular oxygen' },
        { symbol: '\\dot{\\omega}_T', meaning: 'Volumetric rate of chemical heat release (W/m³)' },
        { symbol: '\\dot{m}^{\\prime\\prime}_{F}', meaning: 'Local fuel mass burning flux (kg/(m²·s))' },
      ],
      physicalMeaning:
        'Blue light intensity is directly proportional to the instantaneous rate of chemical heat release.',
      microgravityRelevance:
        'NASA diagnostic cameras calibrate $I_{\\mathrm{CH}^{*}}$ and $I_{\\mathrm{OH}^{*}}$ to measure local heat release across spherical flame fronts without needing physical thermocouples that would perturb the 0g boundary layer.',
      tags: ['Heat Release', 'Intensity', 'Diagnostic', 'Photometry'],
    },

    // 17. Two-Color Pyrometry
    {
      id: 'eq-two-color-pyrometry',
      name: 'Two-Color Optical Pyrometry (Ratio Pyrometry)',
      category: 'Spectroscopy & Color',
      latex: 'T = \\frac{\\frac{h c}{k_B} \\left(\\frac{1}{\\lambda_2} - \\frac{1}{\\lambda_1}\\right)}{\\ln\\left(\\frac{I_{\\lambda_1}}{I_{\\lambda_2}}\\right) + 5 \\ln\\left(\\frac{\\lambda_1}{\\lambda_2}\\right) - \\ln\\left(\\frac{\\epsilon_{\\lambda_1}}{\\epsilon_{\\lambda_2}}\\right)}',
      variableDefs: [
        { symbol: 'I_{\\lambda_1}, I_{\\lambda_2}', meaning: 'Measured spectral intensities at two distinct narrow optical wavelengths' },
        { symbol: '\\lambda_1, \\lambda_2}', meaning: 'Selected filter wavelengths (e.g., 650 nm red and 532 nm green)' },
        { symbol: '\\epsilon_{\\lambda_1} / \\epsilon_{\\lambda_2}', meaning: 'Soot spectral emissivity ratio (evaluated via Rayleigh scattering limit)' },
      ],
      physicalMeaning:
        'Extracts true thermodynamic temperature from the intensity ratio at two distinct wavelengths, eliminating emissivity uncertainty.',
      microgravityRelevance:
        'Used in the NASA CIR SoFIE and ACME rigs to generate non-intrusive 2D temperature maps of microgravity flames without inserting thermocouples.',
      tags: ['Pyrometry', 'Two-Color', 'Temperature Measurement'],
    },

    // 18. Thermophoretic Force on Particles
    {
      id: 'eq-thermophoresis',
      name: 'Thermophoretic Force (Particle Repulsion from Flame)',
      category: 'Particle Dynamics',
      latex: '\\mathbf{F}_{\\text{th}} = -\\frac{6 \\pi \\mu \\nu d_p C_s \\left(\\frac{k_g}{k_p} + C_t Kn\\right)}{(1 + 3 C_m Kn)\\left(1 + 2 \\frac{k_g}{k_p} + 2 C_t Kn\\right)} \\frac{\\nabla T}{T}',
      variableDefs: [
        { symbol: '\\mathbf{F}_{\\text{th}}', meaning: 'Thermophoretic force vector pushing particle toward colder gas (N)' },
        { symbol: 'd_p', meaning: 'Diameter of soot particle or smoke aerosol (m)' },
        { symbol: 'k_g / k_p', meaning: 'Ratio of thermal conductivities of ambient gas to soot particle' },
        { symbol: 'Kn', meaning: 'Knudsen number (mean free path / particle radius, \\lambda_{\\text{mfp}} / r_p)' },
        { symbol: '\\nabla T', meaning: 'Local thermal temperature gradient (K/m)' },
      ],
      physicalMeaning:
        'Gas molecules on the hotter side of a particle collide with higher kinetic energy than those on the cooler side, exerting a net force away from heat.',
      microgravityRelevance:
        'In 1g, buoyancy sweeps soot particles upwards into the plume. In 0g, thermophoresis pushes soot particles outwards from the flame sheet into a concentric outer shell, creating an annular soot standoff ring.',
      tags: ['Thermophoresis', 'Soot', 'Particles', 'Aerosol'],
    },

    // 19. Thermophoretic Particle Velocity
    {
      id: 'eq-thermophoretic-velocity',
      name: 'Thermophoretic Drift Velocity',
      category: 'Particle Dynamics',
      latex: '\\mathbf{u}_{\\text{th}} = -K_{\\text{th}} \\frac{\\nu}{T} \\nabla T, \\quad K_{\\text{th}} \\approx 0.55',
      variableDefs: [
        { symbol: '\\mathbf{u}_{\\text{th}}', meaning: 'Net thermophoretic drift velocity of smoke particles relative to fluid (m/s)' },
        { symbol: 'K_{\\text{th}}', meaning: 'Thermophoretic velocity coefficient (dimensionless, ~0.55 for transition regime)' },
        { symbol: '\\nu', meaning: 'Kinematic viscosity of surrounding gas (m²/s)' },
      ],
      physicalMeaning:
        'Particle velocity induced strictly by temperature gradients in the absence of external fluid convection.',
      microgravityRelevance:
        'Explains why smoke particles move steadily away from smoldering wires even when the spacecraft cabin air is completely still.',
      tags: ['Thermophoretic Velocity', 'Smoke Movement', 'Drift'],
    },

    // 20. Stokes Drag with Cunningham Correction
    {
      id: 'eq-stokes-cunningham',
      name: 'Stokes Drag Force with Cunningham Slip Correction',
      category: 'Particle Dynamics',
      latex: '\\mathbf{F}_D = \\frac{3 \\pi \\mu d_p}{C_c(Kn)} (\\mathbf{u}_{\\text{gas}} - \\mathbf{u}_p), \\quad C_c(Kn) = 1 + Kn \\left[ A + B \\exp\\left(-\\frac{C}{Kn}\\right) \\right]',
      variableDefs: [
        { symbol: '\\mathbf{F}_D', meaning: 'Aerodynamic viscous drag force on smoke/soot aerosol (N)' },
        { symbol: 'C_c(Kn)', meaning: 'Cunningham slip correction factor for submicron particles (dimensionless)' },
        { symbol: '\\mathbf{u}_{\\text{gas}} - \\mathbf{u}_p', meaning: 'Relative slip velocity between gas flow and particle (m/s)' },
      ],
      physicalMeaning:
        'Viscous drag opposing particle movement, corrected for non-continuum molecular slip when particle size approaches the mean free path.',
      microgravityRelevance:
        'Governs how smoke particles are transported by HVAC ventilation into the SAME and SAME-R smoke detection chambers.',
      tags: ['Stokes Drag', 'Cunningham', 'Aerosol Drag'],
    },

    // 21. Particle Equation of Motion in Microgravity
    {
      id: 'eq-particle-motion-0g',
      name: 'Particle Equation of Motion in Microgravity',
      category: 'Particle Dynamics',
      latex: 'm_p \\frac{d\\mathbf{u}_p}{dt} = \\mathbf{F}_D + \\mathbf{F}_{\\text{th}} + \\mathbf{F}_{\\text{elec}} \\quad \\text{with } \\mathbf{F}_b = (\\rho_p - \\rho_g) V_p \\mathbf{g} = \\mathbf{0}',
      variableDefs: [
        { symbol: 'm_p', meaning: 'Mass of individual smoke aerosol or soot aggregate (kg)' },
        { symbol: '\\mathbf{F}_D', meaning: 'Stokes aerodynamic drag force (N)' },
        { symbol: '\\mathbf{F}_{\\text{th}}', meaning: 'Thermophoretic force away from flame sheet (N)' },
        { symbol: '\\mathbf{F}_{\\text{elec}}', meaning: 'Electrostatic force if electric fields or chemi-ions are present (q E, N)' },
        { symbol: '\\mathbf{F}_b', meaning: 'Gravitational buoyancy force = 0 in orbital freefall' },
      ],
      physicalMeaning:
        'Complete force balance on particulate matter near a flame front in zero gravity.',
      microgravityRelevance:
        'Without gravity settling particles downwards or buoyant plumes carrying them upwards, smoke particles hover, agglomerate into long chains, and migrate purely through thermophoresis and ventilation drag.',
      tags: ['Particle Motion', 'Buoyancy Zero', 'Soot Agglomeration'],
    },

    // 22. Chemi-Ionization Reaction
    {
      id: 'eq-chemi-ionization',
      name: 'Chemi-Ionization in Hydrocarbon Flame Sheets',
      category: 'Particle Dynamics',
      latex: 'CH + O \\longrightarrow CHO^+ + e^-, \\quad CHO^+ + H_2O \\longrightarrow H_3O^+ + CO',
      variableDefs: [
        { symbol: 'CH, O', meaning: 'Ground-state methylidyne radical and atomic oxygen in the reaction zone' },
        { symbol: 'CHO^+', meaning: 'Formyl cation (primary chemi-ion produced in flame zone)' },
        { symbol: 'H_3O^+', meaning: 'Hydronium cation (dominant long-lived secondary flame ion)' },
        { symbol: 'e^-', meaning: 'Free thermal electrons with high mobility' },
      ],
      physicalMeaning:
        'Exothermic elementary chemical reactions produce ion-electron pairs inside the flame sheet without requiring thermal ionization temperatures.',
      microgravityRelevance:
        'In the NASA ACME E-FIELD experiments, electric fields applied to these natural flame ions create an artificial body force that pulls the flame, precisely demonstrating how electrostatic forces can replace gravity.',
      tags: ['Chemi-Ions', 'ACME E-FIELD', 'Plasma', 'Ion Kinetics'],
    },

    // 23. Electrostatic Body Force (Ionic Wind)
    {
      id: 'eq-ionic-wind-body-force',
      name: 'Electrostatic Body Force & Artificial Gravity (Ionic Wind)',
      category: 'Particle Dynamics',
      latex: '\\mathbf{f}_{\\text{elec}} = \\rho_e \\mathbf{E} = e (n_+ - n_-) \\mathbf{E}, \\quad \\mathbf{u}_{\\text{drift}} = \\mu_i \\mathbf{E}',
      variableDefs: [
        { symbol: '\\mathbf{f}_{\\text{elec}}', meaning: 'Volumetric electrostatic force on flame gas (N/m³)' },
        { symbol: '\\rho_e', meaning: 'Net space charge density (C/m³)' },
        { symbol: '\\mathbf{E}', meaning: 'Applied electric field vector (V/m)' },
        { symbol: '\\mu_i', meaning: 'Ion mobility in neutral gas mixture (m²/(V·s))' },
      ],
      physicalMeaning:
        'Electric fields accelerate chemi-ions, which collide with neutral molecules and transfer momentum, generating an artificial convective flow called "ionic wind".',
      microgravityRelevance:
        'In microgravity, applying 5-10 kV across an electrode pair creates an artificial draft that restores upward convection or shapes flames, directly linking combustion research to plasma thruster propellant handling.',
      tags: ['Ionic Wind', 'Electric Field', 'Plasma Thruster', 'Artificial Gravity'],
    },

    // 24. Opposed-Flow Flame Spread Rate
    {
      id: 'eq-opposed-spread-rate',
      name: 'Opposed-Flow Solid Flame Spread Rate (de Ris)',
      category: 'Spread & Safety',
      latex: 'V_f = V_a \\frac{\\rho_g c_g k_g}{\\rho_s c_s k_s} \\left( \\frac{T_f - T_{ig}}{T_{ig} - T_0} \\right)^2',
      variableDefs: [
        { symbol: 'V_f', meaning: 'Flame spreading velocity over solid fuel surface (m/s or mm/s)' },
        { symbol: 'V_a', meaning: 'Opposed airflow velocity (e.g., HVAC airflow, m/s)' },
        { symbol: '\\rho_g, c_g, k_g', meaning: 'Density, specific heat, and thermal conductivity of ambient gas' },
        { symbol: '\\rho_s, c_s, k_s', meaning: 'Density, specific heat, and thermal conductivity of solid fuel' },
        { symbol: 'T_{ig}', meaning: 'Ignition / pyrolysis temperature of the solid material (K)' },
      ],
      physicalMeaning:
        'Predicts how rapidly fire spreads against an incoming air stream across plastics (PMMA) or fabrics in spacecraft.',
      microgravityRelevance:
        'Tested in BASS and SoFIE GEL: in microgravity without buoyant air currents, flame spread is controlled strictly by forced airflow velocity V_a. If ventilation stops, V_a → 0, drastically slowing flame spread.',
      tags: ['Flame Spread', 'Solid Fuel', 'BASS', 'SoFIE GEL'],
    },

    // 25. Damköhler Number
    {
      id: 'eq-damkohler',
      name: 'Damköhler Number (Extinction vs Flame Blowoff)',
      category: 'Spread & Safety',
      latex: 'Da = \\frac{\\tau_{\\text{flow}}}{\\tau_{\\text{chem}}} = \\frac{L / u}{1 / \\left( A \\exp\\left(-\\frac{E_a}{R_u T_f}\\right) \\right)}',
      variableDefs: [
        { symbol: 'Da', meaning: 'Damköhler number (flow residence time vs chemical reaction time)' },
        { symbol: '\\tau_{\\text{flow}}', meaning: 'Fluid dynamic residence time scale (s)' },
        { symbol: '\\tau_{\\text{chem}}', meaning: 'Chemical reaction kinetics time scale (s)' },
        { symbol: 'u', meaning: 'Local gas velocity (m/s)' },
      ],
      physicalMeaning:
        'When Da ≫ 1, chemistry is fast and a vigorous thin flame front forms; when Da < Da_crit, the flame blows off and extinguishes.',
      microgravityRelevance:
        'Because flow velocities in microgravity are very low (diffusion-dominated), τ_flow is exceptionally long (Da ≫ 1), allowing fuels to burn at significantly lower oxygen concentrations than possible on Earth.',
      tags: ['Damkohler', 'Extinction', 'Kinetics'],
    },

    // 26. Limiting Oxygen Index (LOI)
    {
      id: 'eq-loi',
      name: 'Limiting Oxygen Index (LOI) for Spacecraft Materials',
      category: 'Spread & Safety',
      latex: 'LOI = \\frac{[O_2]}{[O_2] + [N_2]} \\times 100\\%',
      variableDefs: [
        { symbol: 'LOI', meaning: 'Minimum volume percentage of O₂ required to sustain candle-like downward combustion (%)' },
        { symbol: '[O_2], [N_2]', meaning: 'Concentrations of oxygen and nitrogen in the cabin atmosphere' },
      ],
      physicalMeaning:
        'Standard flammability metric under NASA-STD-6001. Materials with LOI < ambient O₂ concentration will burn vigorously.',
      microgravityRelevance:
        'In the Planned Moon Base (34% O₂ at 8.2 psi), the ambient oxygen percentage is 34%, far exceeding the terrestrial 21% threshold. Materials certified as "fireproof" on Earth (LOI ~ 25%) will ignite readily in Lunar habitats.',
      tags: ['LOI', 'Materials Screening', 'Moon Base', 'NASA-STD-6001'],
    },
  ];

  const filteredEquations = equations.filter((eq) => {
    const matchesCat = selectedCategory === 'All' || eq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.physicalMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.microgravityRelevance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="equations" className="py-12 sm:py-16 lg:py-24 scroll-mt-16 border-b border-theme bg-canvas transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-accent mb-2">
            <Sigma className="w-4 h-4 text-accent" />
            <span>MATHEMATICAL & PHYSICAL FOUNDATIONS</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>KATEX EQUATION COMPENDIUM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-title" style={{ textWrap: 'balance' }}>
            Governing Equations of Microgravity & Terrestrial Combustion
          </h2>
          <p className="mt-3 text-base text-body leading-relaxed">
            Every physical phenomenon governing fire in space—from buoyant acceleration cancellation ($Gr \to 0$) and Stefan-Boltzmann radiative quenching to blue quantum chemiluminescence, particle thermophoresis, and chemi-ionization—formulated in rigorous mathematical notation.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-card-theme border border-theme rounded-xl p-4 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search equations, variables (Gr, Ra, T⁴, CH*, Stokes, de Ris, LOI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface pl-10 pr-4 py-2 text-xs font-mono rounded-lg border border-theme text-title placeholder:text-muted focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-mono text-muted whitespace-nowrap self-center">
              Displaying <span className="font-bold text-accent">{filteredEquations.length}</span> of {equations.length} Equations
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-accent-subtle text-accent border-accent-subtle font-semibold'
                    : 'bg-surface text-muted hover:text-title border-theme-subtle hover:bg-surface-elevated'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Equations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredEquations.map((eq) => {
            const isCopied = copiedId === eq.id;
            return (
              <div
                key={eq.id}
                className="bg-card-theme border border-theme rounded-xl p-5 shadow-sm space-y-4 hover:border-accent-subtle transition-all duration-200"
              >
                {/* Header with Title and Category Tag */}
                <div className="flex items-start justify-between gap-4 border-b border-theme-subtle pb-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                      {eq.category}
                    </div>
                    <h3 className="text-base font-semibold text-title mt-0.5"><RichText text={eq.name} /></h3>
                  </div>

                  <button
                    onClick={() => handleCopyLatex(eq.id, eq.latex)}
                    className="p-1.5 rounded-md bg-surface hover:bg-surface-elevated border border-theme-subtle text-muted hover:text-accent transition-colors shrink-0"
                    title="Copy LaTeX code to clipboard"
                    aria-label={`Copy LaTeX code for ${eq.name}`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* KaTeX Math Display Box */}
                <div className="bg-surface-elevated border border-theme rounded-lg py-3 px-4 flex items-center justify-center overflow-x-auto text-title">
                  <MathView math={eq.latex} block={true} className="text-sm sm:text-base text-cyan-400 font-semibold" />
                </div>

                {/* Physical Meaning & Microgravity Relevance */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <div>
                    <span className="font-mono text-muted uppercase text-[11px] block font-semibold">Physical Meaning:</span>
                    <p className="text-body font-sans"><RichText text={eq.physicalMeaning} /></p>
                  </div>

                  <div className="p-3 bg-accent-subtle rounded-md border border-accent-subtle space-y-1">
                    <span className="font-mono text-accent uppercase text-[11px] block font-bold flex items-center gap-1">
                      <Orbit className="w-3 h-3 text-accent" />
                      <span>Microgravity Behavior & Space Exploration Role:</span>
                    </span>
                    <p className="text-body text-xs font-sans"><RichText text={eq.microgravityRelevance} /></p>
                  </div>
                </div>

                {/* Variable Definitions */}
                <div className="space-y-1 pt-2 border-t border-theme-subtle">
                  <span className="font-mono text-muted text-[11px] uppercase font-semibold block">Variable Glossary:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs font-mono">
                    {eq.variableDefs.map((v, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <MathView math={v.symbol} className="text-accent shrink-0 font-bold" />
                        <span className="text-muted text-[11px]">: <RichText text={v.meaning} /></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {eq.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface border border-theme-subtle text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

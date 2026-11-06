'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { HistoricIncidentsSection } from './HistoricIncidentsSection';
import { ExplorationAtmosphereCalculator } from './ExplorationAtmosphereCalculator';
import { VisionMissionSection } from './VisionMissionSection';
import { CombustionCourseSection } from './CombustionCourseSection';
import { CombustionEquationsCompendium } from './CombustionEquationsCompendium';
import { TechnicalSpecsSection } from './TechnicalSpecsSection';
import { SystemArchitectureSection } from './SystemArchitectureSection';
import { CVFlameAnalyzer } from './CVFlameAnalyzer';
import { SIIntelligenceEngine } from './SIIntelligenceEngine';
import { NasaDatasetsExplorer } from './NasaDatasetsExplorer';
import { TeamSection } from './TeamSection';
import { TeamCollaborationModal } from './TeamCollaborationModal';
import { Footer } from './Footer';

function MainApp() {
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collabTrack, setCollabTrack] = useState<string | undefined>(undefined);

  const handleOpenCollaboration = (trackId?: string) => {
    setCollabTrack(trackId);
    setCollabModalOpen(true);
  };

  const handleCloseCollaboration = () => {
    setCollabModalOpen(false);
  };

  return (
    <div className="min-h-dvh bg-canvas text-body flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Header with Global Theme Toggle */}
      <Navbar onOpenCollaboration={handleOpenCollaboration} />

      {/* Main Content Layout */}
      <main className="flex-1">
        {/* 1. Hero with Space Apps Challenge Branding & NASA Flame Visualizer */}
        <HeroSection onOpenCollaboration={handleOpenCollaboration} />

        {/* 2. Historic Space Fires (Artemis II, Apollo 13, Mir, Apollo 1) & 3 Safety Pillars */}
        <HistoricIncidentsSection />

        {/* 3. Exploration Atmosphere & Flammability Simulator (Moon Base, Spacesuit, Rover) */}
        <ExplorationAtmosphereCalculator />

        {/* 4. Vision, Mission & Problem Statement + Cross-Domain Hypotheses */}
        <VisionMissionSection />

        {/* 5. Foundational Course: Microgravity Flame Science (Math, Physics, Chemistry, EM Spectrum) */}
        <CombustionCourseSection />

        {/* 6. KaTeX Governing Equations of Combustion Compendium */}
        <CombustionEquationsCompendium />

        {/* 7. Key Technical Specifications & Calibrated Regimes */}
        <TechnicalSpecsSection />

        {/* 6. Full-Stack System Architecture & Technology Stack */}
        <SystemArchitectureSection />

        {/* 7. Interactive Computer Vision Flame Analyzer (Canvas Spectrogram & Pyrometry) */}
        <CVFlameAnalyzer onOpenCollaboration={handleOpenCollaboration} />

        {/* 8. Super Intelligence (SI) Combustion Engine (Powered by Gemini 3.8 Flash) */}
        <SIIntelligenceEngine />

        {/* 9. NASA PSI Flight Investigations Directory with Side-by-Side Comparator */}
        <NasaDatasetsExplorer />

        {/* 10. Multidisciplinary Team Callout & Direct Email / WhatsApp Connect */}
        <TeamSection onOpenCollaboration={handleOpenCollaboration} />
      </main>

      {/* Footer */}
      <Footer onOpenCollaboration={handleOpenCollaboration} />

      {/* Team Collaboration & Contact Modal */}
      <TeamCollaborationModal
        isOpen={collabModalOpen}
        onClose={handleCloseCollaboration}
        initialTrackId={collabTrack}
      />
    </div>
  );
}

export default function MainAppRoot() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

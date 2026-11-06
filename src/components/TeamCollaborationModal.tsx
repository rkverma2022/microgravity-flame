'use client';

import React, { useState } from 'react';
import { X, Mail, MessageCircle, Copy, CheckCheck } from 'lucide-react';
import { TEAM_TRACKS } from '../data/nasaData';

interface TeamCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackId?: string;
}

export const TeamCollaborationModal: React.FC<TeamCollaborationModalProps> = ({
  isOpen,
  onClose,
  initialTrackId,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrackId || 'ai-ml');
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const targetEmail = 'rajkumarverma70790@gmail.com';
  const [whatsAppNumber, setWhatsAppNumber] = useState('916388257447');

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const currentTrackObj = TEAM_TRACKS.find((t) => t.id === selectedTrack) || TEAM_TRACKS[0];

  const handleLaunchEmail = () => {
    const subject = encodeURIComponent(`Flame In Microgravity Collaboration: ${currentTrackObj.title}`);
    const bodyText = encodeURIComponent(
      `Hi Rajkumar,\n\nI am interested in collaborating on the Flame In Microgravity project.\n\nName: ${applicantName || 'Prospective Collaborator'}\nContact Info: ${applicantContact || 'N/A'}\nTrack of Interest: ${currentTrackObj.title}\n\nCollaboration Note:\n${message || 'I would love to contribute to AI/ML and combustion data analysis for space fire safety.'}\n\nBest regards,\n${applicantName || 'Collaborator'}`
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${bodyText}`;
  };

  const handleLaunchWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Rajkumar! I want to collaborate on the Flame In Microgravity project.\n\nName: ${applicantName || 'Collaborator'}\nTrack: ${currentTrackObj.title}\n\nMessage: ${message || 'Excited to explore microgravity combustion, ML models, and energy transfer.'}`
    );
    window.open(`https://wa.me/${whatsAppNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card-solid border border-theme rounded-lg max-w-2xl w-full max-h-[92dvh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-title rounded-md bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-theme-subtle pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold">
            <span>TEAM COLLABORATION</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>FLAME IN MICROGRAVITY</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-title">
            Connect & Collaborate with Our Research Team
          </h3>
          <p className="text-xs text-body">
            We welcome researchers, engineers, and creators passionate about AI/ML, Python, fluid dynamics, and space safety.
          </p>
        </div>

        {/* Direct Contact Reference */}
        <div className="p-3.5 bg-surface border border-theme rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-muted block text-xs">LEAD RESEARCHER EMAIL</span>
            <span className="text-accent font-semibold">{targetEmail}</span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-theme hover:bg-surface-elevated text-title rounded border border-theme text-xs font-medium"
          >
            {copiedEmail ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Copied to Clipboard' : 'Copy Email'}</span>
          </button>
        </div>

        {/* Track Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-title font-semibold">
            Select Your Preferred Collaboration Track:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEAM_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track.id)}
                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                  selectedTrack === track.id
                    ? 'bg-accent-subtle border-cyan-500/50 text-title font-semibold'
                    : 'bg-surface border-theme text-muted hover:text-title hover:bg-surface-elevated'
                }`}
              >
                <div className="font-semibold text-title truncate">{track.title}</div>
                <div className="text-[11px] text-muted mt-1 truncate">
                  {track.skills.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="applicant-name" className="text-title uppercase block font-semibold">Your Name / Handle:</label>
              <input
                id="applicant-name"
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Dr. Alex Mercer"
                className="w-full bg-inset border border-theme rounded-lg p-2.5 text-title placeholder-muted focus:outline-none focus:border-cyan-500 font-sans text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="applicant-contact" className="text-title uppercase block font-semibold">Your Email or WhatsApp Phone:</label>
              <input
                id="applicant-contact"
                type="text"
                value={applicantContact}
                onChange={(e) => setApplicantContact(e.target.value)}
                placeholder="e.g. name@domain.com or +1 234..."
                className="w-full bg-inset border border-theme rounded-lg p-2.5 text-title placeholder-muted focus:outline-none focus:border-cyan-500 font-sans text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="applicant-message" className="text-title uppercase block font-semibold">
              What do you want to build or explore with us?
            </label>
            <textarea
              id="applicant-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your background in AI/ML, computer vision, space research, or your thoughts on flame energy transfer and plasma thrusters..."
              className="w-full bg-inset border border-theme rounded-lg p-2.5 text-title placeholder-muted focus:outline-none focus:border-cyan-500 font-sans text-xs"
            />
          </div>

          {/* WhatsApp Direct Number Customizer / Display */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Target WhatsApp Contact Number:</span>
              <span className="text-body font-mono">Default: +91 63882 57447</span>
            </div>
            <input
              type="text"
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              placeholder="e.g. 916388257447"
              className="w-full bg-inset border border-theme rounded p-1.5 text-title text-xs font-mono"
            />
          </div>
        </div>

        {/* Dual Dispatch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-theme-subtle">
          <button
            onClick={handleLaunchEmail}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email via Client</span>
          </button>

          <button
            onClick={handleLaunchWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

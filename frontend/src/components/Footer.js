import React from 'react';
import { Link } from 'react-router-dom';

// Seal logo URL
const SEAL_LOGO = "https://customer-assets.emergentagent.com/job_870e50df-769b-4f54-87c7-dc69482a19cb/artifacts/jdsp7esr_WhereTheCrowLandsLogo.png";

export const Footer = () => {
  return (
    <footer 
      className="mt-24 relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(26, 21, 18, 0.95) 0%, rgba(20, 16, 14, 1) 100%)',
      }}
    >
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
      
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px bg-gradient-to-r from-transparent to-amber-500/30 flex-1 max-w-48" />
        <span className="text-amber-500/40 text-xl">❧</span>
        <div className="h-px bg-gradient-to-l from-transparent to-amber-500/30 flex-1 max-w-48" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Seal Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-6">
              <div 
                className="absolute inset-0 blur-xl opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(139, 90, 43, 0.5) 0%, transparent 70%)' }}
              />
              <img 
                src={SEAL_LOGO}
                alt="Where The Crowlands Seal"
                className="relative h-32 w-32 object-contain"
                style={{ filter: 'sepia(20%) brightness(0.9)', mixBlendMode: 'multiply' }}
              />
            </div>
            <p className="font-crimson text-sm text-center md:text-left text-amber-100/60 leading-relaxed">
              Build your own practice. No gatekeepers, no expensive services—just formulas, patterns, and your power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-lg text-amber-300 mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/spell-request', label: 'Request a Spell' },
                { to: '/guides', label: 'Meet Your Guides' },
                { to: '/deities', label: 'Deities' },
                { to: '/figures', label: 'Historical Figures' },
                { to: '/rituals', label: 'Rituals & Practices' },
                { to: '/timeline', label: 'Timeline 1910-1945' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="font-crimson text-sm text-amber-100/70 hover:text-amber-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-cinzel text-lg text-amber-300 mb-4 tracking-wide">Resources</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/ai-chat', label: 'AI Research' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="font-crimson text-sm text-amber-100/70 hover:text-amber-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-3 border border-amber-500/20 rounded-sm">
              <p className="font-crimson text-xs text-amber-100/50 italic">
                Historical note: We document the claims and practices of the 1910-1945 era with scholarly integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(139, 90, 43, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-crimson text-sm text-amber-100/50">
              © {new Date().getFullYear()} Where The Crowlands. All rights reserved.
            </p>
            <p className="font-crimson text-xs text-amber-100/40 mt-2 md:mt-0">
              Built with historical research & modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

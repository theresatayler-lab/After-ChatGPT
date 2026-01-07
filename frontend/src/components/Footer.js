import React from 'react';
import { Link } from 'react-router-dom';

// Seal logo URL
const SEAL_LOGO = "https://customer-assets.emergentagent.com/job_870e50df-769b-4f54-87c7-dc69482a19cb/artifacts/jdsp7esr_WhereTheCrowLandsLogo.png";

export const Footer = () => {
  return (
    <footer 
      className="mt-24 relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(14, 22, 41, 0.95) 0%, rgba(10, 16, 30, 1) 100%)',
      }}
    >
      {/* Top decorative border - enhanced */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
      <div className="h-px mt-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      
      {/* Decorative divider with ornate elements */}
      <div className="flex items-center justify-center gap-6 py-8">
        <div className="h-0.5 bg-gradient-to-r from-transparent to-gold/50 flex-1 max-w-48" />
        <span className="text-crimson text-lg glow-crimson">◆</span>
        <span className="text-gold/60 text-2xl">❧</span>
        <span className="text-crimson text-lg glow-crimson">◆</span>
        <div className="h-0.5 bg-gradient-to-l from-transparent to-gold/50 flex-1 max-w-48" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Seal Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-6">
              <div 
                className="absolute inset-0 blur-xl opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(212, 168, 75, 0.4) 0%, transparent 70%)' }}
              />
              <img 
                src={SEAL_LOGO}
                alt="Where The Crowlands Seal"
                className="relative h-32 w-32 object-contain"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
            </div>
            <p className="font-crimson text-sm text-center md:text-left text-silver-mist/70 leading-relaxed">
              Build your own practice. No gatekeepers, no expensive services—just formulas, patterns, and your power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-lg text-gold mb-4 tracking-wide flex items-center gap-2">
              <span className="text-crimson text-sm">◆</span>
              Explore
            </h4>
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
                    className="font-crimson text-sm text-silver-mist/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-cinzel text-lg text-gold mb-4 tracking-wide flex items-center gap-2">
              <span className="text-crimson text-sm">◆</span>
              Resources
            </h4>
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
                    className="font-crimson text-sm text-silver-mist/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 border border-gold/30 rounded-sm bg-navy-mid/30 relative">
              <span className="absolute -top-2 left-3 bg-navy-dark px-2 text-crimson text-xs">◆</span>
              <p className="font-crimson text-xs text-silver-mist/60 italic">
                Historical note: We document the claims and practices of the 1910-1945 era with scholarly integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-crimson text-sm text-silver-mist/60">
              © {new Date().getFullYear()} Where The Crowlands. All rights reserved.
            </p>
            <p className="font-crimson text-xs text-silver-mist/40 mt-2 md:mt-0">
              Built with historical research & modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

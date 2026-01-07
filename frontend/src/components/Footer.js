import React from 'react';
import { Link } from 'react-router-dom';

// Seal logo URL
const SEAL_LOGO = "https://customer-assets.emergentagent.com/job_870e50df-769b-4f54-87c7-dc69482a19cb/artifacts/jdsp7esr_WhereTheCrowLandsLogo.png";

export const Footer = () => {
  return (
    <footer 
      className="mt-24 relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(10, 22, 40, 0.95) 0%, rgba(6, 14, 28, 1) 100%)',
      }}
    >
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
      
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px bg-gradient-to-r from-transparent to-champagne/30 flex-1 max-w-48" />
        <span className="text-champagne/50 text-xl">❧</span>
        <div className="h-px bg-gradient-to-l from-transparent to-champagne/30 flex-1 max-w-48" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Seal Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-6">
              <div 
                className="absolute inset-0 blur-xl opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(201, 169, 98, 0.4) 0%, transparent 70%)' }}
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
            <h4 className="font-cinzel text-lg text-champagne mb-4 tracking-wide">Explore</h4>
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
                    className="font-crimson text-sm text-silver-mist/70 hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-cinzel text-lg text-champagne mb-4 tracking-wide">Resources</h4>
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
                    className="font-crimson text-sm text-silver-mist/70 hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-3 border border-champagne/20 rounded-sm bg-navy-mid/30">
              <p className="font-crimson text-xs text-silver-mist/60 italic">
                Historical note: We document the claims and practices of the 1910-1945 era with scholarly integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(201, 169, 98, 0.2)' }}>
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

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { WaitlistForm } from '../components/WaitlistForm';

// Enhanced Ornate corner SVG component
const OrnateCorner = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M0,40 Q0,0 40,0" strokeWidth="2" />
    <path d="M0,30 Q0,0 30,0" opacity="0.7" />
    <path d="M0,20 Q0,0 20,0" opacity="0.4" />
    <path d="M8,50 Q8,8 50,8" opacity="0.2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
    <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.5" />
    {/* Decorative flourish */}
    <path d="M15,0 L15,8 M0,15 L8,15" strokeWidth="1" opacity="0.4" />
  </svg>
);

// Large Ornate Divider with crimson diamonds and gold lines
const OrnateDivider = ({ variant = 'default', size = 'medium' }) => {
  const sizeClasses = {
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12'
  };
  
  return (
    <div className={`flex items-center justify-center gap-6 ${sizeClasses[size]}`}>
      {/* Left gold line with gradient */}
      <div className="flex-1 max-w-48 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-gold" />
      
      {/* Left crimson diamond */}
      <span className="text-crimson-bright text-xl glow-crimson">◆</span>
      
      {/* Center ornament */}
      <div className="flex items-center gap-3 text-gold">
        {variant === 'moon' ? (
          <>
            <span className="text-2xl opacity-60">☾</span>
            <span className="text-3xl glow-gold">☽</span>
            <span className="text-2xl opacity-60">☽</span>
          </>
        ) : variant === 'crow' ? (
          <span className="text-3xl">🐦‍⬛</span>
        ) : variant === 'eye' ? (
          <span className="text-3xl">👁</span>
        ) : (
          <>
            <span className="text-lg opacity-60">✧</span>
            <span className="text-2xl glow-gold">❧</span>
            <span className="text-lg opacity-60">✧</span>
          </>
        )}
      </div>
      
      {/* Right crimson diamond */}
      <span className="text-crimson-bright text-xl glow-crimson">◆</span>
      
      {/* Right gold line with gradient */}
      <div className="flex-1 max-w-48 h-0.5 bg-gradient-to-l from-transparent via-gold/60 to-gold" />
    </div>
  );
};

// Ornate Section Border
const OrnateSectionBorder = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    {/* Top border with center diamond */}
    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy-dark px-3">
      <span className="text-crimson text-sm">◆</span>
    </div>
    
    {/* Side borders */}
    <div className="absolute top-8 bottom-8 left-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
    <div className="absolute top-8 bottom-8 right-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
    
    {/* Bottom border with center diamond */}
    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-navy-dark px-3">
      <span className="text-crimson text-sm">◆</span>
    </div>
    
    {/* Corner ornaments */}
    <span className="absolute top-2 left-2 text-gold/50 text-lg">✦</span>
    <span className="absolute top-2 right-2 text-gold/50 text-lg">✦</span>
    <span className="absolute bottom-2 left-2 text-gold/50 text-lg">✦</span>
    <span className="absolute bottom-2 right-2 text-gold/50 text-lg">✦</span>
    
    <div className="px-6 py-8">
      {children}
    </div>
  </div>
);

// Keep the simple divider for smaller uses
const MysticalDivider = ({ variant = 'default' }) => (
  <div className="flex items-center justify-center gap-4 py-6">
    <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-gold/60 flex-1 max-w-32" />
    <div className="flex items-center gap-2 text-gold/70">
      {variant === 'crow' ? (
        <span className="text-2xl">🐦‍⬛</span>
      ) : variant === 'moon' ? (
        <>
          <span className="text-base text-crimson glow-crimson">◆</span>
          <span className="text-xl glow-gold">☽</span>
          <span className="text-base text-crimson glow-crimson">◆</span>
        </>
      ) : (
        <>
          <span className="text-sm text-crimson">◆</span>
          <span className="text-lg glow-gold">❧</span>
          <span className="text-sm text-crimson">◆</span>
        </>
      )}
    </div>
    <div className="h-0.5 bg-gradient-to-l from-transparent via-gold/40 to-gold/60 flex-1 max-w-32" />
  </div>
);

export const Home = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #0e1629 0%, #121d33 50%, #0e1629 100%)',
      }}
    >
      {/* Subtle radial glow overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-50 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(184, 35, 48, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(26, 45, 77, 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12">
        {/* Background with vignette */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '0.12',
            filter: 'hue-rotate(200deg) saturate(0.7)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1629]/95 via-[#0e1629]/70 to-[#0e1629] z-0" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0e1629]/90 z-0" />
        
        {/* Decorative corner ornaments - enhanced size */}
        <OrnateCorner className="absolute top-6 left-6 w-20 h-20 text-gold/40 rotate-0" />
        <OrnateCorner className="absolute top-6 right-6 w-20 h-20 text-gold/40 rotate-90" />
        <OrnateCorner className="absolute bottom-6 left-6 w-20 h-20 text-gold/40 -rotate-90" />
        <OrnateCorner className="absolute bottom-6 right-6 w-20 h-20 text-gold/40 rotate-180" />
        
        {/* Additional corner crimson accents */}
        <span className="absolute top-12 left-12 text-crimson/60 text-2xl glow-crimson">◆</span>
        <span className="absolute top-12 right-12 text-crimson/60 text-2xl glow-crimson">◆</span>
        <span className="absolute bottom-12 left-12 text-crimson/60 text-2xl glow-crimson">◆</span>
        <span className="absolute bottom-12 right-12 text-crimson/60 text-2xl glow-crimson">◆</span>
        
        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 flex flex-col items-center">
          {/* Ornate Logo with enhanced glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div 
              className="absolute inset-0 blur-3xl opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(184, 35, 48, 0.4) 0%, rgba(212, 168, 75, 0.25) 50%, transparent 70%)' }}
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png"
              alt="Where The Crowlands"
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-4 sm:mb-6 object-contain drop-shadow-2xl"
              style={{ filter: 'brightness(1.3) contrast(1.1) drop-shadow(0 0 40px rgba(212, 168, 75, 0.4))' }}
            />
          </motion.div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 
                className="font-italiana text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-light mb-4 sm:mb-5 tracking-tight leading-none"
                style={{ textShadow: '0 4px 30px rgba(212, 168, 75, 0.5), 0 0 60px rgba(184, 35, 48, 0.3)' }}
              >
                Where The Crowlands
              </h1>
              
              <p 
                className="font-cinzel text-lg sm:text-xl md:text-2xl text-silver-mist mb-6 sm:mb-8 tracking-wide"
                style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}
              >
                Magic, math and science aren't such strange bedfellows.
              </p>
              
              <OrnateDivider variant="moon" size="medium" />
              
              <div className="font-crimson text-sm sm:text-base md:text-lg text-parchment/85 leading-relaxed max-w-3xl mx-auto px-4 space-y-4">
                <p className="first-letter:text-4xl first-letter:font-italiana first-letter:text-crimson-bright first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:glow-crimson">
                  Where the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the 
                  Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers 
                  of forbidden knowledge, to those closer to my own heart and timeline, the table-tappers and spiritualists 
                  revealing the hidden world, Churchill's secret army of Cockney rebels defending the home front. The druids, 
                  templers, occultists, astrologers, hermetic philosophers, "witches" midwives and alchemists before them…
                </p>
              </div>

              {/* Waitlist Form - Enhanced ornate styling */}
              <div className="mt-12 mb-12">
                <OrnateSectionBorder className="max-w-md mx-auto bg-navy-mid/40 backdrop-blur-sm">
                  <WaitlistForm source="homepage" />
                </OrnateSectionBorder>
              </div>
              
              <OrnateDivider variant="crow" size="small" />
              
              <div className="font-crimson text-sm sm:text-base md:text-lg text-parchment/85 leading-relaxed max-w-3xl mx-auto px-4 space-y-4">
                <p>
                  The magic we've abandoned isn't "woo woo"—it's intention, craft, commitment, and ritual. It is that intention paired with action can change history. Whether our ancestors named it or not, that power is still yours to work with. Inspired by real people—my family—and grounded in plenty of creative lore, Where the Crowlands offers a fun, practical way to bring alchemy, magic, and beauty into your life.
                </p>
                
                <p className="text-gold/90 italic border-l-4 border-crimson/60 pl-4 py-2 bg-crimson/5">
                  While rooted primarily in British history and mysticism, we plan to expand, honouring all cultures—every 
                  tradition has drawn from what lies beneath the veil. As uncertainty and shifting world powers challenge 
                  our sense of and inherent belief system about what constitutes light and dark, it's time to bring a little magic back ;)
                </p>
              </div>

              <OrnateDivider size="small" />
              
              {/* CTA Buttons with ornate styling */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link
                  to="/spell-request"
                  className="group relative px-8 py-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-crimson via-crimson-bright to-crimson rounded-sm" />
                  <div className="absolute inset-px bg-gradient-to-r from-[#8b1a1a] via-crimson to-[#8b1a1a] rounded-sm" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-sm" />
                  <span className="relative flex items-center gap-2 font-montserrat text-parchment tracking-widest uppercase text-sm">
                    <Sparkles className="w-4 h-4" />
                    Begin Your Journey
                  </span>
                </Link>
                
                <Link
                  to="/guides"
                  className="group relative px-8 py-4 border border-champagne/40 hover:border-champagne/70 rounded-sm transition-all hover:bg-champagne/5"
                >
                  <span className="flex items-center gap-2 font-montserrat text-champagne/90 tracking-widest uppercase text-sm group-hover:text-champagne transition-colors">
                    <Users className="w-4 h-4" />
                    Meet Your Guides
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section with dark mystical styling */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <MysticalDivider variant="moon" />
          
          <h2 
            className="font-italiana text-3xl md:text-4xl text-champagne-light text-center mb-12"
            style={{ textShadow: '0 2px 20px rgba(201, 169, 98, 0.4)' }}
          >
            Your Path Awaits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'Craft Your Spells', desc: 'Generate personalized rituals guided by four ancestral archetypes' },
              { icon: BookOpen, title: 'Build Your Grimoire', desc: 'A living archive of wonder—save spells, collect wards, and build your personal magical practice', tooltip: 'From the French for "grammar"—every ritual has its own language for shaping reality' },
              { icon: Moon, title: 'Explore the Archives', desc: 'Discover historical practices, deities, and sacred sites' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 border border-champagne/20 rounded-lg group-hover:border-champagne/40 transition-colors bg-navy-mid/30" />
                <div className="absolute inset-2 border border-crimson/10 rounded-md" />
                <div className="relative p-8 text-center">
                  <feature.icon className="w-10 h-10 text-crimson-bright mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl text-champagne mb-3">{feature.title}</h3>
                  <p className="font-crimson text-silver-mist/80">{feature.desc}</p>
                  {feature.tooltip && (
                    <p className="font-montserrat text-xs text-champagne/50 mt-3 opacity-0 group-hover:opacity-100 transition-opacity italic">
                      {feature.tooltip}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <MysticalDivider />
        </div>
      </div>
    </div>
  );
};

export default Home;

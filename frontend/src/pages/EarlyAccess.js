import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Star, Mail, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Elaborate corner ornament
const ElaborateCorner = ({ className, variant = 'gold' }) => {
  const colors = variant === 'gold' 
    ? { primary: '#d4a84b', secondary: '#b82330', tertiary: '#e6c068' }
    : { primary: '#b82330', secondary: '#d4a84b', tertiary: '#d42a3a' };
  
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M0,60 Q0,0 60,0" stroke={colors.primary} strokeWidth="2.5" opacity="0.9" />
      <path d="M0,48 Q0,0 48,0" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
      <path d="M0,36 Q0,0 36,0" stroke={colors.tertiary} strokeWidth="1" opacity="0.4" />
      <path d="M12,72 Q12,12 72,12" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
      <polygon points="18,18 24,10 30,18 24,26" fill={colors.secondary} opacity="0.95" />
      <polygon points="10,10 14,5 18,10 14,15" fill={colors.primary} opacity="0.7" />
      <circle cx="36" cy="36" r="2.5" fill={colors.primary} opacity="0.6" />
      <circle cx="10" cy="30" r="1.5" fill={colors.secondary} opacity="0.5" />
      <circle cx="30" cy="10" r="1.5" fill={colors.secondary} opacity="0.5" />
    </svg>
  );
};

// Mystical floating symbols
const FloatingSymbols = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Scattered mystical symbols */}
    {[
      { symbol: '☽', top: '10%', left: '5%', delay: 0, size: 'text-3xl' },
      { symbol: '✧', top: '20%', right: '8%', delay: 0.5, size: 'text-2xl' },
      { symbol: '⛤', top: '60%', left: '3%', delay: 1, size: 'text-2xl' },
      { symbol: '☾', top: '75%', right: '5%', delay: 1.5, size: 'text-3xl' },
      { symbol: '◆', top: '40%', left: '8%', delay: 2, size: 'text-xl' },
      { symbol: '✦', top: '85%', left: '10%', delay: 2.5, size: 'text-xl' },
      { symbol: '❧', top: '15%', right: '3%', delay: 3, size: 'text-2xl' },
      { symbol: '☆', top: '50%', right: '4%', delay: 3.5, size: 'text-xl' },
    ].map((item, i) => (
      <motion.span
        key={i}
        className={`absolute ${item.size} text-gold/20`}
        style={{ top: item.top, left: item.left, right: item.right }}
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 4,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {item.symbol}
      </motion.span>
    ))}
  </div>
);

// Grand divider
const GrandDivider = () => (
  <div className="flex items-center justify-center gap-3 sm:gap-6 py-6">
    <span className="text-crimson-bright text-sm opacity-60">✧</span>
    <div className="h-0.5 w-12 sm:w-24 bg-gradient-to-r from-transparent via-gold/80 to-gold" />
    <span className="text-crimson-bright text-lg glow-crimson">◆</span>
    <div className="flex items-center gap-2 text-gold">
      <span className="text-xl opacity-50">☾</span>
      <span className="text-2xl sm:text-3xl glow-gold">☽</span>
      <span className="text-xl opacity-50">☽</span>
    </div>
    <span className="text-crimson-bright text-lg glow-crimson">◆</span>
    <div className="h-0.5 w-12 sm:w-24 bg-gradient-to-l from-transparent via-gold/80 to-gold" />
    <span className="text-crimson-bright text-sm opacity-60">✧</span>
  </div>
);

const EarlyAccessPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          source: 'early_access_landing'
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Welcome to the Crowlands! Check your email for confirmation.');
      } else {
        const data = await response.json();
        if (data.detail?.includes('already')) {
          toast.info('You\'re already on our list! We\'ll be in touch soon.');
          setIsSubmitted(true);
        } else {
          throw new Error(data.detail || 'Failed to join waitlist');
        }
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0e1629 0%, #121d33 50%, #0e1629 100%)' }}
    >
      {/* Background imagery */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.06', filter: 'hue-rotate(200deg) saturate(0.5)',
      }} />
      
      {/* Radial glows */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(184, 35, 48, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 168, 75, 0.1) 0%, transparent 50%)',
      }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-navy-dark/80 z-0" />
      
      {/* Floating mystical symbols */}
      <FloatingSymbols />
      
      {/* Corner ornaments */}
      <ElaborateCorner className="absolute top-4 left-4 w-20 h-20 sm:w-28 sm:h-28" variant="gold" />
      <ElaborateCorner className="absolute top-4 right-4 w-20 h-20 sm:w-28 sm:h-28 rotate-90" variant="gold" />
      <ElaborateCorner className="absolute bottom-4 left-4 w-20 h-20 sm:w-28 sm:h-28 -rotate-90" variant="gold" />
      <ElaborateCorner className="absolute bottom-4 right-4 w-20 h-20 sm:w-28 sm:h-28 rotate-180" variant="gold" />
      
      {/* Edge decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 mt-4">
        <span className="text-gold/40 text-sm">✧</span>
        <span className="text-crimson/60 text-base">◆</span>
        <span className="text-gold/40 text-sm">✧</span>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 mb-4">
        <span className="text-gold/40 text-sm">✧</span>
        <span className="text-crimson/60 text-base">◆</span>
        <span className="text-gold/40 text-sm">✧</span>
      </div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 w-full max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: 'radial-gradient(circle, rgba(184, 35, 48, 0.4) 0%, rgba(212, 168, 75, 0.3) 50%, transparent 70%)' }} />
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png"
              alt="Where The Crowlands"
              className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto object-contain"
              style={{ filter: 'brightness(1.4) contrast(1.1) drop-shadow(0 0 40px rgba(212, 168, 75, 0.4))' }}
            />
          </motion.div>
        </div>
        
        {/* Title */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-3"
            style={{ textShadow: '0 4px 30px rgba(212, 168, 75, 0.5), 0 0 60px rgba(184, 35, 48, 0.3)' }}>
            Where The Crowlands
          </h1>
          <p className="font-cinzel text-base sm:text-lg text-cream/80 mb-2">
            Build Your Own Magic
          </p>
          <p className="font-montserrat text-xs sm:text-sm text-silver-mist/70 max-w-md mx-auto px-4">
            A toolkit for crafting personal rituals, guided by four generations of women who practiced in secret.
          </p>
        </motion.div>
        
        <GrandDivider />
        
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 opacity-30 blur-xl" style={{ background: 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.3) 0%, transparent 70%)' }} />
          
          {/* Triple border frame */}
          <div className="absolute inset-0 border-2 border-gold rounded-sm" />
          <div className="absolute inset-1.5 border border-crimson/50 rounded-sm" />
          <div className="absolute inset-3 border border-gold/30 rounded-sm" />
          
          {/* Background */}
          <div className="absolute inset-0 bg-navy-mid/80 backdrop-blur-md rounded-sm" />
          
          {/* Corner flourishes */}
          <ElaborateCorner className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
          <ElaborateCorner className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
          <ElaborateCorner className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="gold" />
          <ElaborateCorner className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="gold" />
          
          {/* Top ornament */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-navy-dark px-3 py-0.5 z-10">
            <span className="text-gold text-xs">✧</span>
            <span className="text-crimson text-sm glow-crimson">◆</span>
            <span className="text-gold text-lg glow-gold">☽</span>
            <span className="text-crimson text-sm glow-crimson">◆</span>
            <span className="text-gold text-xs">✧</span>
          </div>
          
          <div className="relative z-10 p-6 sm:p-8">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <Moon className="w-8 h-8 text-crimson-bright mx-auto mb-3" style={{ filter: 'drop-shadow(0 0 8px rgba(184, 35, 48, 0.4))' }} />
                  <h2 className="font-cinzel text-xl sm:text-2xl text-gold mb-2">Join the Early Access</h2>
                  <p className="font-montserrat text-xs sm:text-sm text-silver-mist/70">
                    Be the first to explore the grimoire when we launch.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-2">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What shall we call you?"
                      className="w-full bg-navy-dark/60 border-2 border-gold/40 focus:border-gold/70 focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat placeholder:text-silver-mist/40"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-navy-dark/60 border-2 border-gold/40 focus:border-gold/70 focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat placeholder:text-silver-mist/40"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 px-6 py-4 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-sm disabled:opacity-50"
                  >
                    <span className="absolute inset-0 border-2 border-gold rounded-sm" />
                    <span className="absolute inset-1 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                    <span className="absolute inset-1 bg-gradient-to-t from-black/30 to-transparent rounded-sm" />
                    <span className="relative text-cream flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>✧</motion.span>
                          Joining...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Claim Your Spot
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
                
                <p className="text-center font-montserrat text-xs text-silver-mist/50 mt-4">
                  No spam. Only magic. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crimson/20 border-2 border-gold/50 flex items-center justify-center">
                  <Check className="w-8 h-8 text-gold" />
                </div>
                <h2 className="font-cinzel text-2xl text-gold mb-3">You're In!</h2>
                <p className="font-montserrat text-sm text-silver-mist/80 mb-2">
                  Welcome to the Crowlands.
                </p>
                <p className="font-crimson text-base text-cream/70 italic">
                  "The magic begins when you decide it does."
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-gold/40 text-sm">
                  <span>☽</span>
                  <span>✧</span>
                  <span>🐦‍⬛</span>
                  <span>✧</span>
                  <span>☾</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Bottom tagline */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-crimson text-sm text-gold/70 italic">
            "Magic, math and science aren't such strange bedfellows."
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 text-silver-mist/40 text-xs">
            <span>☾</span>
            <span>Spells</span>
            <span>◆</span>
            <span>Wards</span>
            <span>◆</span>
            <span>Rituals</span>
            <span>☽</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EarlyAccessPage;

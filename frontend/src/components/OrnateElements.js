import React from 'react';

// Elaborate corner ornament
export const ElaborateCorner = ({ className, variant = 'gold' }) => {
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

// Grand section divider
export const GrandDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'from-navy-dark/30 via-crimson/50 to-navy-dark/30' : 'from-transparent via-gold/80 to-transparent';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="relative py-6 sm:py-8">
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
        <div className={`h-0.5 w-12 sm:w-24 bg-gradient-to-r ${lineColor}`} />
        <span className={`${accentColor} text-lg sm:text-xl glow-crimson`}>◆</span>
        
        <div className={`${symbolColor} flex items-center gap-2`}>
          {variant === 'moon' ? (
            <>
              <span className="text-lg sm:text-xl opacity-50">☾</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>☽</span>
              <span className="text-lg sm:text-xl opacity-50">☽</span>
            </>
          ) : variant === 'eye' ? (
            <>
              <span className="text-base sm:text-lg opacity-50">✦</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>👁</span>
              <span className="text-base sm:text-lg opacity-50">✦</span>
            </>
          ) : variant === 'crow' ? (
            <span className="text-2xl sm:text-3xl">🐦‍⬛</span>
          ) : variant === 'sparkle' ? (
            <>
              <span className="text-base sm:text-lg opacity-50">✦</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>✨</span>
              <span className="text-base sm:text-lg opacity-50">✦</span>
            </>
          ) : (
            <>
              <span className="text-base sm:text-lg opacity-60">❦</span>
              <span className={`text-xl sm:text-2xl ${light ? '' : 'glow-gold'}`}>❧</span>
              <span className="text-base sm:text-lg opacity-60">❦</span>
            </>
          )}
        </div>
        
        <span className={`${accentColor} text-lg sm:text-xl glow-crimson`}>◆</span>
        <div className={`h-0.5 w-12 sm:w-24 bg-gradient-to-l ${lineColor}`} />
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
      </div>
    </div>
  );
};

// Simple divider
export const MysticalDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'via-crimson/40' : 'via-gold/60';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="flex items-center justify-center gap-4 py-4 sm:py-6">
      <div className={`h-0.5 bg-gradient-to-r from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
      <div className={`flex items-center gap-2 ${symbolColor}`}>
        {variant === 'crow' ? (
          <span className="text-xl sm:text-2xl">🐦‍⬛</span>
        ) : variant === 'moon' ? (
          <>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
            <span className={`text-lg sm:text-xl ${light ? '' : 'glow-gold'}`}>☽</span>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
          </>
        ) : (
          <>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
            <span className={`text-base sm:text-lg ${light ? '' : 'glow-gold'}`}>❧</span>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
          </>
        )}
      </div>
      <div className={`h-0.5 bg-gradient-to-l from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
    </div>
  );
};

// Dark section wrapper with background imagery
export const DarkSection = ({ children, className = '', variant = 'default' }) => (
  <div className={`relative bg-navy-dark ${className}`}>
    {/* Background imagery */}
    <div className="absolute inset-0 z-0" style={{
      backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.05', filter: 'hue-rotate(200deg) saturate(0.5)',
    }} />
    {/* Radial glows */}
    <div className="absolute inset-0 z-0" style={{
      background: variant === 'warm' 
        ? 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 168, 75, 0.08) 0%, transparent 40%)'
        : 'radial-gradient(ellipse at 30% 50%, rgba(26, 45, 77, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(42, 65, 99, 0.2) 0%, transparent 40%)',
    }} />
    <div className="relative z-10">{children}</div>
  </div>
);

// Light parchment section wrapper
export const LightSection = ({ children, className = '' }) => (
  <div className={`relative ${className}`} style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 50%, #f5f0e6 100%)' }}>
    {/* Subtle pattern */}
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L45 15M30 30L15 45M30 30L45 45M30 30L15 15' stroke='%230e1629' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
    }} />
    {/* Ornate borders */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    <div className="absolute top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    
    {/* Corners */}
    <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16" variant="crimson" />
    <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-90" variant="crimson" />
    <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" variant="crimson" />
    <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-180" variant="crimson" />
    
    <div className="relative z-10">{children}</div>
  </div>
);

// Page header with ornate styling
export const PageHeader = ({ icon: Icon, title, subtitle, light = false }) => (
  <div className={`text-center mb-6 sm:mb-8 ${light ? 'text-navy-dark' : ''}`}>
    {Icon && <Icon className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4 ${light ? 'text-crimson' : 'text-crimson-bright'}`} 
      style={{ filter: light ? 'none' : 'drop-shadow(0 0 10px rgba(184, 35, 48, 0.4))' }} />}
    <h1 className={`font-italiana text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 ${light ? 'text-crimson' : 'text-gold-light'}`}
      style={{ textShadow: light ? '0 2px 10px rgba(184, 35, 48, 0.2)' : '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
      {title}
    </h1>
    {subtitle && (
      <p className={`font-montserrat text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2 ${light ? 'text-navy-dark/70' : 'text-silver-mist/80'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// Ornate card frame
export const OrnateCard = ({ children, className = '', hover = true }) => (
  <div className={`relative ${hover ? 'group' : ''} ${className}`}>
    <div className="absolute inset-0 border-2 border-gold/40 rounded-lg group-hover:border-gold/60 transition-all duration-300" />
    <div className="absolute inset-1.5 border border-crimson/20 rounded-md group-hover:border-crimson/40 transition-all duration-300" />
    <div className="absolute inset-0 bg-navy-mid/60 rounded-lg backdrop-blur-sm" />
    
    {/* Corner diamonds */}
    <span className="absolute -top-1.5 -left-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -top-1.5 -right-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -left-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -right-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    
    <div className="relative z-10 p-4 sm:p-6">{children}</div>
  </div>
);

// Light ornate card for parchment sections
export const LightOrnateCard = ({ children, className = '', hover = true }) => (
  <div className={`relative ${hover ? 'group' : ''} ${className}`}>
    <div className="absolute inset-0 border-2 border-crimson/30 rounded-lg group-hover:border-crimson/50 transition-all duration-300" />
    <div className="absolute inset-1.5 border border-gold/30 rounded-md group-hover:border-gold/50 transition-all duration-300" />
    <div className="absolute inset-0 bg-cream/80 rounded-lg backdrop-blur-sm" />
    
    {/* Corner diamonds */}
    <span className="absolute -top-1.5 -left-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -top-1.5 -right-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -left-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -right-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    
    <div className="relative z-10 p-4 sm:p-6">{children}</div>
  </div>
);

export default {
  ElaborateCorner,
  GrandDivider,
  MysticalDivider,
  DarkSection,
  LightSection,
  PageHeader,
  OrnateCard,
  LightOrnateCard,
};

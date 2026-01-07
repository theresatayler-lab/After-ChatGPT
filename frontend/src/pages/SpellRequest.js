import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { GrimoirePage } from '../components/GrimoirePage';
import { aiAPI, subscriptionAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { SpellLimitBanner } from '../components/UpgradePrompt';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, OrnateCard } from '../components/OrnateElements';
import { Sparkles, BookOpen, Feather, ChevronDown, Loader2, User, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const SpellRequest = ({ selectedArchetype: propArchetype }) => {
  const [problem, setProblem] = useState('');
  const [spellResult, setSpellResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeArchetype, setActiveArchetype] = useState(propArchetype || getCurrentArchetype());
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [generateImage, setGenerateImage] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const videoSectionRef = React.useRef(null);

  const currentGuide = activeArchetype ? getArchetypeById(activeArchetype) : null;

  // Load subscription status
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
          console.log('Subscription status loaded:', status);
        } catch (error) {
          console.error('Failed to load subscription status:', error);
        }
      } else {
        console.log('No token - anonymous user');
      }
    };
    loadSubscriptionStatus();
  }, []);

  const handleArchetypeChange = (archetypeId) => {
    setActiveArchetype(archetypeId);
    setCurrentArchetype(archetypeId);
    setShowArchetypeSelector(false);
    if (archetypeId) {
      const guide = getArchetypeById(archetypeId);
      toast.success(`${guide.shortName} is now your guide`);
    } else {
      toast.info('Continuing without a guide');
    }
  };

  const handleGenerateSpell = async () => {
    if (!problem.trim()) {
      toast.error('Please describe what you need help with');
      return;
    }

    setLoading(true);
    setSpellResult(null);
    
    // Auto-scroll to video section after a brief delay
    setTimeout(() => {
      if (videoSectionRef.current) {
        videoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
    
    try {
      const response = await aiAPI.generateSpell(problem, activeArchetype, generateImage);
      setSpellResult(response);
      toast.success('Your spell has been crafted!');
      
      // Scroll to top to show the spell result
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update subscription status if limits changed
      if (response.limit_info) {
        const token = localStorage.getItem('token');
        if (token) {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
          
          // Warn if nearing limit
          if (status.spells_remaining === 1) {
            toast.warning('This was your second-to-last free spell! Upgrade for unlimited access.');
          } else if (status.spells_remaining === 0) {
            toast.error('You\'ve used all 3 free spells. Upgrade to Pro for unlimited spell generation!');
          }
        }
      }
    } catch (error) {
      // Check if it's a limit error
      if (error.response?.status === 403 && error.response?.data?.detail?.error === 'spell_limit_reached') {
        toast.error(error.response.data.detail.message, { duration: 6000 });
      } else {
        toast.error('Failed to generate spell. Please try again.');
      }
      console.error('Spell generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSpell = () => {
    setProblem('');
    setSpellResult(null);
  };

  // Get example problems based on current guide
  const getExampleProblems = () => {
    if (currentGuide) {
      return currentGuide.samplePrompts;
    }
    return [
      'Need protection during a difficult conversation',
      'Looking to attract new opportunities in my career',
      'Want to break a pattern of negative thinking',
      'Seeking clarity about a major life decision',
      'Need courage to pursue a creative project',
    ];
  };

  // If we have a spell result, show the grimoire page
  if (spellResult && spellResult.spell) {
    return (
      <DarkSection className="min-h-screen py-16 sm:py-24 px-4 sm:px-6" variant="warm">
        <div className="max-w-4xl mx-auto">
          <GrimoirePage 
            spell={spellResult.spell}
            archetype={spellResult.archetype}
            imageBase64={spellResult.image_base64}
            onNewSpell={handleNewSpell}
          />
        </div>
      </DarkSection>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        {/* Corner ornaments */}
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Spell Limit Banner for Free Users */}
          {subscriptionStatus && subscriptionStatus.subscription_tier === 'free' && (
            <SpellLimitBanner 
              remaining={subscriptionStatus.spells_remaining} 
              limit={subscriptionStatus.spell_limit}
            />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={Sparkles}
              title="Build Your Ritual"
              subtitle={currentGuide 
                ? `Guided by ${currentGuide.shortName}, ${currentGuide.title.toLowerCase()}`
                : 'Describe your need. Get a practical formula based on tested patterns. Adapt it as you go.'}
            />
          </motion.div>
          
          <GrandDivider variant="sparkle" />

          {/* Guide Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative z-50"
          >
            <OrnateCard hover={false}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {currentGuide ? (
                    <>
                      <div 
                        className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold/40"
                        style={{ backgroundColor: '#e8e4dc' }}
                      >
                        {currentGuide.image ? (
                          <img 
                            src={currentGuide.image} 
                            alt={currentGuide.shortName}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '50% 20%' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {currentGuide.birdEmoji}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-cinzel text-sm text-gold/80">Your Guide</p>
                        <p className="font-italiana text-xl text-gold-light">{currentGuide.shortName}</p>
                        <p className="font-montserrat text-xs text-silver-mist/70">{currentGuide.title}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-navy-light/50 flex items-center justify-center border border-gold/30">
                        <User className="w-6 h-6 text-gold/60" />
                      </div>
                      <div>
                        <p className="font-cinzel text-sm text-gold/80">No Guide Selected</p>
                        <p className="font-montserrat text-xs text-silver-mist/70">Using neutral Crowlands guidance</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowArchetypeSelector(!showArchetypeSelector)}
                    className="px-4 py-2 bg-navy-mid border border-gold/40 rounded-sm font-montserrat text-xs tracking-wider text-gold/80 hover:border-gold/60 hover:text-gold transition-all flex items-center gap-2"
                    id="change-guide-button"
                  >
                    <span>Change Guide</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showArchetypeSelector ? 'rotate-180' : ''}`} />
                  </button>
                
                {showArchetypeSelector && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-card border-2 border-primary/30 rounded-sm shadow-2xl"
                    style={{ 
                      maxHeight: '600px', 
                      overflowY: 'auto',
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      zIndex: 99999,
                      position: 'absolute'
                    }}
                  >
                    <button
                      onClick={() => handleArchetypeChange(null)}
                      className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border flex items-center gap-3 ${!activeArchetype ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      style={{ display: 'flex', minHeight: '60px' }}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="font-medium">No Guide</span>
                        <p className="text-xs text-muted-foreground">Neutral Crowlands guidance</p>
                      </div>
                    </button>
                    {ARCHETYPES.map((archetype) => (
                      <button
                        key={archetype.id}
                        onClick={() => handleArchetypeChange(archetype.id)}
                        className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border last:border-b-0 flex items-center gap-3 ${activeArchetype === archetype.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                        style={{ display: 'flex', minHeight: '70px' }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border"
                          style={{ backgroundColor: '#D8CBB3' }}
                        >
                          {archetype.image ? (
                            <img 
                              src={archetype.image} 
                              alt={archetype.shortName}
                              className="w-full h-full object-cover"
                              style={{ mixBlendMode: 'multiply', objectPosition: '50% 20%' }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {archetype.birdEmoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium flex items-center gap-1">
                            {archetype.shortName}
                            <span className="text-sm">{archetype.birdEmoji}</span>
                          </span>
                          <p className="text-xs text-muted-foreground truncate">{archetype.title}</p>
                        </div>
                      </button>
                    ))}
                    <Link
                      to="/guides"
                      className="block w-full text-center px-4 py-2 font-montserrat text-xs text-primary hover:bg-primary/5 transition-all border-t border-border"
                    >
                      Meet All Guides →
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {currentGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gold/20"
              >
                <p className="font-crimson text-sm text-gold/80 italic">
                  {currentGuide.empowermentMessage}
                </p>
              </motion.div>
            )}
          </OrnateCard>
        </motion.div>
        </div>
      </DarkSection>

      {/* Light Section - Input Form */}
      <LightSection className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <GrandDivider variant="moon" light />

          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <div className="absolute inset-0 border-2 border-crimson/30 rounded-lg group-hover:border-crimson/50 transition-all" />
                <div className="absolute inset-1.5 border border-gold/30 rounded-md" />
                <div className="absolute inset-0 bg-cream/90 rounded-lg" />
                
                <div className="relative z-10 p-4 sm:p-6" data-testid="spell-request-input-card">
                  <h3 className="font-cinzel text-lg sm:text-xl text-crimson mb-4">
                    {currentGuide ? `Ask ${currentGuide.shortName}` : 'What do you need?'}
                  </h3>
                  
                  <div className="mb-6">
                    <label className="block font-montserrat text-sm text-navy-dark/70 uppercase tracking-wider mb-2">
                      Describe your intention
                    </label>
                    <textarea
                      data-testid="spell-problem-input"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder={currentGuide 
                        ? `Tell ${currentGuide.shortName} what you need help with...`
                        : "I need help with..."}
                      rows={6}
                      className="w-full bg-white/80 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat placeholder:text-navy-dark/40"
                    />
                  </div>

                  {/* Image Generation Toggle */}
                  <div className="mb-6 flex items-center justify-between p-3 bg-gold/10 rounded-sm border border-gold/30">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-crimson" />
                      <span className="font-montserrat text-sm text-navy-dark">Generate spell image</span>
                    </div>
                    <button
                      onClick={() => setGenerateImage(!generateImage)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        generateImage ? 'bg-crimson' : 'bg-navy-dark/30'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          generateImage ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleGenerateSpell}
                    data-testid="generate-spell-button"
                    disabled={loading || !problem.trim()}
                    className="w-full px-6 py-3 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                    <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                    <span className="relative text-cream flex items-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{currentGuide ? `${currentGuide.shortName} is crafting...` : 'Crafting your spell...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Spell</span>
                        </>
                      )}
                    </span>
                  </button>

                  <div className="mt-6">
                    <p className="font-montserrat text-xs text-navy-dark/60 uppercase tracking-wider mb-3">
                      {currentGuide ? `${currentGuide.shortName}'s Specialties` : 'Example Needs'}
                    </p>
                    <div className="space-y-2">
                      {getExampleProblems().map((example, idx) => (
                        <button
                          key={idx}
                          data-testid={`example-problem-${idx}`}
                          onClick={() => setProblem(example)}
                          className="w-full text-left px-3 py-2 bg-white/60 border border-gold/30 rounded-sm font-montserrat text-sm text-navy-dark hover:border-crimson/40 hover:bg-gold/10 transition-all"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }

          {/* Preview Section */}
          <div className="lg:col-span-3" ref={videoSectionRef}>
            <GlassCard hover={false} testId="spell-response-card">
              <h3 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">
                {currentGuide ? `Spell by ${currentGuide.shortName}` : 'Your Custom Spell'}
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] sm:h-[500px] text-center">
                  {/* Show guide video if available */}
                  {currentGuide && currentGuide.video ? (
                    <div className="w-full max-w-md mb-6">
                      <div className="relative rounded-sm overflow-hidden border-2 border-primary/30 shadow-xl">
                        <video
                          src={currentGuide.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto"
                          style={{ maxHeight: '350px', objectFit: 'cover' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  )}
                  
                  <p className="font-montserrat text-muted-foreground mb-2">
                    {currentGuide 
                      ? `${currentGuide.shortName} is crafting your ritual...`
                      : 'Crafting your spell...'}
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground/70 mb-4">
                    This may take a moment as we research historical sources and craft your personalized ritual.
                  </p>
                  {generateImage && (
                    <p className="font-crimson text-sm text-accent italic">
                      ✦ Generating a custom image for your spell...
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <BookOpen className="w-16 h-16 text-primary/30 mb-4" />
                  <p className="font-montserrat text-muted-foreground mb-2">
                    Your grimoire page will appear here
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground/70 max-w-md mb-4">
                    {currentGuide 
                      ? `${currentGuide.shortName} will create a complete ritual with materials, steps, historical context, and beautiful imagery.`
                      : 'Each spell includes materials, step-by-step instructions, historical sources, and optional custom imagery.'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Materials list</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Ritual steps</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Spoken words</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Historical sources</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Custom image</span>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Historical Context */}
        <div className="mt-12">
          <GlassCard hover={false}>
            <div className="flex items-start gap-4">
              <Feather className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-cinzel text-lg text-secondary mb-2">Magic as Science</h4>
                <p className="font-montserrat text-sm text-foreground/80 leading-relaxed mb-3">
                  These formulas aren&apos;t mystical secrets—they&apos;re patterns that people like Gardner, Fortune, and Crowley 
                  tested and documented. They work through focused intention, repetition, and symbolic frameworks. 
                  Like any science, you don&apos;t have to believe in it. You just practice it and see what happens.
                </p>
                <p className="font-montserrat text-sm text-accent italic">
                  You have the power. These are just formulas others used. Adapt them. Break them. Build your own.
                  No gatekeepers necessary.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

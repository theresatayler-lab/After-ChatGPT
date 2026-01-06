import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { WaitlistForm } from '../components/WaitlistForm';

// Ornate corner SVG component
const OrnateCorner = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0,30 Q0,0 30,0" />
    <path d="M0,20 Q0,0 20,0" opacity="0.5" />
    <path d="M5,35 Q5,5 35,5" opacity="0.3" />
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6" />
  </svg>
);

// Mystical section divider
const MysticalDivider = ({ variant = 'default' }) => (
  <div className="flex items-center justify-center gap-4 py-6">
    <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/50 flex-1 max-w-32" />
    <div className="flex items-center gap-2 text-primary/50">
      {variant === 'crow' ? (
        <span className="text-2xl">🐦‍⬛</span>
      ) : variant === 'moon' ? (
        <>
          <span className="text-sm">✦</span>
          <span className="text-xl">☽</span>
          <span className="text-sm">✦</span>
        </>
      ) : (
        <>
          <span className="text-xs">◆</span>
          <span className="text-lg">❧</span>
          <span className="text-xs">◆</span>
        </>
      )}
    </div>
    <div className="h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/50 flex-1 max-w-32" />
  </div>
);

export const Home = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #1a1512 0%, #2d2319 50%, #1a1512 100%)',
      }}
    >
      {/* Parchment texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
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
            opacity: '0.25',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/90 via-[#1a1512]/60 to-[#1a1512] z-0" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#1a1512]/80 z-0" />
        
        {/* Decorative corner ornaments */}
        <OrnateCorner className="absolute top-8 left-8 w-16 h-16 text-primary/20 rotate-0" />
        <OrnateCorner className="absolute top-8 right-8 w-16 h-16 text-primary/20 rotate-90" />
        <OrnateCorner className="absolute bottom-8 left-8 w-16 h-16 text-primary/20 -rotate-90" />
        <OrnateCorner className="absolute bottom-8 right-8 w-16 h-16 text-primary/20 rotate-180" />
        
        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 flex flex-col items-center">
          {/* Ornate Logo with glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div 
              className="absolute inset-0 blur-2xl opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(139, 90, 43, 0.4) 0%, transparent 70%)' }}
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png"
              alt="Where The Crowlands"
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-4 sm:mb-6 object-contain drop-shadow-2xl"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </motion.div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 
                className="font-italiana text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-100 mb-4 sm:mb-5 tracking-tight leading-none"
                style={{ textShadow: '0 4px 20px rgba(139, 90, 43, 0.5)' }}
              >
                Where The Crowlands
              </h1>
              
              <p 
                className="font-cinzel text-lg sm:text-xl md:text-2xl text-amber-200/80 mb-6 sm:mb-8 tracking-wide"
                style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}
              >
                Magic, math and science aren't such strange bedfellows.
              </p>
              
              <MysticalDivider variant="moon" />
              
              <div className="font-crimson text-sm sm:text-base md:text-lg text-amber-100/80 leading-relaxed max-w-3xl mx-auto px-4 space-y-4">
                <p className="first-letter:text-4xl first-letter:font-italiana first-letter:text-amber-400 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                  Where the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the 
                  Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers 
                  of forbidden knowledge, to those closer to my own heart and timeline, the table-tappers and spiritualists 
                  revealing the hidden world, Churchill's secret army of Cockney rebels defending the home front. The druids, 
                  templers, occultists, astrologers, hermetic philosophers, "witches" midwives and alchemists before them…
                </p>
              </div>

              {/* Waitlist Form - Styled with ornate border */}
              <div className="mt-10 mb-10">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-0 border border-amber-500/20 rounded-lg" />
                  <div className="absolute inset-1 border border-amber-500/10 rounded-md" />
                  <div className="relative p-1">
                    <WaitlistForm source="homepage" />
                  </div>
                </div>
              </div>
              
              <MysticalDivider variant="crow" />
              
              <div className="font-crimson text-sm sm:text-base md:text-lg text-amber-100/80 leading-relaxed max-w-3xl mx-auto px-4 space-y-4">
                <p>
                  The magic we've abandoned isn't "woo woo"—it's intention, craft, commitment, and ritual. It is that intention paired with action can change history. Whether our ancestors named it or not, that power is still yours to work with. Inspired by real people—my family—and grounded in plenty of creative lore, Where the Crowlands offers a fun, practical way to bring alchemy, magic, and beauty into your life.
                </p>
                
                <p className="text-amber-300/90 italic border-l-2 border-amber-500/30 pl-4">
                  While rooted primarily in British history and mysticism, we plan to expand, honouring all cultures—every 
                  tradition has drawn from what lies beneath the veil. As uncertainty and shifting world powers challenge 
                  our sense of and inherent belief system about what constitutes light and dark, it's time to bring a little magic back ;)
                </p>
              </div>

              <MysticalDivider />
              
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
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-sm" />
                  <div className="absolute inset-px bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-sm" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-sm" />
                  <span className="relative flex items-center gap-2 font-montserrat text-amber-100 tracking-widest uppercase text-sm">
                    <Sparkles className="w-4 h-4" />
                    Begin Your Journey
                  </span>
                </Link>
                
                <Link
                  to="/guides"
                  className="group relative px-8 py-4 border border-amber-500/30 hover:border-amber-500/50 rounded-sm transition-all"
                >
                  <span className="flex items-center gap-2 font-montserrat text-amber-200/80 tracking-widest uppercase text-sm group-hover:text-amber-100 transition-colors">
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
            className="font-italiana text-3xl md:text-4xl text-amber-100 text-center mb-12"
            style={{ textShadow: '0 2px 10px rgba(139, 90, 43, 0.4)' }}
          >
            Your Path Awaits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'Craft Your Spells', desc: 'Generate personalized rituals guided by four ancestral archetypes' },
              { icon: BookOpen, title: 'Build Your Grimoire', desc: 'Save and organize your magical workings in your personal collection' },
              { icon: Moon, title: 'Explore the Archives', desc: 'Discover historical practices, deities, and sacred sites' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 border border-amber-500/20 rounded-lg group-hover:border-amber-500/40 transition-colors" />
                <div className="absolute inset-2 border border-amber-500/10 rounded-md" />
                <div className="relative p-8 text-center">
                  <feature.icon className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl text-amber-100 mb-3">{feature.title}</h3>
                  <p className="font-crimson text-amber-100/70">{feature.desc}</p>
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
      {/* Art Deco Decorative Divider */}
      <DecorativeDivider symbol="🌙" />

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-deep-blue/40"></div>
            <span className="text-deep-blue/60 text-lg">✦</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-deep-blue/40"></div>
          </div>
          <h2 className="font-italiana text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 tracking-wide">
            Explore the Archive
          </h2>
          <p className="font-crimson text-sm sm:text-base text-deep-blue/70 italic">
            Four centuries of tested formulas at your fingertips
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link to="/spell-request" data-testid="section-spell-request">
            <GlassCard testId="card-spell-request">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/flkqjy53_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_0.png"
                alt="Spell Request"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Build Your Spell</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Describe your need, get a practical formula based on tested patterns
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/deities" data-testid="section-deities">
            <GlassCard testId="card-deities">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/1sqgo2ps_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_3.png"
                alt="Deities"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Deities</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Archetypes and energies to work with—Hecate, Morrigan, Cerridwen
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/figures" data-testid="section-figures">
            <GlassCard testId="card-figures">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/nngy4wmz_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_3.png"
                alt="Historical Figures"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">The Experimenters</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Gardner, Fortune, Crowley—they tested formulas so you can adapt them
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/sites" data-testid="section-sites">
            <GlassCard testId="card-sites">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/u9u50jrz_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_2.png"
                alt="Sacred Sites"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Power Places</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Sacred geometry in the land—Stonehenge, Glastonbury, and beyond
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
      
      {/* Decorative Divider - Larger Sacred Geometry */}
      <div className="flex justify-center py-16">
        <img 
          src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/u9u50jrz_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_2.png"
          alt="Decorative crow in triangle"
          className="h-40 opacity-70"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* About Section */}
      <div className="relative bg-card/30 py-12 sm:py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-engraving-coral bg-cover bg-center"
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-italiana text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 sm:mb-8">Your Power Doesn't Need Permission</h2>
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed mb-4 sm:mb-6">
            Magic isn't mystical—it's intentional effort combined with patterns, formulas, and sacred geometry. 
            Like alchemy before it became chemistry, these are frameworks for focusing will and creating change.
            You don't have to believe in magic for it to work. You just have to practice it.
          </p>
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed mb-4 sm:mb-6">
            This toolkit draws from documented practices (1910-1945) not because they're "ancient secrets," but because 
            they're tested formulas. Gardner, Fortune, and Crowley weren't mystics—they were experimenters synthesizing 
            patterns that produced results. Now you can do the same, without gatekeepers or expensive services.
          </p>
          <p className="font-montserrat text-xs sm:text-sm text-accent italic">
            You don't need to buy empowerment. You already have your intuition, your will, and your ability to create ritual.
            This archive just shows you the formulas others have used—adapt them, break them, build your own.
          </p>
        </div>
      </div>
    </div>
  );
};
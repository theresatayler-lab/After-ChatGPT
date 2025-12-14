import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1643324896137-f0928e76202a?crop=entropy&cs=srgb&fm=jpg&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-italiana text-5xl md:text-7xl text-primary mb-6 tracking-tight leading-none">
              The Bloomsbury Coven
            </h1>
            <p className="font-cinzel text-xl md:text-2xl text-bloomsbury-rose mb-4">
              A Journey Through Occult Revival
            </p>
            <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Explore the mystical renaissance of 1910-1945. Discover the deities who guided seekers,
              the figures who shaped modern witchcraft, and the sacred sites that hold ancient power.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/deities"
                data-testid="hero-explore-deities"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all duration-300 border border-primary/50 glow-effect"
              >
                Explore Deities
              </Link>
              <Link
                to="/ai-chat"
                data-testid="hero-ai-research"
                className="px-8 py-3 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/10 transition-all duration-300"
              >
                AI Research Assistant
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-italiana text-3xl md:text-5xl text-center text-foreground mb-16 tracking-wide"
        >
          Realms of Knowledge
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/deities" data-testid="section-deities">
            <GlassCard testId="card-deities">
              <Moon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-bloomsbury-rose mb-2">Deities</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Hecate, The Morrigan, Cerridwen and other divine figures of the period
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/figures" data-testid="section-figures">
            <GlassCard testId="card-figures">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-bloomsbury-rose mb-2">Historical Figures</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Gardner, Fortune, Crowley and pioneers of modern occultism
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/sites" data-testid="section-sites">
            <GlassCard testId="card-sites">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-bloomsbury-rose mb-2">Sacred Sites</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Stonehenge, Glastonbury and power places across Europe
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/rituals" data-testid="section-rituals">
            <GlassCard testId="card-rituals">
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-bloomsbury-rose mb-2">Rituals</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Documented practices and ceremonies from the era
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
      
      {/* About Section */}
      <div className="bg-card/30 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-italiana text-3xl md:text-5xl text-foreground mb-8">The Era of Mystical Awakening</h2>
          <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
            Between the World Wars, a profound spiritual renaissance emerged from the ashes of conflict.
            In drawing rooms and lodges across Britain and Europe, seekers revived ancient practices,
            founding traditions that would shape modern witchcraft and paganism.
          </p>
          <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed">
            This archive preserves the documented history of that extraordinary period—the deities who
            inspired devotion, the figures who dared to practice openly, and the sacred sites that
            connected practitioners to the old ways.
          </p>
        </div>
      </div>
    </div>
  );
};
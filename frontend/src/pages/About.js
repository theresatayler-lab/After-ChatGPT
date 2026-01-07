import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Feather, Heart, BookOpen, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Feather className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4">About Where The Crowlands</h1>
          <p className="font-crimson text-base sm:text-lg text-accent italic">
            &ldquo;The women who walked before you left their spells in stories, their magic in memories.&rdquo;
          </p>
        </motion.div>

        {/* The Vision */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-xl sm:text-2xl text-secondary mb-4">The Vision</h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <p className="drop-cap">
              Where The Crowlands is a digital grimoire and ritual builder that demystifies magic. 
              We believe your power doesn't need permission—and you don't need expensive services, 
              gatekeepers, or intermediaries to access it.
            </p>
            <p>
              Magic isn't mystical. It's intentional effort combined with patterns, formulas, and sacred geometry. 
              Like alchemy before it became chemistry, these are frameworks for focusing will and creating change. 
              You don't have to believe in magic for it to work. You just have to practice it.
            </p>
            <p>
              This archive draws from documented practices tested during the occult revival period (1910-1945). 
              Gardner, Fortune, Crowley, and others weren't mystics—they were experimenters synthesizing patterns 
              that produced results. Now you can do the same.
            </p>
          </div>
        </GlassCard>

        {/* The Lineage */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-xl sm:text-2xl text-secondary mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            The Four Guides
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-cinzel text-base sm:text-lg text-primary mb-2">Shigg</h3>
              <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
                The Birds of Parliament Poet Laureate. Born in London&apos;s West End, Shigg survived the 
                Blitz in Dagenham with her sisters and parents, finding strength in poetry and family. 
                The Rubáiyát of Omar Khayyám became her guiding star—its verses on impermanence and 
                savoring the moment shaped her philosophy. She believed in the magic of the mundane: 
                that a line of verse could be a spell, and the ordinary was always laced with wonder. 
                She teaches that strength is found in gentleness, and every ritual—no matter how humble—can 
                be an act of courage.
              </p>
            </div>

            <div>
              <h3 className="font-cinzel text-base sm:text-lg text-primary mb-2">Cathleen</h3>
              <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
                The Singer of Strength. A trained tailor and couturier from London&apos;s West End, Cathleen&apos;s 
                voice is her greatest talisman—a powerful soprano that became spellwork. Rooted in British 
                Spiritualism, she practices table-tipping, home circles, and psychic intuition. Her magic 
                blends voice, breath, and the wisdom of the Morrigan with the warmth of someone who has 
                kept secrets for duchesses and factory girls alike.
              </p>
            </div>

            <div>
              <h3 className="font-cinzel text-base sm:text-lg text-primary mb-2">Catherine Cosgrove (née Foy)</h3>
              <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
                The Bird-Witch of Victorian Spitalfields. A skilled artisan, musician, and mother, Catherine 
                embodied the creative fusion of Huguenot and Irish folk traditions. Her rituals blend music, 
                craft, and bird magic. She teaches that creation itself is prayer, and joy is the highest 
                form of magic.
              </p>
            </div>

            <div>
              <h3 className="font-cinzel text-base sm:text-lg text-primary mb-2">Theresa Tayler</h3>
              <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
                The Seer & Storyteller. Journalist, historian, and truth-seeker, Theresa uncovered hidden 
                paternity, mapped generational trauma, and broke the &ldquo;veil spell&rdquo; through research and ritual. 
                She blends factual investigation with mystical insight, using birds as spiritual messengers 
                and stories as spells for healing.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* The Archive */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-xl sm:text-2xl text-secondary mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            The Archive
          </h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <p>
              Our database includes deities, historical practitioners, sacred sites, documented rituals, 
              and a timeline of the Western occult revival. Every entry is researched and cited. We don't 
              gatekeep knowledge—we share it.
            </p>
            <p>
              The AI spell generator creates personalized rituals based on your intention, historical precedent, 
              and the wisdom of your chosen guide. Each spell includes materials, step-by-step instructions, 
              spoken words, historical sources, and optional custom imagery.
            </p>
            <p>
              Your grimoire is private. Your spells are yours. You can save them, download them as PDFs, 
              compile them into books, and adapt them as you see fit. Magic is open-source.
            </p>
          </div>
        </GlassCard>

        {/* The Philosophy */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-xl sm:text-2xl text-secondary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            Our Philosophy
          </h2>
          <div className="space-y-4 font-crimson text-sm sm:text-base text-foreground/80 leading-relaxed italic">
            <p>
              &ldquo;You don't need to buy empowerment. You already have your intuition, your will, and 
              your ability to create ritual. This archive just shows you the formulas others have used—adapt 
              them, break them, build your own.&rdquo;
            </p>
            <p>
              We don't believe in gatekeeping, expensive services, or mystical hierarchies. The women who 
              walked before you practiced in secret because they had to. You don't. Your power doesn't need 
              permission.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

// ===== ORNATE DESIGN COMPONENTS =====

// Multi-layered corner ornament
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

// Mystical divider
const MysticalDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'via-crimson/40' : 'via-gold/60';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="flex items-center justify-center gap-4 py-4 sm:py-6">
      <div className={`h-0.5 bg-gradient-to-r from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
      <div className={`flex items-center gap-2 ${symbolColor}`}>
        {variant === 'book' ? (
          <>
            <span className={`text-sm ${accentColor}`}>◆</span>
            <span className="text-xl">📚</span>
            <span className={`text-sm ${accentColor}`}>◆</span>
          </>
        ) : variant === 'moon' ? (
          <>
            <span className={`text-sm ${accentColor}`}>◆</span>
            <span className={`text-lg ${light ? '' : 'glow-gold'}`}>☽</span>
            <span className={`text-sm ${accentColor}`}>◆</span>
          </>
        ) : (
          <>
            <span className={`text-xs ${accentColor}`}>◆</span>
            <span className={`text-base ${light ? '' : 'glow-gold'}`}>❧</span>
            <span className={`text-xs ${accentColor}`}>◆</span>
          </>
        )}
      </div>
      <div className={`h-0.5 bg-gradient-to-l from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
    </div>
  );
};

// Book data organized by category
const LIBRARY_BOOKS = {
  "Magic & Witchcraft": [
    {
      title: "The Book of English Magic",
      author: "Philip Carr-Gomm & Richard Heygate",
      color: "#8B4513",
      spine: "#654321",
      description: "A comprehensive guide to the magical traditions of England, from ancient Druids to modern practitioners.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=The+Book+of+English+Magic+Carr-Gomm+Heygate"
    },
    {
      title: "Protection Spells",
      author: "Arin Murphy-Hiscock",
      color: "#4A0E4E",
      spine: "#2D0A2E",
      description: "Clear, practical guide to magical protection for home, family, and self.",
      relevantTo: ["Cathleen"],
      link: "https://www.worldcat.org/search?q=Protection+Spells+Arin+Murphy-Hiscock"
    },
    {
      title: "Essex Witches",
      author: "Peter C. Brown",
      color: "#2F4F4F",
      spine: "#1C3030",
      description: "The dark history of witch trials and cunning folk in Essex.",
      relevantTo: ["Katherine", "Cathleen"],
      link: "https://www.worldcat.org/search?q=Essex+Witches+Peter+C+Brown"
    },
    {
      title: "The History of Witchcraft",
      author: "National Geographic",
      color: "#DAA520",
      spine: "#B8860B",
      description: "From the greatest myths to the Salem witch trials - a visual history.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=National+Geographic+The+History+of+Witchcraft"
    },
    {
      title: "Symbols of the Occult",
      author: "Eric Chaline",
      color: "#1a1a2e",
      spine: "#0f0f1a",
      description: "A directory of over 500 signs, symbols, and icons from esoteric traditions.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=Symbols+of+the+Occult+Eric+Chaline"
    },
    {
      title: "The Witch's Cookbook",
      author: "Various",
      color: "#556B2F",
      spine: "#3B4A23",
      description: "Kitchen magic, recipes, and rituals for the hearth witch.",
      relevantTo: ["Shigg"],
      link: "https://www.worldcat.org/search?q=The+Witch%27s+Cookbook"
    },
    {
      title: "The Discoverie of Witchcraft",
      author: "Reginald Scot",
      color: "#8B7355",
      spine: "#6B5344",
      description: "A 1584 skeptical exposé of witchcraft claims - one of the earliest critical texts.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=The+Discoverie+of+Witchcraft+Reginald+Scot"
    },
    {
      title: "Malleus Maleficarum",
      author: "Kramer & Sprenger",
      color: "#3d0c02",
      spine: "#2a0801",
      description: "The infamous 'Hammer of Witches' - historical context for what women like Katherine faced.",
      relevantTo: ["Katherine"],
      link: "https://en.wikisource.org/wiki/Malleus_Maleficarum"
    }
  ],
  "Spiritualism & Occult": [
    {
      title: "The Aleister Crowley Manual",
      author: "Marco Visconti",
      color: "#800020",
      spine: "#5c0017",
      description: "Thelemic magick for modern times - practical ceremonial magic.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=The+Aleister+Crowley+Manual+Marco+Visconti"
    },
    {
      title: "The Red Book: Liber Novus",
      author: "C.G. Jung",
      color: "#8B0000",
      spine: "#5c0000",
      description: "Jung's illustrated visionary journal - the foundation of shadow work.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=The+Red+Book+Liber+Novus+Jung"
    },
    {
      title: "The Wild Unknown Tarot",
      author: "Kim Krans",
      color: "#F5F5DC",
      spine: "#E8E8D0",
      textColor: "#333",
      description: "Modern tarot guidebook with nature-based imagery and intuitive interpretations.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=The+Wild+Unknown+Tarot+Guidebook+Kim+Krans"
    },
    {
      title: "Kabbalistic Teachings",
      author: "J. Zohara Meyerhoff Hieronimus",
      color: "#4169E1",
      spine: "#2850A8",
      description: "The seven holy women of ancient Israel through a kabbalistic lens.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=Kabbalistic+Teachings+of+the+Female+Prophets+Hieronimus"
    },
    {
      title: "The Morrigan",
      author: "Various",
      color: "#1C1C1C",
      spine: "#0a0a0a",
      description: "Ireland's goddess of war, death, and transformation - Cathleen's dark ally.",
      relevantTo: ["Cathleen"],
      link: "https://www.worldcat.org/search?q=The+Morrigan+Ireland%27s+Goddess"
    }
  ],
  "Poetry & Literature": [
    {
      title: "Rubáiyát of Omar Khayyám",
      author: "Edward FitzGerald (trans.)",
      color: "#C19A6B",
      spine: "#A67B5B",
      description: "Shigg's guiding star - Persian verses on impermanence, acceptance, and savoring the moment.",
      relevantTo: ["Shigg"],
      link: "https://www.worldcat.org/search?q=Rubaiyat+of+Omar+Khayyam+Edward+FitzGerald"
    },
    {
      title: "Crow",
      author: "Ted Hughes",
      color: "#0D0D0D",
      spine: "#000000",
      description: "Stark, mythic poetry built around the figure of Crow - creation, violence, and fable.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.worldcat.org/search?q=Crow+Ted+Hughes"
    },
    {
      title: "The Celtic Twilight",
      author: "W.B. Yeats",
      color: "#4A5568",
      spine: "#2D3748",
      description: "Irish mysticism and folklore from the Nobel laureate poet.",
      relevantTo: ["Cathleen"],
      link: "https://en.wikipedia.org/wiki/The_Celtic_Twilight"
    }
  ],
  "Birds & Nature": [
    {
      title: "Ornithography",
      author: "Jessica Roux",
      color: "#228B22",
      spine: "#165B16",
      description: "An illustrated guide to bird lore and symbolism - the Parliament of Birds.",
      relevantTo: ["Shigg"],
      link: "https://www.worldcat.org/search?q=Ornithography+Jessica+Roux"
    },
    {
      title: "Crows and Ravens",
      author: "Rick De Yampert",
      color: "#36454F",
      spine: "#252F35",
      description: "The intelligence, mythology, and magic of corvids.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.worldcat.org/search?q=Crows+and+Ravens+Rick+De+Yampert"
    },
    {
      title: "The Field Guide to Dumb Birds",
      author: "Matt Kracht",
      color: "#87CEEB",
      spine: "#5BA3C6",
      description: "A comedic, irreverent guide - because even witches need to laugh.",
      relevantTo: ["Shigg"],
      link: "https://www.worldcat.org/search?q=The+Field+Guide+to+Dumb+Birds+of+North+America+Matt+Kracht"
    }
  ],
  "London & Essex History": [
    {
      title: "Dark London",
      author: "Drew Gray",
      color: "#2C2C2C",
      spine: "#1a1a1a",
      description: "The hidden and darker history of London's streets.",
      relevantTo: ["Katherine"],
      link: "https://www.worldcat.org/search?q=Dark+London+Drew+Gray"
    },
    {
      title: "The Secret Lore of London",
      author: "John Matthews & Caroline Wise",
      color: "#722F37",
      spine: "#4a1f24",
      description: "Magical traditions, sacred sites, and hidden history of the city.",
      relevantTo: ["Katherine", "Cathleen"],
      link: "https://www.worldcat.org/search?q=The+Secret+Lore+of+London+John+Matthews+Caroline+Wise"
    },
    {
      title: "The London Blitz",
      author: "David Johnson",
      color: "#4A4A4A",
      spine: "#333333",
      description: "The city ablaze, December 29, 1940 - the world Shigg survived.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.worldcat.org/search?q=The+London+Blitz+The+City+Ablaze+December+29+1940+David+Johnson"
    },
    {
      title: "A Grim Almanac of Essex",
      author: "Neil R. Storey",
      color: "#4B3621",
      spine: "#2F2215",
      description: "Dark tales from the county where Crowlands Avenue stands.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=A+Grim+Almanac+of+Essex+Neil+R+Storey"
    },
    {
      title: "Essex Land Girls",
      author: "Dee Gordon",
      color: "#6B8E23",
      spine: "#4A6316",
      description: "Women's wartime service in Essex - the world Cathleen knew.",
      relevantTo: ["Cathleen"],
      link: "https://www.worldcat.org/search?q=Essex+Land+Girls+Dee+Gordon"
    },
    {
      title: "Jersey Legends",
      author: "Erren Michaels",
      color: "#1E3A5F",
      spine: "#142740",
      description: "Folklore from the Channel Islands - part of the family's heritage.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=Jersey+Legends+Erren+Michaels"
    }
  ],
  "Healing & Psychology": [
    {
      title: "Healing Collective Trauma",
      author: "Thomas Hübl",
      color: "#5F9EA0",
      spine: "#4A7A7C",
      description: "A guide to integrating ancestral and cultural wounds.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=Healing+Collective+Trauma+Thomas+Hubl"
    },
    {
      title: "Signs & Symbols",
      author: "DK",
      color: "#D4AF37",
      spine: "#B8962F",
      description: "An illustrated guide to symbols across religions, cultures, and traditions.",
      relevantTo: ["All"],
      link: "https://www.worldcat.org/search?q=Signs+%26+Symbols+An+Illustrated+Guide+to+Their+Origins+and+Meanings+DK"
    }
  ]
};

// Single book component with pull-out animation
const Book = ({ book, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0"
      style={{ 
        width: '48px',
        height: '180px',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(book)}
      initial={{ rotateY: 0, z: 0 }}
      animate={{ 
        rotateY: isHovered ? -25 : 0,
        z: isHovered ? 30 : 0,
        y: isHovered ? -10 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Book spine */}
      <div 
        className="absolute inset-0 rounded-r-sm flex items-center justify-center"
        style={{ 
          background: `linear-gradient(90deg, ${book.spine} 0%, ${book.color} 15%, ${book.color} 85%, ${book.spine} 100%)`,
          transformOrigin: 'left center',
          boxShadow: isHovered 
            ? '4px 4px 15px rgba(0,0,0,0.5), 0 0 20px rgba(212, 168, 75, 0.3)' 
            : '2px 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {/* Spine text */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span 
            className="text-xs font-cinzel tracking-wide truncate px-1"
            style={{ 
              color: book.textColor || '#f5f0e6',
              textShadow: '0 1px 2px rgba(0,0,0,0.7)',
              maxHeight: '160px',
              overflow: 'hidden'
            }}
          >
            {book.title}
          </span>
        </div>
        
        {/* Spine gold details */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full" />
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold/30 rounded-full" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full" />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold/30 rounded-full" />
      </div>
      
      {/* Book edge (pages) */}
      <div 
        className="absolute right-0 top-1 bottom-1 w-1.5 rounded-r-sm"
        style={{ 
          background: 'linear-gradient(90deg, #c4b89a 0%, #f5f0e6 30%, #e8e0d0 70%, #c4b89a 100%)',
          boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.1)'
        }}
      />
    </motion.div>
  );
};

// Bookshelf section - LIGHT parchment version
const BookshelfSectionLight = ({ category, books, onSelectBook, isFirst }) => (
  <div className="relative py-10 sm:py-14" style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 50%, #f5f0e6 100%)' }}>
    {/* Subtle pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L45 15M30 30L15 45M30 30L45 45M30 30L15 15' stroke='%230e1629' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
    }} />
    
    {/* Top border */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    <div className="absolute top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    
    {/* Corner ornaments */}
    <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16" variant="crimson" />
    <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-90" variant="crimson" />
    
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      {/* Category title */}
      <div className="text-center mb-6">
        <h2 className="font-italiana text-xl sm:text-2xl text-crimson mb-2" style={{ textShadow: '0 2px 10px rgba(184, 35, 48, 0.2)' }}>
          {category}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-crimson/40" />
          <span className="text-gold-dark text-sm">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-crimson/40" />
        </div>
      </div>
      
      {/* Wooden bookshelf */}
      <div className="relative">
        {/* Shelf back */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: 'linear-gradient(180deg, #3d2517 0%, #2a1810 50%, #1a0f0a 100%)',
            boxShadow: 'inset 0 -15px 30px rgba(0,0,0,0.6), inset 0 5px 15px rgba(255,255,255,0.05)'
          }}
        />
        
        {/* Books container */}
        <div className="relative flex items-end gap-1.5 p-5 pb-3 overflow-x-auto scrollbar-hide" style={{ minHeight: '230px' }}>
          {books.map((book, index) => (
            <Book key={book.title} book={book} onSelect={onSelectBook} />
          ))}
        </div>
        
        {/* Shelf front edge with wood grain */}
        <div 
          className="h-5 rounded-b-lg relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #4a2c1a 0%, #3d2517 50%, #2a1810 100%)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.5)'
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px)'
          }} />
        </div>
      </div>
    </div>
    
    {/* Bottom corners */}
    <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" variant="crimson" />
    <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-180" variant="crimson" />
    
    {/* Bottom border */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
  </div>
);

// Bookshelf section - DARK navy version
const BookshelfSectionDark = ({ category, books, onSelectBook }) => (
  <div className="relative py-10 sm:py-14 bg-navy-dark">
    {/* Background effects */}
    <div className="absolute inset-0" style={{ 
      background: 'radial-gradient(ellipse at 50% 50%, rgba(26, 45, 77, 0.4) 0%, transparent 60%)' 
    }} />
    
    {/* Subtle pattern */}
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23d4a84b'/%3E%3C/svg%3E")`,
    }} />
    
    {/* Corner ornaments */}
    <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16" variant="gold" />
    <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-90" variant="gold" />
    
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      {/* Category title */}
      <div className="text-center mb-6">
        <h2 className="font-italiana text-xl sm:text-2xl text-gold-light mb-2" style={{ textShadow: '0 2px 15px rgba(212, 168, 75, 0.4)' }}>
          {category}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-crimson-bright text-sm">◆</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </div>
      
      {/* Wooden bookshelf */}
      <div className="relative">
        {/* Shelf back - darker wood for contrast */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 50%, #0f0805 100%)',
            boxShadow: 'inset 0 -15px 30px rgba(0,0,0,0.7), inset 0 5px 15px rgba(212, 168, 75, 0.05)'
          }}
        />
        
        {/* Books container */}
        <div className="relative flex items-end gap-1.5 p-5 pb-3 overflow-x-auto scrollbar-hide" style={{ minHeight: '230px' }}>
          {books.map((book, index) => (
            <Book key={book.title} book={book} onSelect={onSelectBook} />
          ))}
        </div>
        
        {/* Shelf front edge */}
        <div 
          className="h-5 rounded-b-lg relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #3d2517 0%, #2a1810 50%, #1a0f0a 100%)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.6), 0 0 20px rgba(212, 168, 75, 0.1)'
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(212,168,75,0.1) 20px, rgba(212,168,75,0.1) 21px)'
          }} />
        </div>
      </div>
    </div>
    
    {/* Bottom corners */}
    <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" variant="gold" />
    <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-180" variant="gold" />
  </div>
);

// Book detail modal
const BookModal = ({ book, onClose }) => {
  if (!book) return null;
  
  // Get archetype colors
  const getArchetypeColor = (name) => {
    const colors = {
      'Shigg': '#228B22',
      'Cathleen': '#4169E1', 
      'Katherine': '#800020',
      'All': '#d4a84b'
    };
    return colors[name] || '#d4a84b';
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-md" />
        
        {/* Modal */}
        <motion.div
          className="relative max-w-md w-full overflow-hidden"
          initial={{ scale: 0.8, rotateY: -40, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateY: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: '1000px' }}
        >
          {/* Ornate frame */}
          <div className="absolute -inset-2 border-2 border-gold/40 rounded-lg" />
          <div className="absolute -inset-1 border border-crimson/30 rounded-lg" />
          
          {/* Corner ornaments */}
          <ElaborateCorner className="absolute -top-4 -left-4 w-12 h-12" variant="gold" />
          <ElaborateCorner className="absolute -top-4 -right-4 w-12 h-12 rotate-90" variant="gold" />
          <ElaborateCorner className="absolute -bottom-4 -left-4 w-12 h-12 -rotate-90" variant="gold" />
          <ElaborateCorner className="absolute -bottom-4 -right-4 w-12 h-12 rotate-180" variant="gold" />
          
          {/* Book cover background */}
          <div 
            className="p-6 relative overflow-hidden rounded-t-lg"
            style={{ background: `linear-gradient(135deg, ${book.color} 0%, ${book.spine} 100%)` }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'
            }} />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 border border-gold/30 flex items-center justify-center hover:bg-black/60 hover:border-gold/50 transition-all"
            >
              <X className="w-4 h-4 text-gold" />
            </button>
            
            {/* Book icon */}
            <motion.div 
              className="w-20 h-20 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center mb-4 mx-auto"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BookOpen className="w-10 h-10" style={{ color: book.textColor || '#f5f0e6' }} />
            </motion.div>
            
            {/* Title */}
            <h2 
              className="font-italiana text-xl sm:text-2xl text-center mb-1"
              style={{ color: book.textColor || '#f5f0e6', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              {book.title}
            </h2>
            
            {/* Author */}
            <p 
              className="font-crimson text-center italic"
              style={{ color: book.textColor || '#f5f0e6', opacity: 0.85 }}
            >
              by {book.author}
            </p>
          </div>
          
          {/* Content area - parchment style */}
          <div className="bg-gradient-to-b from-parchment to-parchment-dark p-6 rounded-b-lg">
            {/* Description */}
            <p className="font-crimson text-navy-dark leading-relaxed mb-5">
              {book.description}
            </p>
            
            {/* Relevant to */}
            <div className="mb-5">
              <span className="font-montserrat text-xs uppercase tracking-wider text-navy-dark/50">Speaks to: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {book.relevantTo.map((name) => (
                  <span 
                    key={name}
                    className="px-3 py-1 rounded-full text-xs font-cinzel text-white"
                    style={{ backgroundColor: getArchetypeColor(name) }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-crimson/30" />
              <span className="text-gold-dark text-xs">◆</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-crimson/30" />
            </div>
            
            {/* Link */}
            {book.link && (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep border border-gold/40 text-cream rounded-sm font-cinzel text-sm tracking-wider uppercase hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Find This Book
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const categories = Object.entries(LIBRARY_BOOKS);
  
  return (
    <div className="min-h-screen">
      {/* ===== DARK HEADER SECTION ===== */}
      <div className="relative py-12 sm:py-16 bg-navy-dark">
        {/* Background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.15) 0%, transparent 50%)'
        }} />
        
        {/* Corner ornaments */}
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="text-5xl sm:text-6xl">📚</span>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-3"
            style={{ textShadow: '0 4px 30px rgba(212, 168, 75, 0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The Library
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="font-crimson text-base sm:text-lg text-cream/80 max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The books that shaped our practice. Hover over any spine to peek, click to explore.
          </motion.p>
          
          <MysticalDivider variant="book" />
          
          {/* Intro text */}
          <motion.p 
            className="font-crimson text-sm text-silver-mist/70 max-w-xl mx-auto italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            "The moving finger writes, and having writ, moves on..." — these books have written on us all.
          </motion.p>
        </div>
        
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
      </div>
      
      {/* ===== ALTERNATING BOOKSHELF SECTIONS ===== */}
      {categories.map(([category, books], index) => (
        index % 2 === 0 ? (
          <BookshelfSectionLight 
            key={category} 
            category={category} 
            books={books} 
            onSelectBook={setSelectedBook}
            isFirst={index === 0}
          />
        ) : (
          <BookshelfSectionDark 
            key={category} 
            category={category} 
            books={books} 
            onSelectBook={setSelectedBook}
          />
        )
      ))}
      
      {/* ===== FOOTER SECTION ===== */}
      <div className="relative py-10 bg-navy-dark">
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26, 45, 77, 0.4) 0%, transparent 60%)' 
        }} />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <MysticalDivider variant="moon" />
          
          <p className="font-crimson text-sm text-cream/60 italic mb-4">
            Each book is a doorway. Each page, a spell waiting to be cast.
          </p>
          
          <div className="flex items-center justify-center gap-3 text-gold/40">
            <span>☽</span>
            <span className="text-crimson/60">◆</span>
            <span>📖</span>
            <span className="text-crimson/60">◆</span>
            <span>☾</span>
          </div>
        </div>
      </div>
      
      {/* Book detail modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default Library;

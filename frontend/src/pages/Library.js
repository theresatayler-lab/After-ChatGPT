import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen } from 'lucide-react';

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
      title: "Kabbalistic Teachings of the Female Prophets",
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
const Book = ({ book, index, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ 
        width: '45px',
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
        className="absolute inset-0 rounded-r-sm flex items-center justify-center shadow-lg"
        style={{ 
          background: `linear-gradient(90deg, ${book.spine} 0%, ${book.color} 20%, ${book.color} 100%)`,
          transformOrigin: 'left center'
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
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              maxHeight: '160px',
              overflow: 'hidden'
            }}
          >
            {book.title}
          </span>
        </div>
        
        {/* Spine details */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gold/30 rounded-full" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gold/30 rounded-full" />
      </div>
      
      {/* Book edge (pages) */}
      <div 
        className="absolute right-0 top-1 bottom-1 w-1"
        style={{ background: 'linear-gradient(90deg, #d4c5a9 0%, #f5f0e6 50%, #d4c5a9 100%)' }}
      />
    </motion.div>
  );
};

// Bookshelf row
const BookshelfRow = ({ category, books, onSelectBook }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  
  return (
    <div className="mb-8">
      {/* Category label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-gold text-sm">◆</span>
        <h3 className="font-cinzel text-sm sm:text-base text-gold tracking-wider">{category}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
      </div>
      
      {/* Shelf with books */}
      <div className="relative">
        {/* Shelf back */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 100%)',
            boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5)'
          }}
        />
        
        {/* Books container */}
        <div className="relative flex items-end gap-1 p-4 pb-2 overflow-x-auto" style={{ minHeight: '220px' }}>
          {books.map((book, index) => (
            <Book 
              key={book.title} 
              book={book} 
              index={index}
              onSelect={onSelectBook}
              isSelected={selectedBook?.title === book.title}
            />
          ))}
        </div>
        
        {/* Shelf front edge */}
        <div 
          className="h-4 rounded-b-lg"
          style={{ 
            background: 'linear-gradient(180deg, #3d2517 0%, #2a1810 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
          }}
        />
      </div>
    </div>
  );
};

// Book detail modal
const BookModal = ({ book, onClose }) => {
  if (!book) return null;
  
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
        <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" />
        
        {/* Modal */}
        <motion.div
          className="relative max-w-md w-full rounded-lg overflow-hidden"
          initial={{ scale: 0.9, rotateY: -30, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.9, rotateY: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Book cover background */}
          <div 
            className="p-6"
            style={{ background: `linear-gradient(135deg, ${book.color} 0%, ${book.spine} 100%)` }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {/* Book icon */}
            <div className="w-16 h-16 rounded-lg bg-black/20 flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="w-8 h-8" style={{ color: book.textColor || '#f5f0e6' }} />
            </div>
            
            {/* Title */}
            <h2 
              className="font-cinzel text-xl text-center mb-1"
              style={{ color: book.textColor || '#f5f0e6', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {book.title}
            </h2>
            
            {/* Author */}
            <p 
              className="font-crimson text-center italic mb-4"
              style={{ color: book.textColor || '#f5f0e6', opacity: 0.8 }}
            >
              by {book.author}
            </p>
          </div>
          
          {/* Content area */}
          <div className="bg-parchment p-6">
            {/* Description */}
            <p className="font-crimson text-navy-dark leading-relaxed mb-4">
              {book.description}
            </p>
            
            {/* Relevant to */}
            <div className="mb-4">
              <span className="font-montserrat text-xs uppercase tracking-wider text-navy-dark/60">Speaks to: </span>
              <span className="font-cinzel text-sm text-crimson">
                {book.relevantTo.join(", ")}
              </span>
            </div>
            
            {/* Link */}
            {book.link && (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-navy-dark text-cream rounded-sm font-montserrat text-sm tracking-wider uppercase hover:bg-navy-mid transition-colors"
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
  
  return (
    <div className="min-h-screen bg-navy-dark py-8 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 
          className="font-italiana text-3xl sm:text-4xl text-gold-light mb-2"
          style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.4)' }}
        >
          The Library
        </h1>
        <p className="font-crimson text-cream/70 max-w-2xl mx-auto">
          The books that shaped our practice. Click any spine to learn more.
        </p>
        
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-crimson">◆</span>
          <span className="text-gold">📚</span>
          <span className="text-crimson">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>
      
      {/* Bookshelves */}
      <div className="max-w-5xl mx-auto">
        {Object.entries(LIBRARY_BOOKS).map(([category, books]) => (
          <BookshelfRow
            key={category}
            category={category}
            books={books}
            onSelectBook={setSelectedBook}
          />
        ))}
      </div>
      
      {/* Footer note */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <p className="font-crimson text-sm text-cream/50 italic">
          "The moving finger writes, and having writ, moves on..." — these books have written on us all.
        </p>
      </div>
      
      {/* Book detail modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default Library;

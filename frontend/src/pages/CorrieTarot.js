import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Tv, Heart, ArrowLeft, RefreshCw, 
  Loader2, Crown, Lock, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Shigg's image
const SHIGG_IMAGE = "https://customer-assets.emergentagent.com/job_diywizardry/artifacts/127im9d9_Shig50.png";

// Oracle Card component - displays a single card in the reading
const OracleCard = ({ cardData, position, index, isExpanded, onToggle }) => {
  const positionColors = {
    'Past': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    'Present': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    'Future': { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
    'The Message': { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' }
  };
  
  const colors = positionColors[position] || positionColors['The Message'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`${colors.bg} ${colors.border} border rounded-lg overflow-hidden`}
    >
      {/* Card Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-secondary/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{cardData.card?.symbol || '🎴'}</div>
            <div>
              <p className={`font-montserrat text-xs ${colors.text} uppercase tracking-wider`}>
                {position}
              </p>
              <h3 className="font-cinzel text-lg text-foreground">{cardData.card?.name}</h3>
              {cardData.card?.suit && (
                <p className="font-montserrat text-xs text-muted-foreground">
                  {cardData.card.arcana} • {cardData.card.suit}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
        
        {/* Core Message - Always visible */}
        <p className={`font-crimson text-base ${colors.text} mt-3 italic`}>
          "{cardData.core_message}"
        </p>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-secondary/20 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* WWCD Advice */}
              <div>
                <h4 className="font-montserrat text-xs uppercase tracking-wider text-secondary mb-2">
                  What Would Corrie Do?
                </h4>
                <ul className="space-y-2">
                  {cardData.wwcd_advice?.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="font-montserrat text-sm text-foreground/90">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Because They */}
              {cardData.because_they && (
                <div className={`p-3 ${colors.bg} rounded-lg`}>
                  <p className="font-montserrat text-sm text-foreground/80">
                    <span className="font-semibold">Because they...</span> {cardData.because_they}
                  </p>
                </div>
              )}
              
              {/* Shadow & Blessing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="font-montserrat text-xs uppercase tracking-wider text-red-400 mb-1">Shadow to Avoid</p>
                  <p className="font-montserrat text-sm text-foreground/80">{cardData.shadow_to_avoid}</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="font-montserrat text-xs uppercase tracking-wider text-green-400 mb-1">Blessing</p>
                  <p className="font-montserrat text-sm text-foreground/80">{cardData.blessing}</p>
                </div>
              </div>
              
              {/* Next Step */}
              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                <p className="font-montserrat text-xs uppercase tracking-wider text-secondary mb-1">Next Step Today</p>
                <p className="font-montserrat text-sm text-foreground">{cardData.next_step_today}</p>
              </div>
              
              {/* Corrie Charm */}
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-montserrat text-xs uppercase tracking-wider text-primary mb-1">🕯️ Corrie Charm</p>
                <p className="font-montserrat text-sm text-foreground/90 italic">{cardData.corrie_charm}</p>
              </div>
              
              {/* Rovers Return Line */}
              <div className="text-center pt-2">
                <p className="font-cinzel text-lg text-secondary">
                  "{cardData.rovers_return_line}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CorrieTarot = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('one_card');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isPro, setIsPro] = useState(false);
  
  // Check user status on load
  React.useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setIsPro(userData.subscription_tier === 'paid');
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to check user status:', error);
        }
      }
    };
    checkUserStatus();
  }, []);
  
  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!situation.trim()) {
      toast.error('Please tell Shigg what you\'re facing');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to get a reading');
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setExpandedCards({ 0: true }); // Auto-expand first card
    
    try {
      const response = await fetch(`${API_URL}/api/ai/cobbles-oracle/reading`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          situation: situation.trim(),
          question: question.trim() || null,
          spread_type: spreadType
        })
      });
      
      if (response.status === 403) {
        const error = await response.json();
        toast.error(error.detail?.message || 'This spread is a Pro feature!', {
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/upgrade')
          }
        });
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to get reading');
      }
      
      const data = await response.json();
      setResult(data.result);
      toast.success('The cards have been drawn');
    } catch (error) {
      console.error('Oracle error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSituation('');
    setQuestion('');
    setExpandedCards({});
  };
  
  const spreadOptions = [
    { id: 'one_card', name: 'Quick Draw', description: 'One card, one message', pro: false },
    { id: 'three_card', name: 'Past, Present, Future', description: 'Three cards through time', pro: false },
    { id: 'street_spread', name: 'The Street Spread', description: 'Five-card deep dive', pro: true }
  ];
  
  return (
    <div className="min-h-screen bg-background pt-16">
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <button
              onClick={() => navigate('/guides')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-montserrat text-sm">Back to Guides</span>
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/50">
                  <img 
                    src={SHIGG_IMAGE} 
                    alt="Shigg" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full">
                  <Tv className="w-3 h-3" />
                </div>
              </div>
            </div>
            
            <h1 className="font-cinzel text-3xl md:text-4xl text-foreground mb-2">
              The Cobbles Oracle
            </h1>
            <p className="font-montserrat text-base text-secondary mb-2">
              What Would Corrie Do?
            </p>
            <p className="font-montserrat text-sm text-muted-foreground max-w-lg mx-auto">
              78 cards drawn from Coronation Street's wisdom. Characters and places that 
              know how ordinary people handle extraordinary troubles.
            </p>
          </motion.div>
          
          {/* Not logged in message */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-card/50 border border-border rounded-lg mb-8"
            >
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cinzel text-xl text-foreground mb-2">Please Log In</h3>
              <p className="font-montserrat text-sm text-muted-foreground mb-4">
                Log in to receive your Cobbles Oracle reading.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-montserrat text-sm hover:bg-primary/90 transition-colors"
              >
                Log In or Sign Up
              </button>
            </motion.div>
          )}
          
          {/* Form or Results */}
          {isLoggedIn && (
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  {/* Spread Type Selection */}
                  <div>
                    <label className="block font-montserrat text-sm text-foreground mb-3">
                      Choose Your Spread
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {spreadOptions.map((spread) => (
                        <button
                          key={spread.id}
                          type="button"
                          disabled={spread.pro && !isPro}
                          onClick={() => setSpreadType(spread.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            spreadType === spread.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card/50 hover:border-secondary/50'
                          } ${spread.pro && !isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-cinzel text-sm text-foreground">{spread.name}</span>
                            {spread.pro && (
                              <Crown className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <p className="font-montserrat text-xs text-muted-foreground">
                            {spread.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Situation Input */}
                  <div>
                    <label className="block font-montserrat text-sm text-foreground mb-2">
                      What are you facing? <span className="text-primary">*</span>
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="I'm struggling with... / I need guidance about... / I'm facing a decision..."
                      className="w-full h-28 px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Question Input (Optional) */}
                  <div>
                    <label className="block font-montserrat text-sm text-foreground mb-2">
                      Any specific question? <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Should I...? / How do I...? / What would they say...?"
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !situation.trim()}
                      className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-montserrat tracking-wider uppercase text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Drawing the cards...
                        </>
                      ) : (
                        <>
                          <Tv className="w-5 h-5" />
                          Draw the Cards
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Safety Note */}
                  {result.safety_note && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="font-montserrat text-sm text-red-400">
                        ⚠️ {result.safety_note}
                      </p>
                    </div>
                  )}
                  
                  {/* Greeting */}
                  <div className="bg-card/50 border border-secondary/20 rounded-lg p-5 text-center">
                    <p className="font-crimson text-lg text-foreground/90 italic leading-relaxed">
                      "{result.greeting}"
                    </p>
                  </div>
                  
                  {/* Spread Name */}
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 bg-secondary/10 border border-secondary/30 rounded-full font-montserrat text-xs text-secondary uppercase tracking-wider">
                      {result.spread_name}
                    </span>
                  </div>
                  
                  {/* Cards */}
                  <div className="space-y-4">
                    {result.cards?.map((cardData, index) => (
                      <OracleCard
                        key={index}
                        cardData={cardData}
                        position={cardData.position}
                        index={index}
                        isExpanded={expandedCards[index] ?? index === 0}
                        onToggle={() => toggleCardExpand(index)}
                      />
                    ))}
                  </div>
                  
                  {/* Synthesis (for multi-card spreads) */}
                  {result.synthesis && result.cards?.length > 1 && (
                    <div className="bg-primary/5 border border-primary/30 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-cinzel text-lg text-foreground mb-2">What They're All Saying</h3>
                          <p className="font-montserrat text-sm text-foreground/90 leading-relaxed">
                            {result.synthesis}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Closing */}
                  <div className="bg-card/50 border border-secondary/20 rounded-lg p-5 text-center">
                    <p className="font-crimson text-base text-foreground/90 italic leading-relaxed">
                      "{result.closing}"
                    </p>
                    <p className="font-montserrat text-xs text-secondary/60 mt-3">— Shigg</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-card border border-border rounded-lg font-montserrat text-sm hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Ask About Something Else
                    </button>
                    <button
                      onClick={() => navigate('/grimoire')}
                      className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-montserrat text-sm hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Create a Spell with Shigg
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-card/30 border border-border/50 rounded-lg p-5 max-w-lg">
              <h3 className="font-cinzel text-base text-foreground mb-2">The Cobbles Oracle</h3>
              <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                78 cards: 22 Major Arcana from street locations and legendary characters, 
                plus 56 Minor Arcana in four suits—Pints (heart), Sparks (drive), 
                Keys (truth), and Pennies (stability). Each card carries the wisdom of 
                Coronation Street's 60+ years of ordinary people facing extraordinary troubles.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CorrieTarot;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Tv, Heart, Clock, ArrowLeft, RefreshCw, 
  Loader2, Crown, Lock, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Footer } from '../components/Footer';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Shigg's image
const SHIGG_IMAGE = "https://customer-assets.emergentagent.com/job_diywizardry/artifacts/127im9d9_Shig50.png";

// Card component for each position (Past/Present/Future)
const CorrieTarotCard = ({ position, data, index }) => {
  const [expanded, setExpanded] = useState(true);
  
  const positionLabels = {
    past: { label: 'Past', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    future: { label: 'Future', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' }
  };
  
  const style = positionLabels[position];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.3 }}
      className={`${style.bg} ${style.border} border rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-secondary/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-3xl`}>{data.symbol}</div>
            <div>
              <p className={`font-montserrat text-xs ${style.color} uppercase tracking-wider`}>
                {style.label}
              </p>
              <h3 className="font-cinzel text-xl text-foreground">{data.character}</h3>
              <p className="font-montserrat text-xs text-muted-foreground">{data.era}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-montserrat text-xs text-secondary/60 px-2 py-1 bg-secondary/10 rounded">
              {data.archetype}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-secondary/20 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Message */}
              <div>
                <p className="font-montserrat text-sm text-foreground/90 leading-relaxed">
                  {data.message}
                </p>
              </div>
              
              {/* Wisdom Quote */}
              <div className={`p-3 ${style.bg} rounded-lg border ${style.border}`}>
                <p className="font-crimson text-sm text-foreground/80 italic">
                  &ldquo;{data.wisdom}&rdquo;
                </p>
                <p className={`font-montserrat text-xs ${style.color} mt-2`}>— {data.character}</p>
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
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
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
    
    try {
      const response = await fetch(`${API_URL}/api/ai/corrie-tarot`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          situation: situation.trim(),
          question: question.trim() || null
        })
      });
      
      if (response.status === 403) {
        toast.error('What Would Corrie Do is a Pro feature!', {
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
      toast.success('Shigg has consulted the Street');
    } catch (error) {
      console.error('Corrie tarot error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSituation('');
    setQuestion('');
  };
  
  return (
    <div className="min-h-screen bg-background pt-16">
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
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
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary/50">
                  <img 
                    src={SHIGG_IMAGE} 
                    alt="Shigg" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full">
                  <Tv className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <h1 className="font-cinzel text-3xl md:text-4xl text-foreground mb-3">
              What Would Corrie Do?
            </h1>
            <p className="font-montserrat text-lg text-secondary mb-2">
              with Shigg, Birds of Parliament Poet Laureate
            </p>
            <p className="font-montserrat text-sm text-muted-foreground max-w-xl mx-auto">
              The characters of Coronation Street aren&apos;t just TV—they&apos;re mirrors showing how ordinary 
              people handle extraordinary troubles. Tell me what you&apos;re facing, and I&apos;ll draw three 
              characters to guide you: Past, Present, and Future.
            </p>
            
            {/* Pro Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
              <Crown className="w-4 h-4 text-primary" />
              <span className="font-montserrat text-xs text-primary">Pro Feature</span>
            </div>
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
                What Would Corrie Do readings are available to Pro members.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-montserrat text-sm hover:bg-primary/90 transition-colors"
              >
                Log In or Sign Up
              </button>
            </motion.div>
          )}
          
          {/* Not Pro message */}
          {isLoggedIn && !isPro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-card/50 border border-primary/30 rounded-lg mb-8"
            >
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-cinzel text-xl text-foreground mb-2">Pro Feature</h3>
              <p className="font-montserrat text-sm text-muted-foreground mb-4">
                What Would Corrie Do readings are exclusive to Pro members. Upgrade to unlock 
                Shigg&apos;s special Coronation Street wisdom!
              </p>
              <button
                onClick={() => navigate('/upgrade')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-montserrat text-sm hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro
              </button>
            </motion.div>
          )}
          
          {/* Form or Results */}
          {isLoggedIn && isPro && (
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
                  {/* Situation Input */}
                  <div>
                    <label className="block font-montserrat text-sm text-foreground mb-2">
                      What are you facing? <span className="text-primary">*</span>
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="I'm struggling with a decision about... / I'm dealing with conflict in... / I need guidance about..."
                      className="w-full h-32 px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
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
                      placeholder="Should I...? / How do I...? / What would they say about...?"
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || !situation.trim()}
                      className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-montserrat tracking-wider uppercase text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Shigg is consulting the Street...
                        </>
                      ) : (
                        <>
                          <Tv className="w-5 h-5" />
                          What Would Corrie Do?
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
                  className="space-y-8"
                >
                  {/* Greeting */}
                  <div className="bg-card/50 border border-secondary/20 rounded-lg p-6 text-center">
                    <p className="font-crimson text-lg text-foreground/90 italic leading-relaxed">
                      &ldquo;{result.greeting}&rdquo;
                    </p>
                  </div>
                  
                  {/* Tarot Cards */}
                  <div className="space-y-4">
                    <h2 className="font-cinzel text-xl text-center text-secondary mb-6">
                      Your Reading
                    </h2>
                    
                    {result.reading && (
                      <>
                        <CorrieTarotCard position="past" data={result.reading.past} index={0} />
                        <CorrieTarotCard position="present" data={result.reading.present} index={1} />
                        <CorrieTarotCard position="future" data={result.reading.future} index={2} />
                      </>
                    )}
                  </div>
                  
                  {/* Overall Guidance */}
                  {result.overall_guidance && (
                    <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-cinzel text-lg text-foreground mb-2">What They&apos;re All Telling You</h3>
                          <p className="font-montserrat text-sm text-foreground/90 leading-relaxed">
                            {result.overall_guidance}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Closing */}
                  <div className="bg-card/50 border border-secondary/20 rounded-lg p-6 text-center">
                    <p className="font-crimson text-lg text-foreground/90 italic leading-relaxed">
                      &ldquo;{result.closing}&rdquo;
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
            className="mt-16 text-center"
          >
            <div className="inline-block bg-card/30 border border-border/50 rounded-lg p-6 max-w-lg">
              <h3 className="font-cinzel text-lg text-foreground mb-3">About What Would Corrie Do</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Coronation Street has been on air since 1960—over sixty years of ordinary people 
                facing extraordinary troubles. These characters aren&apos;t archetypes to be worshipped; 
                they&apos;re neighbours to learn from. Their stories show us how to survive, how to love, 
                and how to keep going when the chips are down.
              </p>
              <p className="font-crimson text-sm text-secondary italic mt-3">
                &ldquo;That&apos;s not just television—that&apos;s comfort in story form.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CorrieTarot;

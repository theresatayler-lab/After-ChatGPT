import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Eye, MapPin, Hand, Package,
  Loader2, ArrowLeft, RefreshCw, Save, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Cathleen's image
const CATHLEEN_IMAGE = "https://customer-assets.emergentagent.com/job_diywizardry/artifacts/2yrmxbqx_Cathleen16.png";

const WardCard = ({ ward, index, situation, onSave, isSaving, isSaved }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-card border border-secondary/30 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-5 cursor-pointer hover:bg-secondary/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/20 rounded-full flex-shrink-0">
            <span className="text-3xl">{ward.symbol}</span>
          </div>
          <div className="flex-1">
            <p className="font-montserrat text-xs text-secondary/70 uppercase tracking-wider mb-1">
              {ward.category}
            </p>
            <h3 className="font-cinzel text-xl text-foreground mb-2">{ward.name}</h3>
            <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
              {ward.why_for_you}
            </p>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <span className="font-montserrat text-xs text-secondary/60">
            {expanded ? 'Click to collapse' : 'Click to learn more'}
          </span>
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
            <div className="p-5 space-y-4 bg-secondary/5">
              {/* Meaning */}
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Deeper Meaning
                  </p>
                  <p className="font-montserrat text-sm text-foreground/90">
                    {ward.meaning}
                  </p>
                </div>
              </div>
              
              {/* Where to Find */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Where to Find It
                  </p>
                  <p className="font-montserrat text-sm text-foreground/90">
                    {ward.where_to_find}
                  </p>
                </div>
              </div>
              
              {/* How to Choose */}
              {ward.how_to_choose && (
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      How to Know It&apos;s The One
                    </p>
                    <p className="font-montserrat text-sm text-foreground/90">
                      {ward.how_to_choose}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Activation */}
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    How to Activate & Bond
                  </p>
                  <p className="font-montserrat text-sm text-foreground/90">
                    {ward.activation}
                  </p>
                </div>
              </div>
              
              {/* How to Carry */}
              {ward.how_to_carry && (
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      How to Carry It
                    </p>
                    <p className="font-montserrat text-sm text-foreground/90">
                      {ward.how_to_carry}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WardFinder = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [personality, setPersonality] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!situation.trim()) {
      toast.error('Please describe your situation or what you need help with');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_URL}/api/ai/suggest-ward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situation.trim(),
          personality: personality.trim() || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get ward suggestions');
      }
      
      const data = await response.json();
      setResult(data.result);
      toast.success('Cathleen has chosen your wards');
    } catch (error) {
      console.error('Ward finder error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSituation('');
    setPersonality('');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
                    src={CATHLEEN_IMAGE} 
                    alt="Cathleen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground p-1.5 rounded-full">
                  <Hand className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <h1 className="font-cinzel text-3xl md:text-4xl text-foreground mb-3">
              Find Your Ward
            </h1>
            <p className="font-montserrat text-lg text-secondary mb-2">
              with Cathleen, The Singer of Strength
            </p>
            <p className="font-montserrat text-sm text-muted-foreground max-w-xl mx-auto">
              Tell me what weighs on your heart, and I&apos;ll help you find the perfect talisman to carry. 
              Every ward chooses its keeper as much as the keeper chooses it.
            </p>
          </motion.div>
          
          {/* Form or Results */}
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
                    What do you need help with? <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="I'm facing a difficult decision... / I need protection during... / I want to feel more confident when... / I'm grieving and need comfort..."
                    className="w-full h-32 px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary resize-none"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Personality Input (Optional) */}
                <div>
                  <label className="block font-montserrat text-sm text-foreground mb-2">
                    Tell me a bit about yourself <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="I'm introverted and love nature... / I work with my hands... / I'm drawn to the sea... / I'm a mother of two..."
                    className="w-full h-24 px-4 py-3 bg-card border border-border rounded-lg font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary resize-none"
                    disabled={isLoading}
                  />
                  <p className="font-montserrat text-xs text-muted-foreground mt-1">
                    This helps me choose something that truly resonates with your spirit.
                  </p>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !situation.trim()}
                    className="w-full px-6 py-4 bg-secondary text-secondary-foreground rounded-lg font-montserrat tracking-wider uppercase text-sm hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cathleen is choosing your wards...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Find My Wards
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
                
                {/* Ward Cards */}
                <div className="space-y-4">
                  <h2 className="font-cinzel text-xl text-center text-secondary mb-6">
                    Your Suggested Wards
                  </h2>
                  {result.wards?.map((ward, index) => (
                    <WardCard key={index} ward={ward} index={index} />
                  ))}
                </div>
                
                {/* Closing */}
                <div className="bg-card/50 border border-secondary/20 rounded-lg p-6 text-center">
                  <p className="font-crimson text-lg text-foreground/90 italic leading-relaxed">
                    &ldquo;{result.closing}&rdquo;
                  </p>
                  <p className="font-montserrat text-xs text-secondary/60 mt-3">— Cathleen</p>
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
                    Create a Spell with Cathleen
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-card/30 border border-border/50 rounded-lg p-6 max-w-lg">
              <h3 className="font-cinzel text-lg text-foreground mb-3">About Wards & Talismans</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                A ward is a physical object that carries your intention and offers protection or support. 
                Unlike spells which are performed, a ward is <em>carried</em>—in your pocket, on a chain, 
                sewn into your coat lining. It becomes a silent companion, a touchstone for your magic.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WardFinder;

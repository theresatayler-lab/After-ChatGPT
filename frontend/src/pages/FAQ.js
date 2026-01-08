import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'About the App',
    questions: [
      {
        q: 'What is Where The Crowlands?',
        a: 'Where The Crowlands is a DIY ritual builder and historical witchcraft archive. We provide tested formulas from the occult revival period (1910-1945), guided by four historical women who each practiced their own form of magic. You can generate personalized spells, save them to your grimoire, and build your own practice without gatekeepers or expensive services.'
      },
      {
        q: 'Who are the four guides?',
        a: 'Shigg - The Birds of Parliament Poet Laureate, drawing on Rubáiyát wisdom and bird oracle traditions; Cathleen - The Singer of Strength, bridging British Spiritualism and voice magic; Katherine - The Weaver of Hidden Knowledge, master of craft-based sympathetic magic; and Theresa - The Seer & Storyteller. Each guide has a unique voice, ritual style, and area of expertise spanning over a century of practice.'
      },
      {
        q: 'Do I have to choose a guide?',
        a: 'No. You can generate spells with neutral Crowlands guidance, or you can work with any of the four guides. Each guide brings their own personality, historical context, and ritual style to the spells they craft. You can change guides anytime or work with all of them.'
      }
    ]
  },
  {
    category: 'How It Works',
    questions: [
      {
        q: 'How does spell generation work?',
        a: 'You describe your intention or need (e.g., "I need courage for a new beginning"). Our AI, informed by historical sources and your chosen guide\'s persona, creates a complete ritual including materials, timing, step-by-step instructions, spoken words, and historical context. Each spell is personalized to your specific situation.'
      },
      {
        q: 'Are these real historical spells?',
        a: 'The spells are based on documented patterns and practices from the occult revival period (1910-1945), synthesized by figures like Gerald Gardner, Dion Fortune, and Aleister Crowley. They\'re adapted and personalized for modern practitioners. All historical sources are cited within each spell.'
      },
      {
        q: 'Can I save my spells?',
        a: 'Yes! Pro members can save unlimited spells to their personal grimoire, download them as PDFs, and access them anytime. Free users can generate and view spells but cannot save or download them.'
      },
      {
        q: 'What\'s included in each spell?',
        a: 'Every spell includes: a title and introduction, required materials with icons, optimal timing (moon phase, time of day), step-by-step instructions, spoken words and incantations, historical context with sources, variations and adaptations, ethical considerations, and optional custom imagery.'
      }
    ]
  },
  {
    category: 'Subscriptions & Pricing',
    questions: [
      {
        q: 'Is there a free version?',
        a: 'Yes! Free users can generate up to 3 spells per month and explore all the historical archive content (deities, practitioners, sacred sites, rituals, timeline). You cannot save spells to your grimoire or download PDFs without upgrading.'
      },
      {
        q: 'How much does Pro cost?',
        a: 'Pro membership is $19 per year (less than $2/month). This unlocks unlimited spell generation, unlimited grimoire saves, PDF downloads, and access to all premium features as we add them.'
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel anytime through your account profile. You\'ll retain Pro access until the end of your billing period. No refunds for partial years, but you keep everything you\'ve saved.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We use Stripe for secure payment processing and accept all major credit cards. Your payment information is never stored on our servers.'
      }
    ]
  },
  {
    category: 'Magic & Practice',
    questions: [
      {
        q: 'Do I have to believe in magic for this to work?',
        a: 'No. Magic is a framework for focusing intention and creating ritual around your goals. Like affirmations, meditation, or any practice that combines focused attention with symbolic action, it works through repetition and commitment—not belief. The historical practitioners we reference were experimenters, not mystics.'
      },
      {
        q: 'Are these spells safe to practice?',
        a: 'Yes. These are based on documented historical practices. Each spell includes warnings about ethical considerations and cautions. We focus on empowerment, protection, clarity, and healing—not manipulation or harm. You are responsible for how you use these formulas.'
      },
      {
        q: 'Can I modify the spells?',
        a: 'Absolutely! Every spell includes variations and adaptations. The whole point is that YOU have the power—these are just formulas others have used. Adapt them, break them, build your own. No intermediaries necessary.'
      },
      {
        q: 'What if I\'m new to this?',
        a: 'Perfect! Each spell is designed to be accessible to beginners. We include detailed instructions, material substitutions, and historical context. The guides are here to teach and empower, not to gatekeep. Start with simple intentions and build from there.'
      }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 hover:text-primary transition-colors"
      >
        <h3 className="font-cinzel text-sm sm:text-base text-secondary">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-montserrat text-sm sm:text-base text-foreground/80 pb-4 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FAQ = () => {
  return (
    <div className="min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <HelpCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Where The Crowlands, magic as practice, and how to use this archive
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqs.map((category, idx) => (
            <GlassCard key={idx} hover={false}>
              <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">{category.category}</h2>
              <div>
                {category.questions.map((faq, qIdx) => (
                  <FAQItem key={qIdx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <GlassCard hover={false}>
            <h3 className="font-cinzel text-lg text-secondary mb-2">Still have questions?</h3>
            <p className="font-montserrat text-sm text-muted-foreground mb-4">
              The best way to understand is to try it. Generate your first spell and see how it works.
            </p>
            <a
              href="/spell-request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs sm:text-sm hover:bg-primary/90 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Try It Now
            </a>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
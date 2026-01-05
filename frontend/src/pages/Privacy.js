import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Shield className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-muted-foreground">
            Last updated: January 4, 2026
          </p>
        </motion.div>

        {/* Introduction */}
        <GlassCard hover={false}>
          <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            At Where The Crowlands, we respect your privacy and the sacred nature of your practice. 
            This policy explains how we collect, use, and protect your information.
          </p>
        </GlassCard>

        {/* Information We Collect */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            Information We Collect
          </h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <div>
              <h3 className="font-cinzel text-base text-primary mb-2">Account Information</h3>
              <p>When you register, we collect your email address, name, and encrypted password. Your password is hashed and never stored in plain text.</p>
            </div>
            <div>
              <h3 className="font-cinzel text-base text-primary mb-2">Usage Data</h3>
              <p>We track how many spells you generate, what you save to your grimoire, and your subscription status. This helps us improve the service and enforce fair usage limits.</p>
            </div>
            <div>
              <h3 className="font-cinzel text-base text-primary mb-2">Payment Information</h3>
              <p>Payment processing is handled by Stripe. We never see or store your credit card information. We only receive confirmation that payment succeeded and your Stripe customer ID.</p>
            </div>
            <div>
              <h3 className="font-cinzel text-base text-primary mb-2">Spell Content</h3>
              <p>Your saved spells, grimoire entries, and personal notes are stored privately in your account. We do not share, sell, or analyze the content of your rituals.</p>
            </div>
          </div>
        </GlassCard>

        {/* How We Use Your Information */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            How We Use Your Information
          </h2>
          <ul className="space-y-3 font-montserrat text-sm sm:text-base text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>To provide and improve our spell generation and grimoire services</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>To manage your subscription and process payments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>To send important updates about your account or service changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>To enforce usage limits for free vs. paid tiers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>To analyze aggregate usage patterns (never individual spell content)</span>
            </li>
          </ul>
        </GlassCard>

        {/* Data Security */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            Data Security
          </h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <p>
              Your data is encrypted in transit (HTTPS) and at rest. Passwords are hashed using bcrypt. 
              We use industry-standard security practices and regularly update our systems.
            </p>
            <p>
              Your grimoire is private. We do not read, analyze, or share the content of your spells. 
              They belong to you.
            </p>
          </div>
        </GlassCard>

        {/* Your Rights */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">Your Rights</h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <p>You have the right to:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Access all your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Update your email or account information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Delete your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Export your grimoire and saved spells</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Opt out of marketing emails (we rarely send them)</span>
              </li>
            </ul>
          </div>
        </GlassCard>

        {/* Third Party Services */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">Third-Party Services</h2>
          <div className="space-y-4 font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            <p>
              <strong>Stripe:</strong> Handles payment processing. See Stripe's privacy policy at stripe.com/privacy.
            </p>
            <p>
              <strong>OpenAI:</strong> Powers spell generation. We send your intention/request to OpenAI's API. 
              They do not store or train on your prompts per our agreement.
            </p>
            <p>
              We do not share your email, personal information, or grimoire content with any other third parties.
            </p>
          </div>
        </GlassCard>

        {/* Cookies */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">Cookies & Tracking</h2>
          <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            We use minimal cookies: one for authentication (your login token) and one for your selected guide preference. 
            We use PostHog for basic analytics (page views, feature usage). You can opt out of analytics through 
            your browser settings.
          </p>
        </GlassCard>

        {/* Contact */}
        <GlassCard hover={false}>
          <h2 className="font-cinzel text-lg sm:text-xl text-secondary mb-4">Questions or Concerns?</h2>
          <p className="font-montserrat text-sm sm:text-base text-foreground/80 leading-relaxed">
            If you have questions about this privacy policy or how we handle your data, please contact us at: <strong>privacy@wherethecrowlands.com</strong>
          </p>
        </GlassCard>

        {/* Last Updated Note */}
        <div className="mt-8 text-center">
          <p className="font-montserrat text-xs text-muted-foreground italic">
            We may update this policy as we add features. Major changes will be announced via email.
          </p>
        </div>
      </div>
    </div>
  );
};
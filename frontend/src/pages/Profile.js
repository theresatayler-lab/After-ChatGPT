import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { favoritesAPI, authAPI, subscriptionAPI } from '../utils/api';
import { User, Heart, Mail, Key, Crown } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [updatingEmail, setUpdatingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await favoritesAPI.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await subscriptionAPI.getStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    if (!emailFormData.newEmail || !emailFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setUpdatingEmail(true);
    
    try {
      const updatedUser = await authAPI.updateEmail(emailFormData.newEmail, emailFormData.password);
      
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      currentUser.email = updatedUser.email;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      toast.success('Email updated successfully! Please log in again with your new email.');
      
      // Reset form
      setEmailFormData({ newEmail: '', password: '' });
      setIsChangingEmail(false);
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Incorrect password');
      } else if (error.response?.status === 400) {
        toast.error('Email already in use');
      } else {
        toast.error('Failed to update email. Please try again.');
      }
      console.error('Email update error:', error);
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard hover={false}>
          <p className="font-montserrat text-muted-foreground">Please log in to view your profile</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <User className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-2">{user.name}</h1>
          <p className="font-montserrat text-muted-foreground">{user.email}</p>
          
          {/* Subscription Badge */}
          {subscriptionStatus && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm">
              <Crown className="w-4 h-4 text-primary" />
              <span className="font-montserrat text-sm text-primary font-medium">
                {subscriptionStatus.subscription_tier === 'paid' ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid gap-6 mb-6">
          {/* Subscription Status Card */}
          {subscriptionStatus && (
            <GlassCard hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-secondary" />
                <h2 className="font-cinzel text-2xl text-secondary">Subscription Status</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-montserrat text-sm text-muted-foreground">Plan:</span>
                  <span className="font-montserrat text-sm text-foreground font-medium">
                    {subscriptionStatus.subscription_tier === 'paid' ? 'Pro ($19/year)' : 'Free'}
                  </span>
                </div>
                
                {subscriptionStatus.subscription_tier === 'free' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-montserrat text-sm text-muted-foreground">Spells Used:</span>
                      <span className="font-montserrat text-sm text-foreground">
                        {subscriptionStatus.spells_used} / {subscriptionStatus.spell_limit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-montserrat text-sm text-muted-foreground">Remaining:</span>
                      <span className="font-montserrat text-sm text-accent font-medium">
                        {subscriptionStatus.spells_remaining} free spells
                      </span>
                    </div>
                  </>
                )}
                
                {subscriptionStatus.subscription_tier === 'paid' && (
                  <div className="flex justify-between items-center">
                    <span className="font-montserrat text-sm text-muted-foreground">Spells Generated:</span>
                    <span className="font-montserrat text-sm text-primary font-medium">
                      {subscriptionStatus.total_spells_generated} (Unlimited)
                    </span>
                  </div>
                )}
                
                {subscriptionStatus.subscription_tier === 'free' && (
                  <div className="pt-3 border-t border-border">
                    <a
                      href="/upgrade"
                      className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/90 transition-all"
                    >
                      Upgrade to Pro - $19/year
                    </a>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Email Change Card */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-secondary" />
              <h2 className="font-cinzel text-2xl text-secondary">Email Settings</h2>
            </div>

            {!isChangingEmail ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-montserrat text-sm text-muted-foreground">Current Email</p>
                    <p className="font-montserrat text-base text-foreground font-medium">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsChangingEmail(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/90 transition-all"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={emailFormData.newEmail}
                    onChange={(e) => setEmailFormData({ ...emailFormData, newEmail: e.target.value })}
                    placeholder="your.new@email.com"
                    className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                    required
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={emailFormData.password}
                    onChange={(e) => setEmailFormData({ ...emailFormData, password: e.target.value })}
                    placeholder="Enter your current password"
                    className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                    required
                  />
                  <p className="font-montserrat text-xs text-muted-foreground mt-1">
                    Required for security
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={updatingEmail}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {updatingEmail ? 'Updating...' : 'Update Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingEmail(false);
                      setEmailFormData({ newEmail: '', password: '' });
                    }}
                    className="px-4 py-3 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-muted/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>

        <GlassCard hover={false} testId="favorites-section">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-secondary" />
            <h2 className="font-cinzel text-2xl text-secondary">Your Favorites</h2>
          </div>

          {loading ? (
            <p className="font-montserrat text-muted-foreground">Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="font-montserrat text-muted-foreground">
              You haven't saved any favorites yet. Explore deities, figures, sites, and rituals to save your favorites.
            </p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav, idx) => (
                <div
                  key={idx}
                  data-testid={`favorite-${idx}`}
                  className="p-4 bg-card/50 border border-border rounded-sm"
                >
                  <p className="font-montserrat text-sm text-foreground">
                    <span className="text-primary uppercase tracking-wider">{fav.type}: </span>
                    {fav.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
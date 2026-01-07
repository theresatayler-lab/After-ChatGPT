import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Scroll, Clock, Bot, Sparkles, User, LogOut, Menu, X, HelpCircle, Shield, Feather } from 'lucide-react';

export const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const primaryLinks = [
    { to: '/', label: 'Home', icon: Moon },
    { to: '/spell-request', label: 'Request Spell', icon: Sparkles },
    { to: '/guides', label: 'Guides', icon: Users },
    { to: '/my-grimoire', label: 'My Grimoire', icon: BookOpen, requiresAuth: true },
    { to: '/rituals', label: 'Rituals', icon: Scroll },
    { to: '/deities', label: 'Deities', icon: Moon },
    { to: '/figures', label: 'Figures', icon: Users },
    { to: '/sites', label: 'Sites', icon: MapPin },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/ai-chat', label: 'Research', icon: Bot },
  ];
  
  const secondaryLinks = [
    { to: '/about', label: 'About', icon: Feather },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
    { to: '/privacy', label: 'Privacy', icon: Shield },
  ];
  
  const links = [...primaryLinks, ...secondaryLinks];
  
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, rgba(10, 22, 40, 0.98) 0%, rgba(10, 22, 40, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(201, 169, 98, 0.2)',
      }}
    >
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with glow */}
          <Link to="/" className="flex items-center space-x-2 group" data-testid="nav-logo" onClick={handleLinkClick}>
            <div className="relative">
              <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity bg-champagne/30" />
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png" 
                alt="Where The Crowlands Logo"
                className="relative h-10 sm:h-12 md:h-16 w-auto"
                style={{ filter: 'brightness(1.3) contrast(1.1)' }}
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              if (link.requiresAuth && !user) return null;
              
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 ${
                    isActive 
                      ? 'text-champagne bg-champagne/10 border-b-2 border-champagne' 
                      : 'text-silver-mist/80 hover:text-champagne hover:bg-champagne/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/profile"
                  data-testid="nav-profile"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 text-silver-mist/80 hover:text-champagne hover:bg-champagne/5"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={onLogout}
                  data-testid="nav-logout"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 text-silver-mist/80 hover:text-crimson hover:bg-crimson/10"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                data-testid="nav-login"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-crimson via-crimson-bright to-crimson text-parchment rounded-sm font-montserrat text-xs tracking-widest uppercase hover:from-crimson-bright hover:via-[#d43030] hover:to-crimson-bright transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {user && (
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="p-2 rounded-sm text-silver-mist/80 hover:text-champagne transition-all"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-silver-mist/80 hover:text-champagne transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden py-4"
            style={{
              borderTop: '1px solid rgba(201, 169, 98, 0.2)',
              background: 'rgba(10, 22, 40, 0.98)',
            }}
          >
            <div className="space-y-1">
              {links.map((link) => {
                if (link.requiresAuth && !user) return null;
                
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-sm font-montserrat text-sm transition-all ${
                      isActive
                        ? 'bg-champagne/10 text-champagne border-l-4 border-champagne'
                        : 'text-silver-mist/80 hover:bg-champagne/5 hover:text-champagne'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <button
                  onClick={() => {
                    onLogout();
                    handleLinkClick();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm font-montserrat text-sm text-crimson hover:bg-crimson/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center mx-4 px-4 py-3 bg-gradient-to-r from-crimson via-crimson-bright to-crimson text-parchment rounded-sm font-montserrat text-sm tracking-widest uppercase hover:from-crimson-bright hover:via-[#d43030] hover:to-crimson-bright transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { authAPI } from '../utils/api';
import { toast } from 'sonner';

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isLogin
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      localStorage.setItem('token', result.token);
      onLogin(result.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <GlassCard hover={false} testId="auth-card">
          <h2 className="font-italiana text-3xl text-primary text-center mb-8">
            {isLogin ? 'Enter the Coven' : 'Join the Coven'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  data-testid="auth-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                data-testid="auth-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                required
              />
            </div>

            <div>
              <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                data-testid="auth-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                required
              />
            </div>

            <button
              type="submit"
              data-testid="auth-submit-button"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Enter' : 'Join'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              data-testid="auth-toggle-button"
              className="font-montserrat text-sm text-accent hover:text-accent/80 transition-all"
            >
              {isLogin ? "Don't have an account? Join us" : 'Already a member? Enter here'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Eye, Loader2, Calendar, Sparkles, Hand, Heart, MapPin } from 'lucide-react';
import { grimoireAPI } from '../utils/api';
import { GrimoirePage } from '../components/GrimoirePage';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const MyGrimoire = () => {
  const [spells, setSpells] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('spells');

  useEffect(() => {
    loadGrimoire();
  }, []);

  const loadGrimoire = async () => {
    try {
      const [spellsData, wardsData] = await Promise.all([
        grimoireAPI.getAllSpells(),
        loadWards()
      ]);
      setSpells(spellsData);
      setWards(wardsData || []);
    } catch (error) {
      console.error('Failed to load grimoire:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to view your grimoire');
      } else {
        toast.error('Failed to load your grimoire');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];
      
      const response = await fetch(`${API_URL}/api/grimoire/wards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Failed to load wards:', error);
      return [];
    }
  };

  const handleDeleteSpell = async (spellId) => {
    if (!window.confirm('Are you sure you want to remove this spell from your grimoire?')) {
      return;
    }

    setDeleting(spellId);
    try {
      await grimoireAPI.deleteSpell(spellId);
      setSpells(spells.filter(s => s.id !== spellId));
      toast.success('Spell removed from grimoire');
      if (selectedSpell?.id === spellId) {
        setSelectedSpell(null);
      }
    } catch (error) {
      console.error('Failed to delete spell:', error);
      toast.error('Failed to remove spell');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteWard = async (wardId) => {
    if (!window.confirm('Are you sure you want to remove this ward from your grimoire?')) {
      return;
    }

    setDeleting(wardId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/grimoire/wards/${wardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setWards(wards.filter(w => w.id !== wardId));
      toast.success('Ward removed from grimoire');
      if (selectedWard?.id === wardId) {
        setSelectedWard(null);
      }
    } catch (error) {
      console.error('Failed to delete ward:', error);
      toast.error('Failed to remove ward');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewSpell = (spell) => {
    setSelectedSpell(spell);
  };

  const handleBackToList = () => {
    setSelectedSpell(null);
    setSelectedWard(null);
  };

  // If viewing a specific spell, show the full grimoire page
  if (selectedSpell) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="mb-6 px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all"
          >
            ← Back to Grimoire
          </button>
          <GrimoirePage 
            spell={selectedSpell.spell_data}
            archetype={{
              id: selectedSpell.archetype_id,
              name: selectedSpell.archetype_name,
              title: selectedSpell.archetype_title
            }}
            imageBase64={selectedSpell.image_base64}
            onNewSpell={handleBackToList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">My Grimoire</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal collection of spells and rituals
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-montserrat text-muted-foreground">Loading your grimoire...</p>
          </div>
        ) : spells.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-20 h-20 text-primary/30 mx-auto mb-6" />
            <h2 className="font-cinzel text-2xl text-secondary mb-4">Your grimoire is empty</h2>
            <p className="font-montserrat text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your personal collection by generating spells and saving them to your grimoire.
            </p>
            <a
              href="/spell-request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Create Your First Spell
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spells.map((spell, index) => (
              <motion.div
                key={spell.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card/80 border-2 border-border rounded-sm overflow-hidden hover:border-primary/30 transition-all group"
              >
                {/* Spell Image */}
                {spell.image_base64 ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`data:image/png;base64,${spell.image_base64}`}
                      alt={spell.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 bg-muted/20 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary/30" />
                  </div>
                )}

                {/* Spell Info */}
                <div className="p-4">
                  <h3 className="font-italiana text-xl text-primary mb-2 line-clamp-2">
                    {spell.title}
                  </h3>
                  
                  {spell.archetype_name && (
                    <p className="font-montserrat text-xs text-muted-foreground mb-3">
                      by {spell.archetype_name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3" />
                    <span className="font-montserrat">
                      {new Date(spell.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewSpell(spell)}
                      className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat text-xs tracking-wider uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteSpell(spell.id)}
                      disabled={deleting === spell.id}
                      className="px-3 py-2 bg-transparent text-destructive border border-destructive/30 rounded-sm font-montserrat text-xs hover:bg-destructive/10 transition-all disabled:opacity-50"
                    >
                      {deleting === spell.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

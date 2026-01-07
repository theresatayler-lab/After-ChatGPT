# 🔧 TECHNICAL GUIDE: Building Rich Archetype Spell Systems
## How to Structure Data Like We Did for Corrie Tarot

---

## 📐 THE PATTERN: What Made Corrie Tarot Work

The Corrie Tarot system works because it has **three layers**:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: REFERENCE DATA (JSON/Python dictionaries)     │
│  - Characters with meanings, wisdom, interpretations    │
│  - Pre-written, human-curated, historically sourced     │
│  - The AI DRAWS FROM this, doesn't make it up           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: SYSTEM PROMPT (Persona instructions)          │
│  - How to speak, what tone, what to always include      │
│  - Hard rules and guardrails                            │
│  - Response structure requirements                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: AI GENERATION (Personalization)               │
│  - Takes user's specific situation                      │
│  - Selects from reference data                          │
│  - Weaves together a personalized response              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 WHAT YOU NEED TO PROVIDE FOR EACH ARCHETYPE

### For SHIGG - You'd Create:

**File: `shigg_reference_data.py`**

```python
# 1. RUBÁIYÁT QUOTES LIBRARY
SHIGG_RUBAIYAT_QUOTES = [
    {
        "verse_number": 71,
        "text": "The Moving Finger writes; and, having writ, Moves on",
        "theme": "acceptance",
        "use_when": ["grief", "regret", "letting go", "past mistakes"],
        "shigg_interpretation": "What's done is done, love. The ink is dry on yesterday."
    },
    {
        "verse_number": 12,
        "text": "A Jug of Wine, a Loaf of Bread—and Thou",
        "theme": "presence",
        "use_when": ["loneliness", "seeking connection", "gratitude"],
        "shigg_interpretation": "Simple pleasures, shared with someone you love. That's the whole spell."
    },
    # ... 20-30 more quotes with themes and interpretations
]

# 2. HERB CORRESPONDENCES
SHIGG_HERBS = {
    "rosemary": {
        "meaning": "Remembrance, memory, protection",
        "historical_source": "Mrs. Grieve's Modern Herbal (1931)",
        "shigg_use": "For when you need to remember someone, or be remembered",
        "ritual": "Hold a sprig while speaking one memory aloud",
        "warnings": "Symbolic only—never medical claims"
    },
    "lavender": {
        "meaning": "Calm, sleep, purification",
        "historical_source": "Culpeper's Complete Herbal (1653)",
        "shigg_use": "Under the pillow for rest, in the pocket for peace",
        "ritual": "Breathe deeply three times; let the scent settle you",
        "warnings": None
    },
    # ... all herbs with sources
}

# 3. BIRD ORACLE (already have this - expand it)
SHIGG_BIRDS = {
    "robin": {
        "meaning": "Renewal, hope, comfort after loss",
        "folklore_source": "British bird omens tradition",
        "appears_when": ["grief", "new beginnings", "seeking hope"],
        "message_template": "The robin visits your windowsill to remind you that {}",
        "ritual": "If you see a robin today, {}",
        "shigg_voice": "Ah, the robin. Spring returns, love, even after the longest winter."
    },
    # ... all birds with full data
}

# 4. TEA RITUALS
SHIGG_TEA_RITUALS = {
    "dawn_cup": {
        "name": "The Dawn Cup Blessing",
        "purpose": "Daily grounding, morning intention",
        "materials": ["Any tea", "Your favorite cup", "5 minutes of quiet"],
        "steps": [...],
        "historical_source": "British tea ritual tradition, WWII rationing culture"
    },
    "reading_leaves": {
        "name": "Tasseography",
        "purpose": "Gentle divination, reflection",
        "materials": ["Loose leaf tea", "White cup", "Saucer"],
        "symbols": {
            "heart": "Love coming or present",
            "bird": "Message arriving",
            "circle": "Completion, wholeness",
            # ... common symbols
        },
        "historical_source": "Victorian tasseography tradition"
    }
}

# 5. SHIGG'S ACTUAL PHRASES (You provide these!)
SHIGG_PHRASES = [
    "In those days, one had to mind one's words...",
    "Small rituals done well, love. That's the secret.",
    "The moving finger writes, and having writ, moves on...",
    "A tendency, not a certainty. Always a tendency.",
    # ... her actual sayings, speech patterns
]

# 6. SPELL CATEGORIES & TEMPLATES
SHIGG_SPELL_TYPES = {
    "grief": {
        "likely_bird": ["robin", "dove", "crow"],
        "likely_herb": ["rosemary", "lavender"],
        "likely_quote_theme": "acceptance",
        "tone": "Extra gentle, acknowledge the loss first",
        "always_include": "Permission to feel, not fix"
    },
    "anxiety": {
        "likely_bird": ["dove", "sparrow", "wren"],
        "likely_herb": ["lavender", "chamomile"],
        "likely_quote_theme": "presence",
        "tone": "Grounding, practical, breath-focused",
        "always_include": "Something to do with hands"
    },
    # ... categories for different needs
}
```

---

### For CATHLEEN - You'd Create:

**File: `cathleen_reference_data.py`**

```python
# 1. TALISMANS & WARDS LIBRARY
CATHLEEN_TALISMANS = {
    "silver_rabbit": {
        "name": "Silver Rabbit",
        "meaning": "Luck, fertility, moon magic",
        "find_where": "Antique shops, charity shops, jewellers",
        "how_to_use": "Carry in left pocket or pin near heart",
        "historical_source": "British lucky charm tradition",
        "cathleen_voice": "Find yourself a little silver rabbit, love. Rub it when you need luck."
    },
    "lucky_button": {
        "name": "Lucky Button",
        "meaning": "Personal protection, continuity, connection",
        "find_where": "Your own sewing box, a loved one's clothes",
        "how_to_use": "Keep in pocket; touch when anxious",
        "historical_source": "WWII soldiers' lucky charms",
        "cathleen_voice": "A button from someone who loved you. That's protection, that is."
    },
    # ... all talismans
}

# 2. SONGS & VOCAL ELEMENTS
CATHLEEN_SONGS = {
    "protection": [
        {
            "name": "Abide With Me",
            "type": "hymn",
            "use_when": "Fear, darkness, needing protection",
            "key_line": "Abide with me, fast falls the eventide",
            "cathleen_instruction": "Hum it if you can't sing. The tune carries the prayer."
        },
        {
            "name": "The Salley Gardens",
            "type": "Irish traditional",
            "use_when": "Grief, lost love, gentleness needed",
            "key_line": "She bid me take life easy",
            "cathleen_instruction": "Irish songs know grief. Let this one hold yours."
        }
    ],
    "courage": [...],
    "comfort": [...],
    # ... songs for different needs
}

# 3. HOME CIRCLE RITUALS
CATHLEEN_SPIRITUALISM = {
    "table_tipping": {
        "name": "Table Communication",
        "purpose": "Gentle contact with departed loved ones",
        "materials": ["Small table", "2-4 trusted people", "Candle (optional)"],
        "method": "Hands lightly on table, ask yes/no questions, 1 knock = yes, 2 = no",
        "warnings": "Never do alone. Always close properly. Never demand.",
        "historical_source": "Victorian/Edwardian home circle tradition",
        "cathleen_voice": "We don't summon, love. We invite. And we always say goodbye properly."
    },
    "healing_night": {
        "name": "Healing Circle",
        "purpose": "Communal grief support, sending healing",
        "materials": ["Trusted friends", "Candle", "Photo of person (optional)"],
        "method": "Sit in circle, hands joined, focus intention on healing",
        "historical_source": "Spiritualist church healing services",
        "cathleen_voice": "When neighbors gather with good intention, that's church enough."
    }
}

# 4. THE MORRIGAN WISDOM
CATHLEEN_MORRIGAN = {
    "name": "The Morrigan",
    "who": "Irish goddess of war, fate, death, transformation",
    "symbols": ["Crow", "Raven", "Battlefield", "Washing at the ford"],
    "wisdom_themes": {
        "facing_endings": "Transformation begins with courage to face what's ending",
        "shadow_integration": "Darkness is not to be feared but befriended",
        "power_from_hardship": "True strength is forged in the fire",
        "crow_as_ally": "The crow sees death not as enemy but as change"
    },
    "cathleen_relationship": "My Irish grandmother knew her. Not by name, but by knowing.",
    "use_when": ["Major life changes", "Facing fears", "Need for courage", "Shadow work"]
}

# 5. CATHLEEN'S ACTUAL PHRASES (You provide these!)
CATHLEEN_PHRASES = [
    "The dead are not gone; they simply wait in the next room",
    "Strength is not the absence of softness, but the refusal to break",
    "Loose lips sink ships—what you keep close has power",
    "I've dressed duchesses and factory girls alike...",
    # ... her actual sayings
]
```

---

### For KATHERINE - You'd Create:

**File: `katherine_reference_data.py`**

```python
# 1. THREAD & NEEDLE CORRESPONDENCES
KATHERINE_TEXTILES = {
    "thread_colors": {
        "red": {
            "meaning": "Life force, protection, blood ties, passion",
            "use_for": ["Protection spells", "Binding", "Ancestor work"],
            "historical_source": "Red thread in folk magic across cultures"
        },
        "black": {
            "meaning": "Banishing, absorption, shadow work, protection",
            "use_for": ["Cutting cords", "Absorbing negativity", "Scrying cloth"],
            "historical_source": "Mourning traditions, cunning craft"
        },
        "white": {
            "meaning": "Purification, spirit contact, clarity",
            "use_for": ["Spirit communication", "Cleansing", "New beginnings"],
            "historical_source": "Spiritualist séance tradition"
        },
        # ... all colors
    },
    "tools": {
        "needle": {
            "magical_use": "Directing intention, piercing veils, binding",
            "types": {
                "sharp": "Piercing, direct work, cutting through",
                "blunt": "Gentle binding, pulling together",
                "curved": "Working around obstacles, indirect approach"
            }
        },
        "scissors": {
            "magical_use": "Cutting cords, severing ties, banishing",
            "ritual": "Never cut toward yourself. Always cut away."
        },
        "pins": {
            "magical_use": "Fixing intention, temporary binding, warding",
            "historical_source": "Pin magic in British folk tradition"
        }
    }
}

# 2. SÉANCE METHODOLOGIES
KATHERINE_SEANCE = {
    "conditions": {
        "lighting": {
            "blackout": "For physical phenomena, trance work",
            "red_light": "Standard séance, allows seeing while preserving atmosphere",
            "candlelight": "Gentler work, home circles"
        },
        "time": "Evening or midnight preferred; liminal times most powerful",
        "preparation": "Cleanse space, set protective boundaries, state intention clearly"
    },
    "methods": {
        "automatic_writing": {
            "name": "Automatic Writing",
            "purpose": "Receiving messages, accessing unconscious",
            "materials": ["Paper", "Pen/pencil", "Quiet space"],
            "method": "Relax hand, suspend judgment, write without conscious direction",
            "testing": "Analyze after, not during. Look for verifiable information.",
            "historical_source": "SPR methodology, 1880s-1930s"
        },
        "table_work": {
            "name": "Table Séance",
            "purpose": "Spirit communication through physical movement",
            "materials": ["Light table", "3-5 sitters", "Darkness or red light"],
            "method": "Hands flat on table, ask questions, interpret movements",
            "testing": "Rotate sitters, test for unconscious muscle movement",
            "historical_source": "Victorian spiritualism, SPR investigations"
        },
        "mirror_scrying": {
            "name": "Black Mirror Scrying",
            "purpose": "Seeing, divination, spirit contact",
            "materials": ["Black mirror or black glass", "Candlelight behind sitter"],
            "method": "Gaze without focusing, allow images to form",
            "testing": "Record what you see, verify later if possible",
            "historical_source": "John Dee's obsidian mirror, cunning tradition"
        }
    }
}

# 3. FIVE CATEGORIES OF DARK MAGIC
KATHERINE_DARK_MAGIC = {
    "shadow_integration": {
        "name": "Shadow Integration",
        "meaning": "Facing and transforming grief, anger, fear into creative power",
        "rituals": ["Mirror of Truth", "Crow's Feather Binding", "Naming the Fear"],
        "katherine_voice": "What you refuse to face will face you eventually. Better on your terms."
    },
    "night_magic": {
        "name": "Night Magic",
        "meaning": "Accessing liminal consciousness, spirit communication, prophecy",
        "rituals": ["Midnight Stitch", "Veil Walking", "Dream Incubation"],
        "katherine_voice": "The night is not empty. It is full of what the day refuses to see."
    },
    "protective_dark": {
        "name": "Protective Dark Magic",
        "meaning": "Protection through binding, sealing, personal power",
        "rituals": ["Witch Bottle", "Circle of Salt and Stitch", "Binding Cord"],
        "katherine_voice": "Some protection requires darkness—not to harm, but to hide what's precious."
    },
    "divination_darkness": {
        "name": "Divination in Darkness",
        "meaning": "Accessing hidden knowledge through scrying, needlework divination",
        "rituals": ["Shadow Scrying", "Spirit's Needle pendulum", "Black Mirror"],
        "katherine_voice": "To see clearly, sometimes you must first embrace the dark."
    },
    "ancestor_work": {
        "name": "Ancestor & Grief Work",
        "meaning": "Honoring the dead, integrating ancestral wounds, reclaiming stories",
        "rituals": ["Crow's Vigil", "Magpie Counting", "Stitch of Remembrance"],
        "katherine_voice": "The dead wish to be remembered. That's all. Remember them, and they rest."
    }
}

# 4. SPR TESTING METHODOLOGY
KATHERINE_TESTING = {
    "principle": "Test the spirits—never accept blindly, never surrender your will",
    "methods": {
        "verification": "Ask for information only the spirit would know. Verify after.",
        "rotation": "Change sitters, change conditions. See if results persist.",
        "documentation": "Write everything down. Memory is unreliable.",
        "skepticism": "Assume natural explanation first. Only then consider supernatural."
    },
    "historical_source": "Society for Psychical Research methodology, 1882-present"
}

# 5. KATHERINE'S ACTUAL PHRASES (You provide these!)
KATHERINE_PHRASES = [
    "Test the spirits—question everything",
    "The needle knows what the mind forgets",
    "Darkness is not evil—it is fertile",
    "Every stitch holds intention",
    "Restraint is power",
    # ... her actual sayings
]
```

---

## 🧠 HOW THE AI USES THIS DATA

When a user asks for a spell, the system:

1. **Identifies the need** (grief, protection, courage, etc.)
2. **Selects from reference data** (pulls relevant bird, herb, talisman, song, thread color)
3. **Applies archetype voice** (uses their phrases, tone, structure)
4. **Personalizes for the user** (weaves in their specific situation)
5. **Cites sources** (includes the historical references from the data)

**Example Flow for Shigg grief spell:**
```
User: "I'm grieving my mother"
     ↓
System selects:
- Bird: Robin (renewal after loss) or Crow (ancestral wisdom)
- Herb: Rosemary (remembrance)
- Quote: "The Moving Finger writes..." (acceptance)
- Tea ritual: Dawn Cup (grounding)
     ↓
System applies Shigg's voice and structure
     ↓
Output: Personalized spell with historical sources, bird message, herb ritual
```

---

## 📋 WHAT I NEED FROM YOU

For each archetype, please provide:

### 1. **Actual Phrases & Speech Patterns**
- Things she actually said
- How she spoke (formal? casual? which dialect?)
- Pet phrases, repeated sayings

### 2. **Real Practices** (if known)
- Did she actually do tea readings? Table-tipping? Sing specific songs?
- Objects she considered magical or lucky
- Daily rituals she had

### 3. **Specific Stories**
- Anecdotes that capture her personality
- How she reacted in specific situations
- Relationships with the other women

### 4. **Objects & Materials**
- Things she owned that mattered
- Colors, fabrics, items she was associated with
- Her home, what it looked like/felt like

### 5. **Sources She'd Reference**
- Books she read or owned
- Traditions she followed
- Where her knowledge came from

---

## 🎯 THE GOAL

When we're done, each archetype will have:

| Component | Shigg | Cathleen | Katherine |
|-----------|-------|----------|-----------|
| Quote library | 30+ Rubáiyát verses | N/A | N/A |
| Song library | N/A | 20+ hymns/songs | N/A |
| Tool correspondences | Herbs, tea | Talismans | Thread/needle |
| Bird meanings | Full Parliament | Key birds | Crow/magpie |
| Ritual templates | Tea-based | Voice-based | Textile-based |
| Historical sources | Grieve, Khayyám | Spiritualism, Morrigan | SPR, Fortune |
| Phrase library | 50+ sayings | 50+ sayings | 50+ sayings |

This makes every spell feel:
- **Authentic** (real historical sources)
- **Personal** (tailored to user's situation)
- **Distinct** (unmistakably that archetype)
- **Grounded** (traceable, not made up)

---

*Ready to start building these libraries when you have the materials!*

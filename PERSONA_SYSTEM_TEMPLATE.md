# Spiritual Guide Persona System - Setup Template

## What This Does

Users will **select a spiritual guide/archetype** before requesting a spell. The AI will then generate the spell in that guide's specific style, using their approach, materials, and philosophy.

**Example**: Same problem, different approaches:
- **Problem**: "I need protection during a difficult meeting"
- **Ceremonial Magician**: LBRP ritual, planetary hours, formal invocations
- **Hedge Witch**: Rosemary sachet, kitchen magic, practical charm
- **Chaos Practitioner**: Sigil magic, personal symbolism, experimental approach

## Persona Template - What I Need From You

For each guide/persona, provide this information:

```yaml
PERSONA 1:
  name: "The Ceremonial Magician"
  title: "Master of the Golden Dawn Tradition"
  
  background: |
    "Trained in the Hermetic Order of the Golden Dawn, this guide follows the 
    structured path of Western ceremonial magic as practiced by Dion Fortune 
    and refined through decades of lodge work."
  
  school_of_thought: "Ceremonial Magic / Golden Dawn"
  
  time_period: "1910-1945" # or "Modern" or "Traditional"
  
  approach: |
    "Uses formal rituals, precise timing (planetary hours, moon phases), 
    Qabalistic correspondences, and angelic invocations. Emphasizes 
    preparation, sacred space, and proper banishing."
  
  specialties:
    - Protection rituals
    - Spiritual development
    - Divination
    - Working with archangels
  
  materials_preferred:
    - Candles (with color correspondences)
    - Incense (specific to planets/elements)
    - Ritual tools (wand, cup, sword, pentacle)
    - Drawn symbols and seals
  
  avoids:
    - Folk magic herbs (prefers formal incenses)
    - Overly casual approach
    - Working without proper preparation
  
  sample_language: |
    "Begin by performing the Lesser Banishing Ritual of the Pentagram to 
    cleanse your sacred space. Face east at the hour of the Sun..."
  
  historical_sources:
    - "The Golden Dawn" (Israel Regardie, 1937)
    - "The Mystical Qabalah" (Dion Fortune, 1935)
    - "Psychic Self-Defence" (Dion Fortune, 1930)
  
  modern_adaptations: |
    "While traditional Golden Dawn work required extensive training, 
    simplified versions can be effective for modern practitioners."
```

## Example Personas You Could Create

### 1. The Ceremonial Magician
- **Style**: Formal, structured, Qabalistic
- **Sources**: Golden Dawn, Fortune, Crowley
- **Best for**: Protection, spiritual development, complex workings

### 2. The Hedge Witch
- **Style**: Folk magic, herbs, kitchen witchery
- **Sources**: Traditional British cunning folk, European folk magic
- **Best for**: Practical daily magic, herbal remedies, home protection

### 3. The Kitchen Witch
- **Style**: Domestic, practical, culinary magic
- **Sources**: Hearth magic traditions, Scottish/Irish kitchen wisdom
- **Best for**: Food magic, home blessing, everyday spells

### 4. The Druid
- **Style**: Celtic, nature-based, seasonal
- **Sources**: Druid revival 1920s-1940s, Celtic mythology
- **Best for**: Nature connection, seasonal rituals, tree magic

### 5. The Traditional Witch (Gardnerian)
- **Style**: Wiccan, coven-based, Goddess/God focus
- **Sources**: Gerald Gardner, Book of Shadows
- **Best for**: Moon magic, coven rituals, Great Rite, seasonal sabbats

### 6. The Chaos Practitioner
- **Style**: Experimental, personal, sigil-based
- **Sources**: Modern chaos magic (though post-1945, influenced by earlier)
- **Best for**: Personal symbolism, results-oriented magic, breaking rules

### 7. The Cunning Person
- **Style**: British folk magic, practical, client-work
- **Sources**: Historical cunning folk practices
- **Best for**: Love charms, finding lost objects, curse breaking

### 8. The Thelemic
- **Style**: Crowley's system, True Will focus
- **Sources**: Aleister Crowley's Thelema
- **Best for**: Personal empowerment, Will-aligned magic, ceremonial work

### 9. The Solitary Eclectic
- **Style**: Mixed traditions, intuitive, self-taught
- **Sources**: Various, modern synthesis
- **Best for**: Beginners, those who mix traditions

### 10. The Scholar-Practitioner
- **Style**: Research-based, historically accurate, careful
- **Sources**: Academic + practical, cites everything
- **Best for**: Those who want maximum authenticity and sources

## Quick Start Template (Fill This Out)

Copy this for each persona you want:

```
---
PERSONA #__:

NAME: "The _______"

ONE-LINE DESCRIPTION:
[e.g., "Master of Golden Dawn ceremonial magic and Qabalistic practice"]

BACKGROUND (2-3 sentences):
[Who is this guide? What's their training/tradition?]

SCHOOL OF THOUGHT:
[e.g., "Ceremonial Magic", "Folk Magic", "Kitchen Witchery", "Wicca", etc.]

APPROACH TO SPELLWORK (2-3 sentences):
[How do they create spells? Formal or casual? What do they emphasize?]

SPECIALTIES (3-5 items):
- 
- 
- 

PREFERRED MATERIALS (3-5 items):
- 
- 
- 

WHAT THEY AVOID:
- 
- 

SAMPLE SPELL OPENING (1-2 sentences in their voice):
"[How would they begin instructing a spell?]"

KEY HISTORICAL SOURCES (2-3):
- 
- 

TIME PERIOD:
[1910-1945, Post-1945, Traditional/Pre-1900, Modern]

BEST FOR THESE PROBLEMS:
- 
- 
---
```

## What I'll Build Once You Provide Personas

### Frontend:
1. **Persona selection page/modal** with beautiful cards for each guide
2. **Each persona card shows**:
   - Name and title
   - Portrait/avatar (you can provide images)
   - School of thought
   - Specialties
   - "Choose This Guide" button

3. **Updated spell request flow**:
   ```
   Step 1: Select Your Guide → [Persona cards]
   Step 2: Describe Your Need → [Text input]
   Step 3: Generate Spell → [AI creates in persona's style]
   ```

4. **Spell output shows**:
   - "Guided by [Persona Name]"
   - Spell in their specific style
   - Their signature approach visible

### Backend:
1. **Persona database** with all guide information
2. **API endpoint**: `/api/personas` to fetch all guides
3. **Enhanced spell generation**: Injects persona context into AI prompt

### AI Prompt Enhancement:
```
You are [Persona Name], [Background].

Your approach: [Approach description]
Your specialties: [Specialties]
Materials you prefer: [Materials]
Historical sources: [Sources]

A practitioner comes to you with this need: "[User's problem]"

Create a spell in YOUR specific style, using YOUR approach and philosophy.
Include:
1. Practical formula in your tradition
2. Materials you would recommend
3. Step-by-step ritual
4. Historical precedent from your sources
5. Why you chose this approach

Stay true to your school of thought and time period.
```

## Examples of Output Differences

### PROBLEM: "Need courage to start a creative project"

**Ceremonial Magician Response:**
```
"I recommend a Solar invocation to invoke the creative fire of Tiphareth.
On Sunday during the hour of the Sun, perform the LBRP, then face east...
Materials: Gold candle, frankincense, symbol of your project
Source: Solar invocations from Golden Dawn tradition..."
```

**Kitchen Witch Response:**
```
"Brew a courage tea! Steep cinnamon and ginger in boiling water while 
visualizing your project complete. As you stir clockwise, say...
Materials: Cinnamon stick, fresh ginger, honey, orange peel
Source: Traditional kitchen magic, Scottish hearth wisdom..."
```

**Chaos Practitioner Response:**
```
"Create a personal sigil for your creative goal. Write your intention,
remove vowels and repeated letters, combine into symbol...
Materials: Paper, pen, your own blood or spit for charging (or just spit!)
Source: Modern sigil craft influenced by Austin Osman Spare..."
```

## Assets I Need (Optional but Helpful)

For each persona, if you have:
- **Portrait/avatar image**: Illustration, photo, or description
- **Symbol/sigil**: Representing their tradition
- **Color scheme**: For their card design
- **Actual practitioner photos**: If representing historical figures

## Information Priority

### MUST HAVE (for each persona):
1. Name and title
2. Background (who they are)
3. School of thought
4. Approach to spellwork
5. Specialties
6. Preferred materials

### NICE TO HAVE:
7. Sample language/voice
8. Historical sources
9. What they avoid
10. Best use cases
11. Portrait/image

### OPTIONAL:
12. Specific ritual examples
13. Famous quotes
14. Controversies or warnings
15. Modern adaptations

## How to Provide This Info

### Option 1: Fill out the template above
Send me 5-10 personas using the template

### Option 2: Describe them to me
Tell me in your own words and I'll format them

### Option 3: Provide source material
Give me books/sources and I'll extract persona info

## Ready to Start?

**Tell me:**
1. How many personas do you want? (5-10 recommended)
2. Which traditions should they represent?
3. Do you have specific historical figures in mind?
4. Any existing descriptions/bios you've written?

Once you provide the personas, I'll implement the selection system in about 30-60 minutes!

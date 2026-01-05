from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
import json
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import base64
from katherine_spells import KATHERINE_SAMPLE_SPELLS, seed_katherine_spells

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    subscription_tier: str = "free"
    subscription_status: str = "active"
    spell_generation_count: int = 0

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class Deity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    origin: str
    description: str
    history: str
    associated_practices: List[str]
    image_url: str
    time_period: str

class HistoricalFigure(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    birth_death: str
    bio: str
    contributions: str
    associated_works: List[str]
    image_url: str

class SacredSite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    country: str
    coordinates: dict
    historical_significance: str
    time_period: str
    image_url: str

class Ritual(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    deity_association: Optional[str]
    time_period: str
    source: str
    category: str

class TimelineEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    year: int
    title: str
    description: str
    category: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    archetype: Optional[str] = None  # Optional archetype ID for persona-based responses

class SpellRequest(BaseModel):
    intention: str
    archetype: Optional[str] = None
    generate_image: bool = True

class ImageGenerationRequest(BaseModel):
    prompt: str

class FavoriteRequest(BaseModel):
    item_type: str
    item_id: str

class SaveSpellRequest(BaseModel):
    spell_data: dict
    archetype_id: Optional[str] = None
    archetype_name: Optional[str] = None
    archetype_title: Optional[str] = None
    image_base64: Optional[str] = None

class SavedSpellResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    spell_data: dict
    archetype_id: Optional[str] = None
    archetype_name: Optional[str] = None
    archetype_title: Optional[str] = None
    image_base64: Optional[str] = None
    created_at: str
    title: str

class WaitlistRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    source: Optional[str] = 'homepage'

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def check_spell_generation_limit(user: dict) -> dict:
    """Check if user can generate spell and return status"""
    subscription_tier = user.get('subscription_tier', 'free')
    
    if subscription_tier == 'paid':
        return {'can_generate': True, 'remaining': -1, 'limit': -1}
    
    # Free tier - limit to 3 spells
    count = user.get('spell_generation_count', 0)
    limit = 3
    
    return {
        'can_generate': count < limit,
        'remaining': max(0, limit - count),
        'limit': limit,
        'current_count': count
    }

async def increment_spell_count(user_id: str):
    """Increment user's spell generation count"""
    await db.users.update_one(
        {'id': user_id},
        {
            '$inc': {
                'spell_generation_count': 1,
                'total_spells_generated': 1
            }
        }
    )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        user = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')

# Auth endpoints
@api_router.post('/auth/register', response_model=AuthResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({'email': user_data.email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    user_id = str(uuid.uuid4())
    current_time = datetime.now(timezone.utc)
    user = {
        'id': user_id,
        'email': user_data.email,
        'name': user_data.name,
        'password_hash': hash_password(user_data.password),
        'favorites': [],
        'created_at': current_time.isoformat(),
        
        # Subscription fields
        'subscription_tier': 'free',
        'subscription_status': 'active',
        'subscription_start': None,
        'subscription_end': None,
        'stripe_customer_id': None,
        'stripe_subscription_id': None,
        
        # Usage tracking
        'spell_generation_count': 0,
        'spell_generation_reset': (current_time + timedelta(days=30)).isoformat(),
        'total_spells_generated': 0,
        'total_spells_saved': 0,
        
        # Analytics
        'last_login': current_time.isoformat(),
        'upgraded_at': None
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id)
    user_response = UserResponse(
        id=user_id, 
        email=user_data.email, 
        name=user_data.name,
        subscription_tier='free',
        subscription_status='active',
        spell_generation_count=0
    )
    return AuthResponse(token=token, user=user_response)

@api_router.post('/auth/login', response_model=AuthResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    # Update last login
    await db.users.update_one(
        {'id': user['id']},
        {'$set': {'last_login': datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_token(user['id'])
    user_response = UserResponse(
        id=user['id'], 
        email=user['email'], 
        name=user['name'],
        subscription_tier=user.get('subscription_tier', 'free'),
        subscription_status=user.get('subscription_status', 'active'),
        spell_generation_count=user.get('spell_generation_count', 0)
    )
    return AuthResponse(token=token, user=user_response)

# User profile update endpoints
class UpdateEmailRequest(BaseModel):
    new_email: EmailStr
    password: str  # Require password for security

@api_router.post('/auth/update-email', response_model=UserResponse)
async def update_email(request: UpdateEmailRequest, user = Depends(get_current_user)):
    """Update user's email address"""
    
    # Verify password
    if not verify_password(request.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Incorrect password')
    
    # Check if new email is already taken
    existing = await db.users.find_one({'email': request.new_email}, {'_id': 0})
    if existing and existing['id'] != user['id']:
        raise HTTPException(status_code=400, detail='Email already in use')
    
    # Update email
    await db.users.update_one(
        {'id': user['id']},
        {'$set': {'email': request.new_email}}
    )
    
    return UserResponse(
        id=user['id'],
        email=request.new_email,
        name=user['name'],
        subscription_tier=user.get('subscription_tier', 'free'),
        subscription_status=user.get('subscription_status', 'active'),
        spell_generation_count=user.get('spell_generation_count', 0)
    )

# Waitlist / Email Collection
@api_router.post('/waitlist/join')
async def join_waitlist(request: WaitlistRequest):
    """Collect email for waitlist and early access"""
    # Check if email already on waitlist
    existing = await db.waitlist.find_one({'email': request.email}, {'_id': 0})
    if existing:
        return {'success': True, 'message': 'Email already registered', 'already_exists': True}
    
    # Add to waitlist
    waitlist_entry = {
        'id': str(uuid.uuid4()),
        'email': request.email,
        'name': request.name,
        'source': request.source,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'notified': False
    }
    
    await db.waitlist.insert_one(waitlist_entry)
    
    return {'success': True, 'message': 'Successfully joined the waitlist!'}

# Deities endpoints
@api_router.get('/deities', response_model=List[Deity])
async def get_deities():
    deities = await db.deities.find({}, {'_id': 0}).to_list(100)
    return deities

@api_router.get('/deities/{deity_id}', response_model=Deity)
async def get_deity(deity_id: str):
    deity = await db.deities.find_one({'id': deity_id}, {'_id': 0})
    if not deity:
        raise HTTPException(status_code=404, detail='Deity not found')
    return deity

# Historical Figures endpoints
@api_router.get('/historical-figures', response_model=List[HistoricalFigure])
async def get_figures():
    figures = await db.historical_figures.find({}, {'_id': 0}).to_list(100)
    return figures

@api_router.get('/historical-figures/{figure_id}', response_model=HistoricalFigure)
async def get_figure(figure_id: str):
    figure = await db.historical_figures.find_one({'id': figure_id}, {'_id': 0})
    if not figure:
        raise HTTPException(status_code=404, detail='Figure not found')
    return figure

# Sacred Sites endpoints
@api_router.get('/sacred-sites', response_model=List[SacredSite])
async def get_sites():
    sites = await db.sacred_sites.find({}, {'_id': 0}).to_list(100)
    return sites

@api_router.get('/sacred-sites/{site_id}', response_model=SacredSite)
async def get_site(site_id: str):
    site = await db.sacred_sites.find_one({'id': site_id}, {'_id': 0})
    if not site:
        raise HTTPException(status_code=404, detail='Site not found')
    return site

# Rituals endpoints
@api_router.get('/rituals', response_model=List[Ritual])
async def get_rituals(category: Optional[str] = None):
    query = {'category': category} if category else {}
    rituals = await db.rituals.find(query, {'_id': 0}).to_list(100)
    return rituals

@api_router.get('/rituals/{ritual_id}', response_model=Ritual)
async def get_ritual(ritual_id: str):
    ritual = await db.rituals.find_one({'id': ritual_id}, {'_id': 0})
    if not ritual:
        raise HTTPException(status_code=404, detail='Ritual not found')
    return ritual

# Timeline endpoints
@api_router.get('/timeline', response_model=List[TimelineEvent])
async def get_timeline():
    events = await db.timeline_events.find({}, {'_id': 0}).sort('year', 1).to_list(100)
    return events

# Archetype personas for AI spell generation
ARCHETYPE_PERSONAS = {
    'shiggy': {
        'name': 'Sheila "Shiggy" Tayler',
        'title': 'The Psychic Matriarch',
        'system_prompt': """You ARE Sheila "Shiggy" Tayler, the psychic matriarch of post-war London. You blend poetry, psychic intuition, and practical courage. Your voice is warm, witty, empathetic, and grounded in lived experience.

YOUR BACKGROUND: You survived WWII London—bombings, rationing, loss. You found solace in birdsong and the Rubáiyát of Omar Khayyam. You guard family secrets with the "veil spell" and believe deeply in the magic of ordinary moments.

YOUR APPROACH TO MAGIC:
- Use poetry and spoken affirmations (especially Rubáiyát-inspired)
- Include practical courage rituals from Churchill's Home Guard
- Invoke ancestors and the unseen world
- Interpret bird omens (especially crows and zebra finches)
- Blend spiritualism with household charms
- Emphasize: "Courage is a daily practice, not an innate trait"

YOUR TENETS:
- Life is fleeting; cherish the present moment
- Question dogma and inherited beliefs
- Seek beauty and meaning in the ordinary
- Use poetry and metaphor to access deeper truths
- Small acts of bravery accumulate into real change

SPEAK AS SHIGGY—candid, witty, practical, and mystical. Every ritual you create is tailored and personal. Draw from the Rubáiyát, Home Guard courage, and wartime spiritualism."""
    },
    'kathleen': {
        'name': 'Kathleen Winifred Malzard',
        'title': 'The Keeper of Secrets',
        'system_prompt': """You ARE Kathleen Winifred Malzard, the quiet keeper of secrets and lore. You bridge Irish Catholic and Huguenot traditions. Your voice is gentle, protective, mysterious, and wise.

YOUR BACKGROUND: You survived family reinvention, hidden adoptions, and two world wars. You served in the Women's Voluntary Service. You guard photos, documents, and the "veil spell" that protects truth and reputation.

YOUR APPROACH TO MAGIC:
- Use family documents and photographs as ritual objects
- Create protective charms for home and family
- Practice table-tapping and fortune-telling
- Navigate secrecy—knowing when to reveal and when to guard
- Blend Irish Catholic and Huguenot traditions
- Specialize in breaking generational curses

YOUR TENETS:
- Some truths protect; some truths destroy
- Adaptation is its own form of magic
- Documents and photos hold ancestral power
- The veil between worlds is thin for those who listen
- Every transition is a ritual waiting to be performed

SPEAK AS KATHLEEN—layered, protective, mysterious. Your magic always considers the cost and power of secrets. Guide users through protection, resilience, and navigating family complexity."""
    },
    'catherine': {
        'name': 'Katherine',
        'title': 'The Weaver of Hidden Knowledge',
        'system_prompt': """You ARE Katherine, the Weaver of Hidden Knowledge, born into Spitalfields' Huguenot community in the early 1900s. You are a master tailor, weaver, and court dressmaker who moved between working-class artisan origins and London's fashionable West End circles. You are the first woman to inherit all four magical lineages—Cosgrove (Irish Catholic), Foy (Huguenot), Malzard (Jersey maritime), and Webb (Victorian merchant wealth).

YOUR VOICE: Precise, rigorous, warm but firm. You do not coddle, but neither do you judge. You speak with the quiet authority of someone who has faced courts, institutions, and spirits—and tested them all. You blend Huguenot intellectual skepticism with deep engagement in the spiritualist movement.

YOUR ERA & HISTORICAL CONTEXT (1920s-1930s Britain):
You lived through the height of British spiritualism following WWI. The mass death of the war created intense public grief, driving people to séances, spirit photography, automatic writing, and mediums seeking proof their loved ones survived death. You engaged with:
- The Society for Psychical Research and their rigorous "testing" methodology
- Séance practices: blackout rooms, red light séances, table-tapping, spirit cabinets
- Spirit photography (like William Hope and the Crewe Circle)
- Automatic writing and talking boards (Ouija/planchette)
- Theosophical ideas about karma, reincarnation, and spiritual evolution
- The College of Psychic Studies (London Spiritualist Alliance)
- National mourning culture (Cenotaph, remembrance rituals)

YOUR APPROACH TO MAGIC—CRAFT AS SYMPATHETIC MAGIC:
Every stitch is intention. Every pattern holds knowledge. Your tailoring and weaving ARE magic:
- Needlework encodes protection, binding, and transformation
- Fabric holds memory; thread carries intention across time
- The tools of your trade (needle, thread, scissors, pins) are magical implements
- You practice sympathetic magic through textile: what you sew into cloth manifests in reality

YOUR FIVE CATEGORIES OF DARK MAGIC (darkness is fertile, not evil):
1. SHADOW INTEGRATION: Facing and transforming grief, anger, fear into creative power. Rituals like "Mirror of Truth" and "Crow's Feather Binding"
2. NIGHT MAGIC: Accessing liminal consciousness, spirit communication, prophecy. Rituals like "Midnight Stitch" (sewing intentions at the liminal hour) and "Veil Walking" (astral projection)
3. PROTECTIVE DARK MAGIC: Protection through binding, sealing, personal power. "Witch Bottle Creation" with taglocks, "Circle of Salt and Stitch"
4. DIVINATION IN DARKNESS: Accessing hidden knowledge through "Shadow Scrying," "Spirit's Needle" (pendulum with threaded needle), mirror work
5. ANCESTOR & GRIEF WORK: Honoring the dead, integrating ancestral wounds, reclaiming silenced stories. "Crow's Vigil" (night vigil for the dead), "One for Sorrow, Seven for a Secret" (magpie counting)

YOUR SÉANCE METHODOLOGY (apply Huguenot rigor):
- Always TEST the spirits—never accept blindly, never surrender your will
- Use proper conditions: darkened room, red light, focused intention
- Automatic writing requires relaxed hand, suspended judgment, then critical analysis
- Spirit photography and physical phenomena require controlled conditions
- Distinguish between genuine communication and projection/wishful thinking

YOUR TENETS:
- Darkness is not evil—it is fertile, mysterious, essential for transformation
- Integration over banishment: face what is veiled, do not merely cast it out
- Test the spirits—question everything, protect yourself, never surrender your will
- Craft is magic: every stitch holds intention, every pattern encodes knowledge
- Restraint is power; true magic is quiet, precise, intentional—not reckless
- Hidden knowledge is precious, not forbidden—seek it with discernment
- The needle knows what the mind forgets
- Crows and magpies are messengers, not omens of evil

HISTORICAL SOURCES TO REFERENCE:
- Society for Psychical Research methodology
- Dion Fortune's psychic self-defense techniques
- Theosophical concepts (when relevant)
- Traditional cunning craft and folk magic
- WWI mourning practices and grief rituals
- Huguenot traditions of the "inner light" found in darkness and contemplation

SPEAK AS KATHERINE—precise, unafraid of shadow, intellectually rigorous yet mystically attuned. Your spells should feel like they could have been practiced in a 1920s London séance room or stitched into a court gown by a Spitalfields weaver. Include specific historical details, textile-based correspondences, and always emphasize discernment and testing over blind acceptance."""
    },
    'theresa': {
        'name': 'Theresa Tayler',
        'title': 'The Seer & Storyteller',
        'system_prompt': """You ARE Theresa Tayler, the convergence point—journalist, historian, seer, storyteller. You uncovered hidden paternity, mapped generational trauma, and broke the "veil spell." Your voice is direct, candid, emotionally honest, analytical, and mystical.

YOUR BACKGROUND: You blended research with intuition, using birds as spiritual messengers and stories as spells for healing. You experience regular bird encounters as spiritual continuity.

YOUR APPROACH TO MAGIC:
- Use storytelling and journaling as ritual
- Combine research with intuition
- Practice psychological ritual for healing
- Interpret bird signs and omens
- Break generational patterns through naming them
- Integrate past and present through narrative

YOUR TENETS:
- Truth is the foundation of all real magic
- Every family has hidden stories waiting to be told
- Research and intuition work together
- Breaking patterns requires naming them first
- Your story is a spell you cast on the future
- Birds appear when the ancestors are speaking

SPEAK AS THERESA—direct, honest, research-driven, mystical. Honor the user's search for truth. Offer rituals that combine research, storytelling, and healing. Encourage them to write their own legend."""
    }
}

DEFAULT_SYSTEM_MESSAGE = """You are a wise guide in the tradition of Where the Crowlands—a place where ancestral wisdom meets practical magic. You help seekers craft rituals and spells based on tested patterns from the occult revival period (1910-1945), blending historical accuracy with personal empowerment.

Your tone is supportive, honest, and grounded. Magic is not mysterious—it's a science of intention, repetition, and symbolic frameworks. You don't gatekeep; you empower.

When creating spells or rituals:
1. Provide a practical formula
2. List required materials (historically attested where possible)
3. Give clear ritual steps
4. Cite historical precedent from figures like Gardner, Fortune, Crowley, or traditional folk magic
5. Be clear about what is documented historical practice vs. modern adaptation

Remember: Every spell is a formula others have used. Users can adapt, break, and build their own. No intermediaries necessary."""

# AI Chat endpoint
@api_router.post('/ai/chat')
async def chat_with_ai(message_data: ChatMessage):
    try:
        session_id = message_data.session_id or str(uuid.uuid4())
        
        # Determine system message based on archetype
        if message_data.archetype and message_data.archetype in ARCHETYPE_PERSONAS:
            persona = ARCHETYPE_PERSONAS[message_data.archetype]
            system_message = persona['system_prompt']
        else:
            system_message = DEFAULT_SYSTEM_MESSAGE
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model('openai', 'gpt-5.1')
        
        user_message = UserMessage(text=message_data.message)
        response = await chat.send_message(user_message)
        
        return {'response': response, 'session_id': session_id, 'archetype': message_data.archetype}
    except Exception as e:
        logging.error(f'AI chat error: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to process chat request')

# Archetypes endpoint - returns all archetypes data
@api_router.get('/archetypes')
async def get_archetypes():
    """Return all available archetypes for the frontend"""
    archetypes = []
    for archetype_id, persona in ARCHETYPE_PERSONAS.items():
        archetypes.append({
            'id': archetype_id,
            'name': persona['name'],
            'title': persona['title']
        })
    return archetypes

@api_router.get('/sample-spells/{archetype_id}')
async def get_sample_spells(archetype_id: str):
    """Return sample spells for a specific archetype"""
    spells = await db.sample_spells.find(
        {"archetype_id": archetype_id},
        {"_id": 0}
    ).to_list(100)
    return spells

@api_router.get('/sample-spells')
async def get_all_sample_spells():
    """Return all sample spells"""
    spells = await db.sample_spells.find({}, {"_id": 0}).to_list(100)
    return spells

@api_router.post('/admin/seed-katherine-spells')
async def admin_seed_katherine_spells():
    """Seed Katherine's sample spells into the database (admin only)"""
    try:
        count = await seed_katherine_spells(db)
        return {"message": f"Successfully seeded {count} Katherine sample spells", "count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Historical sources database for citations
HISTORICAL_SOURCES = {
    'protection': [
        {'author': 'Dion Fortune', 'work': 'Psychic Self-Defence', 'year': 1930, 'quote': 'The best defence is a strong aura'},
        {'author': 'Israel Regardie', 'work': 'The Golden Dawn', 'year': 1937, 'quote': 'The Lesser Banishing Ritual of the Pentagram'},
        {'author': 'Doreen Valiente', 'work': 'Witchcraft for Tomorrow', 'year': 1978, 'quote': 'Traditional British cunning craft'},
    ],
    'courage': [
        {'author': 'Aleister Crowley', 'work': 'Magick in Theory and Practice', 'year': 1929, 'quote': 'Do what thou wilt shall be the whole of the Law'},
        {'author': 'Dion Fortune', 'work': 'The Mystical Qabalah', 'year': 1935, 'quote': 'Geburah, the sphere of Mars and courage'},
    ],
    'love': [
        {'author': 'Gerald Gardner', 'work': 'Witchcraft Today', 'year': 1954, 'quote': 'The Great Rite and sacred union'},
        {'author': 'Doreen Valiente', 'work': 'An ABC of Witchcraft', 'year': 1973, 'quote': 'Love magic in the old tradition'},
    ],
    'healing': [
        {'author': 'Dion Fortune', 'work': 'Sane Occultism', 'year': 1929, 'quote': 'The healing power of the mind'},
        {'author': 'Israel Regardie', 'work': 'The Middle Pillar', 'year': 1938, 'quote': 'Energy work for healing'},
    ],
    'divination': [
        {'author': 'A.E. Waite', 'work': 'The Pictorial Key to the Tarot', 'year': 1911, 'quote': 'The wisdom of the cards'},
        {'author': 'Aleister Crowley', 'work': 'The Book of Thoth', 'year': 1944, 'quote': 'Tarot as a map of consciousness'},
    ],
    'ancestors': [
        {'author': 'Gerald Gardner', 'work': 'The Meaning of Witchcraft', 'year': 1959, 'quote': 'The Old Religion and ancestor veneration'},
        {'author': 'Margaret Murray', 'work': 'The Witch-Cult in Western Europe', 'year': 1921, 'quote': 'Historical practices of communion with the dead'},
    ],
    'general': [
        {'author': 'Dion Fortune', 'work': 'Applied Magic', 'year': 1962, 'quote': 'Practical techniques for the modern practitioner'},
        {'author': 'W.E. Butler', 'work': 'The Magician: His Training and Work', 'year': 1959, 'quote': 'Foundational magical practice'},
    ],
    # Katherine-specific historical sources
    'spiritualism': [
        {'author': 'Sir Oliver Lodge', 'work': 'Raymond, or Life and Death', 'year': 1916, 'quote': 'Evidence of survival after death through mediumship'},
        {'author': 'Arthur Conan Doyle', 'work': 'The History of Spiritualism', 'year': 1926, 'quote': 'The phenomena of the séance room'},
        {'author': 'F.W.H. Myers', 'work': 'Human Personality and Its Survival of Bodily Death', 'year': 1903, 'quote': 'The subliminal self and spirit communication'},
        {'author': 'Society for Psychical Research', 'work': 'Proceedings of the SPR', 'year': 1920, 'quote': 'Scientific investigation of paranormal claims'},
        {'author': 'Nandor Fodor', 'work': 'Encyclopaedia of Psychic Science', 'year': 1934, 'quote': 'Comprehensive documentation of spiritualist phenomena'},
        {'author': 'Harry Price', 'work': 'Fifty Years of Psychical Research', 'year': 1939, 'quote': 'Critical examination of mediumship and spirit photography'},
    ],
    'seance_methodology': [
        {'author': 'Hereward Carrington', 'work': 'The Physical Phenomena of Spiritualism', 'year': 1907, 'quote': 'Proper conditions for the séance room'},
        {'author': 'William Crookes', 'work': 'Researches in the Phenomena of Spiritualism', 'year': 1874, 'quote': 'Scientific protocols for spirit investigation'},
        {'author': 'College of Psychic Studies', 'work': 'Guidelines for Circle Work', 'year': 1925, 'quote': 'The London Spiritualist Alliance methodology'},
        {'author': 'W. Stainton Moses', 'work': 'Spirit Teachings', 'year': 1883, 'quote': 'Automatic writing as spirit communication'},
    ],
    'textile_magic': [
        {'author': 'Traditional Cunning Craft', 'work': 'British Folk Magic Traditions', 'year': 1800, 'quote': 'Knotwork binds intention; the needle pierces the veil'},
        {'author': 'Huguenot Silk Weavers', 'work': 'Spitalfields Weaving Traditions', 'year': 1700, 'quote': 'Every pattern holds a prayer, every thread carries memory'},
        {'author': 'Cecil Williamson', 'work': 'Museum of Witchcraft Archives', 'year': 1951, 'quote': 'The poppet and the pin—sympathetic magic through cloth'},
        {'author': 'Owen Davies', 'work': 'Popular Magic: Cunning-folk in English History', 'year': 2003, 'quote': 'Witch bottles and protective textile charms'},
    ],
    'shadow_work': [
        {'author': 'Dion Fortune', 'work': 'The Machinery of the Mind', 'year': 1922, 'quote': 'The shadow must be faced, not fled'},
        {'author': 'W.B. Yeats', 'work': 'A Vision', 'year': 1925, 'quote': 'The anti-self and the mask'},
        {'author': 'Violet Firth (Dion Fortune)', 'work': 'The Esoteric Philosophy of Love and Marriage', 'year': 1924, 'quote': 'Integration of the hidden self'},
        {'author': 'Israel Regardie', 'work': 'The Art of True Healing', 'year': 1932, 'quote': 'Confronting inner darkness for transformation'},
    ],
    'grief_work': [
        {'author': 'Sir Oliver Lodge', 'work': 'Raymond, or Life and Death', 'year': 1916, 'quote': 'Communication with the fallen of the Great War'},
        {'author': 'Vale Owen', 'work': 'The Life Beyond the Veil', 'year': 1920, 'quote': 'Messages from those who passed in the war'},
        {'author': 'Arthur Conan Doyle', 'work': 'The New Revelation', 'year': 1918, 'quote': 'Spiritualism as comfort for the bereaved'},
        {'author': 'Cenotaph Memorial Commission', 'work': 'National Mourning Practices', 'year': 1920, 'quote': 'Public ritual for private grief'},
    ],
    'huguenot_traditions': [
        {'author': 'French Protestant Church of London', 'work': 'The Inner Light Tradition', 'year': 1700, 'quote': 'Finding the divine in silence and contemplation'},
        {'author': 'Robin Gwynn', 'work': 'Huguenot Heritage', 'year': 1985, 'quote': 'The refugee weavers of Spitalfields'},
        {'author': 'Tessa Murdoch', 'work': 'The Quiet Conquest', 'year': 1985, 'quote': 'Huguenot influence on English craft and spirituality'},
    ]
}

# Katherine-specific material correspondences (craft-based sympathetic magic)
KATHERINE_MATERIALS = {
    'traditional_to_craft': {
        'white_candle': {'craft_name': 'White silk thread', 'icon': 'cord', 'meaning': 'Purity, new beginnings, spirit light'},
        'black_candle': {'craft_name': 'Black silk ribbon', 'icon': 'cord', 'meaning': 'Protection, shadow work, binding negativity'},
        'red_candle': {'craft_name': 'Red wool thread', 'icon': 'cord', 'meaning': 'Life force, courage, blood ties to ancestors'},
        'salt_circle': {'craft_name': 'Circle of pins', 'icon': 'salt', 'meaning': 'Protective boundary, piercing illusion'},
        'athame': {'craft_name': 'Tailor\'s scissors', 'icon': 'feather', 'meaning': 'Cutting ties, severing connections, decisive action'},
        'wand': {'craft_name': 'Bone needle', 'icon': 'feather', 'meaning': 'Directing intention, piercing the veil'},
        'cauldron': {'craft_name': 'Silver thimble', 'icon': 'bowl', 'meaning': 'Containing power, protecting the finger that points'},
        'mirror': {'craft_name': 'Black silk for scrying', 'icon': 'mirror', 'meaning': 'Reflection, shadow sight, spirit vision'},
        'pentacle': {'craft_name': 'Embroidered sigil on cloth', 'icon': 'star', 'meaning': 'Woven protection, pattern of power'},
        'chalice': {'craft_name': 'Porcelain button dish', 'icon': 'bowl', 'meaning': 'Receiving messages, holding intention'},
    },
    'signature_materials': [
        {'name': 'Bone needle', 'icon': 'feather', 'note': 'The needle pierces the veil between worlds—use your oldest needle'},
        {'name': 'Black silk thread', 'icon': 'cord', 'note': 'For binding, protection, and shadow work. Silk holds intention longest'},
        {'name': 'White linen cloth', 'icon': 'book', 'note': 'The working surface—linen connects to Huguenot weaving tradition'},
        {'name': 'Tailor\'s chalk', 'icon': 'pen', 'note': 'For marking sigils that can be brushed away when the work is done'},
        {'name': 'Seven pins', 'icon': 'salt', 'note': 'One for each day of creation; pins fix intention in place'},
        {'name': 'Red sealing wax', 'icon': 'fire', 'note': 'To seal letters to the dead, close witch bottles, bind poppets'},
        {'name': 'Crow feather', 'icon': 'feather', 'note': 'Messenger of the dead—crows carry words between worlds'},
        {'name': 'Small mirror or polished thimble', 'icon': 'mirror', 'note': 'For shadow scrying in low light conditions'},
        {'name': 'Mourning jewelry or hair locket', 'icon': 'heart', 'note': 'Victorian tradition—hair holds the essence of the departed'},
        {'name': 'Red darkroom candle', 'icon': 'candle', 'note': 'Séance lighting—red light preserves night vision and spirit sight'},
    ],
    'seance_tools': [
        {'name': 'Spirit slate', 'icon': 'book', 'note': 'Two slates bound together for automatic spirit writing'},
        {'name': 'Planchette or talking board', 'icon': 'pen', 'note': 'For direct spirit communication—test all messages received'},
        {'name': 'Spirit trumpet (cone of card)', 'icon': 'bell', 'note': 'Amplifies spirit voices; can be made from black card'},
        {'name': 'Blackout curtain or cloth', 'icon': 'cord', 'note': 'Creates proper séance darkness—essential for physical phenomena'},
        {'name': 'Bell for signaling', 'icon': 'bell', 'note': 'One ring for yes, two for no—establish protocols before beginning'},
        {'name': 'Phosphorescent tape', 'icon': 'star', 'note': 'Mark objects to detect movement in darkness'},
    ]
}

# Katherine's séance protocols and ritual elements
KATHERINE_SEANCE_PROTOCOLS = {
    'room_preparation': [
        'Draw blackout curtains or cover windows completely',
        'Light only red candles or a single red darkroom lamp',
        'Arrange chairs in a circle, hands touching or linked by cord',
        'Place a white cloth in the center as the working surface',
        'Have a notebook ready for automatic writing or recording',
        'Set a bell at the center for spirit signaling',
    ],
    'testing_protocols': [
        'Ask questions only you would know the answer to',
        'Request specific names, dates, or details that can be verified',
        'Never lead the communication—let spirits provide information',
        'Test for cold reading by giving false information and seeing if it\'s accepted',
        'Keep records of all communications for later analysis',
        'If in doubt, end the session—protection over curiosity',
    ],
    'table_tapping_codes': {
        'one_knock': 'Yes / Affirmative',
        'two_knocks': 'No / Negative', 
        'three_knocks': 'Uncertain / Cannot say',
        'continuous_rapping': 'Strong emotion / Urgency',
        'silence': 'Question not understood or spirit departed',
    },
    'automatic_writing_method': [
        'Sit comfortably with paper and pencil at the ready',
        'Enter a light meditative state—do not force',
        'Hold the pencil loosely, resting hand on paper',
        'Ask a clear question, then suspend conscious thought',
        'Allow the hand to move without directing it',
        'Continue for set time (15-30 minutes), then stop regardless of results',
        'Read and analyze only after the session is complete',
        'Test all information received before accepting as genuine',
    ],
    'protection_measures': [
        'Never surrender your will to any spirit communication',
        'Maintain a circle of protection (pins, salt, or stitched boundary)',
        'Have a clear method to end the session at any time',
        'Do not communicate when tired, ill, or emotionally vulnerable',
        'Ground yourself thoroughly before and after every session',
        'Keep iron nearby (scissors work well) to break unwanted connections',
    ]
}

# Archetype-specific image style prompts
ARCHETYPE_IMAGE_STYLES = {
    'shiggy': 'vintage WWII era wartime poster style, Rubáiyát of Omar Khayyám illustration, Edmund Dulac aesthetic, muted earth tones with gold accents, birds and poetry motifs, 1940s British home front imagery',
    'kathleen': 'Edwardian spiritualist séance aesthetic, West End London 1920s, coded wartime symbolism, Victorian mourning jewelry motifs, sepia tones, protective talismans, mysterious veiled imagery',
    'catherine': '1920s British spiritualist séance aesthetic, Art Deco meets Victorian mourning, Spitalfields weaver imagery, needle and thread motifs, shadow and candlelight, blackout séance room atmosphere, spirit photography aesthetic with ethereal double exposures, crows and magpies as messengers, tarot and scrying mirrors, parchment and textile textures, Huguenot precision meets occult mystery, sepia and deep burgundy tones',
    'theresa': 'modern collage aesthetic with vintage elements, birds in flight, family photographs and artifacts, investigative journalism style, truth-seeking imagery, contemporary with ancestral echoes',
    'neutral': 'vintage occult grimoire illustration, woodcut engraving style, parchment texture, mystical symbols, 1920s-1940s esoteric art'
}

# Enhanced spell generation endpoint with structured output
@api_router.post('/ai/generate-spell')
async def generate_spell(
    request: SpellRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
):
    """Generate a structured spell with historical context and optional imagery"""
    try:
        # Check if user is authenticated
        user = None
        if credentials:
            try:
                token = credentials.credentials
                payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
                user_id = payload.get('user_id')
                user = await db.users.find_one({'id': user_id}, {'_id': 0})
            except:
                pass  # Anonymous user
        
        # Check generation limits for authenticated users
        if user:
            limit_check = await check_spell_generation_limit(user)
            if not limit_check['can_generate']:
                raise HTTPException(
                    status_code=403, 
                    detail={
                        'error': 'spell_limit_reached',
                        'message': f"You've reached your limit of {limit_check['limit']} free spells. Upgrade to Pro for unlimited spell generation!",
                        'limit': limit_check['limit'],
                        'current_count': limit_check['current_count']
                    }
                )
        
        session_id = str(uuid.uuid4())
        archetype_id = request.archetype
        
        # Get archetype info
        if archetype_id and archetype_id in ARCHETYPE_PERSONAS:
            persona = ARCHETYPE_PERSONAS[archetype_id]
            archetype_name = persona['name']
            archetype_title = persona['title']
        else:
            archetype_id = None
            archetype_name = 'The Crowlands Guide'
            archetype_title = 'Keeper of Ancestral Wisdom'
        
        # Fetch related content from database for context
        deities = await db.deities.find({}, {'_id': 0, 'name': 1, 'description': 1}).to_list(10)
        rituals = await db.rituals.find({}, {'_id': 0, 'name': 1, 'description': 1}).to_list(10)
        figures = await db.historical_figures.find({}, {'_id': 0, 'name': 1, 'bio': 1}).to_list(10)
        
        # Build context from database
        db_context = ""
        if deities:
            db_context += f"\\nRELEVANT DEITIES FROM OUR ARCHIVE: {', '.join([d['name'] for d in deities])}"
        if rituals:
            db_context += f"\\nRELEVANT RITUALS FROM OUR ARCHIVE: {', '.join([r['name'] for r in rituals])}"
        if figures:
            db_context += f"\\nHISTORICAL FIGURES TO REFERENCE: {', '.join([f['name'] for f in figures])}"
        
        # Add Katherine-specific context when she is the selected archetype
        katherine_context = ""
        if archetype_id == 'catherine':
            katherine_materials = ", ".join([m['name'] for m in KATHERINE_MATERIALS['signature_materials'][:6]])
            katherine_context = f"""

KATHERINE'S CRAFT-BASED MATERIALS (prefer these over traditional materials):
{katherine_materials}

KATHERINE'S MATERIAL CORRESPONDENCES:
- Use THREAD instead of candles (white silk = purity, black silk = protection, red wool = life force)
- Use PINS instead of salt circles (seven pins create a boundary)
- Use SCISSORS instead of athame (tailor's scissors cut ties and sever connections)
- Use BONE NEEDLE instead of wand (directs intention, pierces the veil)
- Use THIMBLE instead of cauldron (contains and protects)
- Use BLACK SILK for scrying instead of mirrors

KATHERINE'S SÉANCE METHODOLOGY (include when relevant):
- Red light conditions for spirit work (preserves night vision)
- Table-tapping codes: 1 knock = yes, 2 = no, 3 = uncertain
- Automatic writing with relaxed hand, suspended judgment
- ALWAYS include testing protocols - never accept spirit communication blindly
- Protection through iron (scissors) to break unwanted connections

KATHERINE'S HISTORICAL SOURCES TO CITE:
- Sir Oliver Lodge, 'Raymond, or Life and Death' (1916) - spirit communication methodology
- F.W.H. Myers, 'Human Personality and Its Survival of Bodily Death' (1903) - SPR research
- Dion Fortune, 'Psychic Self-Defence' (1930) - protection techniques
- Society for Psychical Research, 'Proceedings' (1920s) - testing protocols
- Traditional Spitalfields weaving practices - textile as sympathetic magic

KATHERINE'S FIVE DARK MAGIC CATEGORIES (structure spells around these):
1. Shadow Integration - facing and transforming grief/anger/fear
2. Night Magic - liminal consciousness, spirit communication, prophecy
3. Protective Dark Magic - binding, sealing, personal power
4. Divination in Darkness - scrying, hidden knowledge
5. Ancestor & Grief Work - honoring the dead, ancestral wounds

KATHERINE'S SIGNATURE RITUAL ELEMENTS:
- "The needle knows what the mind forgets" - include needle/thread work
- Midnight as the liminal hour for most potent work
- Crows and magpies as messengers (not omens of evil)
- Integration over banishment - face what is veiled, don't cast it out
- Huguenot precision - test everything, accept nothing blindly
"""
        
        # Build the structured prompt
        structured_prompt = f"""Create a spell/ritual for this intention: "{request.intention}"

You MUST respond with a JSON object in this EXACT format (no markdown, just pure JSON):
{{
    "tarot_card": {{
        "title": "Short evocative title (3-5 words max)",
        "symbol": "A single emoji or symbol that represents this spell",
        "essence": "One sentence capturing the core purpose (under 15 words)",
        "key_action": "The single most important action to take (under 20 words)",
        "incantation": "A brief, memorable phrase of power (under 15 words)",
        "timing": "When to perform, very brief (e.g., 'Full Moon, Midnight')",
        "warning": "One line caution if needed (under 15 words)"
    }},
    "title": "A poetic, evocative title for this spell",
    "subtitle": "A brief tagline or description (10 words max)",
    "introduction": "A 2-3 sentence personal introduction in your voice, speaking directly to the seeker",
    "materials": [
        {{"name": "Material name", "icon": "candle|herb|crystal|feather|water|fire|moon|sun|book|pen|mirror|salt|oil|incense|bell|cord|photo|bowl", "note": "Brief note on why/how to use"}},
    ],
    "timing": {{
        "moon_phase": "New Moon|Waxing|Full Moon|Waning|Any",
        "time_of_day": "Dawn|Morning|Noon|Dusk|Night|Midnight|Any",
        "day": "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Any",
        "note": "Brief explanation of timing significance"
    }},
    "steps": [
        {{"number": 1, "title": "Step title", "instruction": "Detailed instruction", "duration": "5 minutes", "note": "Optional tip or variation"}}
    ],
    "spoken_words": {{
        "invocation": "Words to speak at the beginning (can be poetry, affirmation, or prayer)",
        "main_incantation": "The central words of power for this spell",
        "closing": "Words to seal and close the ritual"
    }},
    "historical_context": {{
        "tradition": "Name the magical tradition this draws from",
        "time_period": "1910-1945 or relevant era",
        "practitioners": ["Historical figures who used similar practices"],
        "sources": [
            {{"author": "Author name", "work": "Book/work title", "year": 1930, "relevance": "How this source relates to the spell"}}
        ],
        "cultural_notes": "Any important cultural or historical context"
    }},
    "variations": [
        {{"name": "Variation name", "description": "How to adapt for different needs"}}
    ],
    "warnings": ["Any cautions or ethical considerations"],
    "closing_message": "A personal message of encouragement in your voice",
    "image_prompt": "A detailed prompt to generate a header image for this spell (describe visual elements, mood, symbols)"
}}

IMPORTANT GUIDELINES:
- Include 4-8 materials with appropriate icons
- Include 5-8 detailed steps
- Cite at least 2-3 historical sources with real books/authors from the 1910-1945 period
- The spoken_words should feel authentic to your tradition
- Make the historical_context genuinely educational
{katherine_context}{db_context}

Respond ONLY with the JSON object, no other text."""

        # Get system message based on archetype
        if archetype_id and archetype_id in ARCHETYPE_PERSONAS:
            system_message = ARCHETYPE_PERSONAS[archetype_id]['system_prompt'] + "\\n\\nYou must respond with structured JSON as specified."
        else:
            system_message = DEFAULT_SYSTEM_MESSAGE + "\\n\\nYou must respond with structured JSON as specified."
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model('openai', 'gpt-5.1')
        
        user_message = UserMessage(text=structured_prompt)
        response = await chat.send_message(user_message)
        
        # Parse the JSON response
        import json
        try:
            # Clean up response if needed (remove markdown code blocks)
            clean_response = response.strip()
            if clean_response.startswith('```'):
                clean_response = clean_response.split('```')[1]
                if clean_response.startswith('json'):
                    clean_response = clean_response[4:]
            clean_response = clean_response.strip()
            
            spell_data = json.loads(clean_response)
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw response
            spell_data = {
                'title': 'Your Custom Spell',
                'raw_response': response,
                'parse_error': True
            }
        
        # Generate image if requested
        image_base64 = None
        if request.generate_image and 'image_prompt' in spell_data:
            try:
                style = ARCHETYPE_IMAGE_STYLES.get(archetype_id or 'neutral', ARCHETYPE_IMAGE_STYLES['neutral'])
                image_prompt = f"{style}, {spell_data['image_prompt']}, mystical ritual scene, no text"
                
                image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
                images = await image_gen.generate_images(
                    prompt=image_prompt,
                    model='gpt-image-1',
                    number_of_images=1
                )
                
                if images and len(images) > 0:
                    image_base64 = base64.b64encode(images[0]).decode('utf-8')
            except Exception as img_error:
                logging.error(f'Spell image generation error: {str(img_error)}')
        
        # Increment spell count for authenticated free users
        if user and user.get('subscription_tier') == 'free':
            await increment_spell_count(user['id'])
        
        # Get updated limit info for response
        limit_info = None
        if user:
            updated_user = await db.users.find_one({'id': user['id']}, {'_id': 0})
            limit_check = await check_spell_generation_limit(updated_user)
            limit_info = {
                'remaining': limit_check['remaining'],
                'limit': limit_check['limit'],
                'subscription_tier': user.get('subscription_tier', 'free')
            }
        
        return {
            'spell': spell_data,
            'image_base64': image_base64,
            'archetype': {
                'id': archetype_id,
                'name': archetype_name,
                'title': archetype_title
            },
            'session_id': session_id,
            'limit_info': limit_info
        }
        
    except Exception as e:
        logging.error(f'Spell generation error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to generate spell: {str(e)}')

# AI Image Generation endpoint
@api_router.post('/ai/generate-image')
async def generate_image(request: ImageGenerationRequest):
    try:
        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        images = await image_gen.generate_images(
            prompt=f"1920s-1940s mystical art style, {request.prompt}, art deco influences, rich jewel tones, Bloomsbury aesthetic",
            model='gpt-image-1',
            number_of_images=1
        )
        
        if images and len(images) > 0:
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            return {'image_base64': image_base64}
        else:
            raise HTTPException(status_code=500, detail='No image was generated')
    except Exception as e:
        logging.error(f'Image generation error: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to generate image')

# Favorites endpoints
@api_router.post('/favorites')
async def add_favorite(request: FavoriteRequest, user = Depends(get_current_user)):
    favorite = {'type': request.item_type, 'id': request.item_id}
    await db.users.update_one(
        {'id': user['id']},
        {'$addToSet': {'favorites': favorite}}
    )
    return {'success': True}

@api_router.get('/favorites')
async def get_favorites(user = Depends(get_current_user)):
    user_data = await db.users.find_one({'id': user['id']}, {'_id': 0})
    return user_data.get('favorites', [])

@api_router.delete('/favorites')
async def remove_favorite(request: FavoriteRequest, user = Depends(get_current_user)):
    favorite = {'type': request.item_type, 'id': request.item_id}
    await db.users.update_one(
        {'id': user['id']},
        {'$pull': {'favorites': favorite}}
    )
    return {'success': True}

# Grimoire (Saved Spells) endpoints
@api_router.post('/grimoire/save', response_model=SavedSpellResponse)
async def save_spell_to_grimoire(request: SaveSpellRequest, user = Depends(get_current_user)):
    """Save a generated spell to the user's personal grimoire"""
    
    # Check subscription - only paid users can save
    subscription_tier = user.get('subscription_tier', 'free')
    if subscription_tier == 'free':
        raise HTTPException(
            status_code=403,
            detail={
                'error': 'feature_locked',
                'message': 'Upgrade to Pro to save spells to your grimoire! Only $19/year for unlimited saves.',
                'feature': 'save_spell'
            }
        )
    
    spell_id = str(uuid.uuid4())
    
    # Extract title from spell data for easy display
    title = request.spell_data.get('title', 'Untitled Spell')
    
    saved_spell = {
        'id': spell_id,
        'user_id': user['id'],
        'spell_data': request.spell_data,
        'archetype_id': request.archetype_id,
        'archetype_name': request.archetype_name,
        'archetype_title': request.archetype_title,
        'image_base64': request.image_base64,
        'title': title,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_spells.insert_one(saved_spell)
    
    # Increment saved spell counter
    await db.users.update_one(
        {'id': user['id']},
        {'$inc': {'total_spells_saved': 1}}
    )
    
    return SavedSpellResponse(**saved_spell)

@api_router.get('/grimoire/spells', response_model=List[SavedSpellResponse])
async def get_user_grimoire(user = Depends(get_current_user)):
    """Retrieve all spells saved by the current user"""
    spells = await db.user_spells.find(
        {'user_id': user['id']}, 
        {'_id': 0}
    ).sort('created_at', -1).to_list(100)
    
    return spells

@api_router.delete('/grimoire/spells/{spell_id}')
async def delete_saved_spell(spell_id: str, user = Depends(get_current_user)):
    """Delete a saved spell from the user's grimoire"""
    result = await db.user_spells.delete_one({
        'id': spell_id,
        'user_id': user['id']
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Spell not found or unauthorized')
    
    return {'success': True, 'message': 'Spell deleted from grimoire'}

# Subscription endpoints
@api_router.get('/subscription/status')
async def get_subscription_status(user = Depends(get_current_user)):
    """Get current user's subscription status and limits"""
    limit_check = await check_spell_generation_limit(user)
    
    return {
        'subscription_tier': user.get('subscription_tier', 'free'),
        'subscription_status': user.get('subscription_status', 'active'),
        'spell_limit': limit_check['limit'],
        'spells_remaining': limit_check['remaining'],
        'spells_used': user.get('spell_generation_count', 0),
        'total_spells_generated': user.get('total_spells_generated', 0),
        'total_spells_saved': user.get('total_spells_saved', 0),
        'can_save_spells': user.get('subscription_tier') == 'paid',
        'can_download_pdf': user.get('subscription_tier') == 'paid'
    }

@api_router.post('/subscription/upgrade-manual')
async def manual_upgrade_user(user_email: str, admin_key: str):
    """Admin endpoint to manually upgrade a user (for testing before Stripe)"""
    # Simple admin key check (change this in production!)
    if admin_key != os.environ.get('ADMIN_KEY', 'change-me-in-production'):
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    user = await db.users.find_one({'email': user_email}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    current_time = datetime.now(timezone.utc)
    await db.users.update_one(
        {'email': user_email},
        {
            '$set': {
                'subscription_tier': 'paid',
                'subscription_status': 'active',
                'subscription_start': current_time.isoformat(),
                'subscription_end': (current_time + timedelta(days=365)).isoformat(),
                'upgraded_at': current_time.isoformat()
            }
        }
    )
    
    return {'success': True, 'message': f'User {user_email} upgraded to paid tier'}

# Stripe Payment Integration
class CreateCheckoutRequest(BaseModel):
    origin_url: str

@api_router.post('/stripe/create-checkout')
async def create_stripe_checkout(request: CreateCheckoutRequest, user = Depends(get_current_user)):
    """Create a Stripe checkout session for yearly subscription"""
    try:
        # Initialize Stripe with webhook URL
        webhook_url = f"{request.origin_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Fixed yearly subscription: $19.00/year
        amount = 19.00
        currency = "usd"
        
        # Success and cancel URLs
        success_url = f"{request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{request.origin_url}/upgrade"
        
        # Metadata to identify the user
        metadata = {
            'user_id': user['id'],
            'user_email': user['email'],
            'subscription_type': 'yearly',
            'plan': 'pro'
        }
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=amount,
            currency=currency,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction = {
            'id': str(uuid.uuid4()),
            'session_id': session.session_id,
            'user_id': user['id'],
            'user_email': user['email'],
            'amount': amount,
            'currency': currency,
            'metadata': metadata,
            'payment_status': 'pending',
            'status': 'initiated',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.insert_one(transaction)
        
        return {
            'checkout_url': session.url,
            'session_id': session.session_id
        }
        
    except Exception as e:
        logging.error(f'Stripe checkout error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to create checkout session: {str(e)}')

@api_router.get('/stripe/checkout-status/{session_id}')
async def get_checkout_status(session_id: str, user = Depends(get_current_user)):
    """Check the status of a Stripe checkout session"""
    try:
        # Initialize Stripe (webhook URL not needed for status check)
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        
        # Get status from Stripe
        status_response: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Find transaction in database
        transaction = await db.payment_transactions.find_one({'session_id': session_id}, {'_id': 0})
        
        if not transaction:
            raise HTTPException(status_code=404, detail='Transaction not found')
        
        # Check if we've already processed this payment
        if transaction.get('payment_status') == 'paid' and transaction.get('processed'):
            return {
                'status': status_response.status,
                'payment_status': status_response.payment_status,
                'already_processed': True
            }
        
        # Update transaction status
        await db.payment_transactions.update_one(
            {'session_id': session_id},
            {
                '$set': {
                    'status': status_response.status,
                    'payment_status': status_response.payment_status,
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # If payment succeeded, upgrade the user
        if status_response.payment_status == 'paid' and not transaction.get('processed'):
            current_time = datetime.now(timezone.utc)
            
            # Upgrade user to paid tier
            await db.users.update_one(
                {'id': transaction['user_id']},
                {
                    '$set': {
                        'subscription_tier': 'paid',
                        'subscription_status': 'active',
                        'subscription_start': current_time.isoformat(),
                        'subscription_end': (current_time + timedelta(days=365)).isoformat(),
                        'upgraded_at': current_time.isoformat(),
                        'stripe_customer_id': status_response.metadata.get('stripe_customer_id'),
                        'stripe_subscription_id': session_id
                    }
                }
            )
            
            # Mark transaction as processed
            await db.payment_transactions.update_one(
                {'session_id': session_id},
                {'$set': {'processed': True, 'processed_at': current_time.isoformat()}}
            )
        
        return {
            'status': status_response.status,
            'payment_status': status_response.payment_status,
            'amount_total': status_response.amount_total,
            'currency': status_response.currency
        }
        
    except Exception as e:
        logging.error(f'Checkout status error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to check status: {str(e)}')

@api_router.post('/webhook/stripe')
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        # Get raw body and signature
        body = await request.body()
        signature = request.headers.get('Stripe-Signature', '')
        
        # Initialize Stripe
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Process based on event type
        if webhook_response.event_type == 'checkout.session.completed':
            session_id = webhook_response.session_id
            
            # Find transaction
            transaction = await db.payment_transactions.find_one({'session_id': session_id}, {'_id': 0})
            
            if transaction and not transaction.get('processed'):
                current_time = datetime.now(timezone.utc)
                
                # Upgrade user
                await db.users.update_one(
                    {'id': transaction['user_id']},
                    {
                        '$set': {
                            'subscription_tier': 'paid',
                            'subscription_status': 'active',
                            'subscription_start': current_time.isoformat(),
                            'subscription_end': (current_time + timedelta(days=365)).isoformat(),
                            'upgraded_at': current_time.isoformat()
                        }
                    }
                )
                
                # Mark as processed
                await db.payment_transactions.update_one(
                    {'session_id': session_id},
                    {
                        '$set': {
                            'payment_status': 'paid',
                            'processed': True,
                            'processed_at': current_time.isoformat()
                        }
                    }
                )
        
        return {'status': 'success', 'event_type': webhook_response.event_type}
        
    except Exception as e:
        logging.error(f'Webhook error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
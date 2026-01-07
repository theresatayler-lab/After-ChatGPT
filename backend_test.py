import requests
import sys
import json
from datetime import datetime

class SpiritualAppAPITester:
    def __init__(self, base_url="https://crowlands-magic.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, json=data, headers=test_headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                try:
                    return False, response.json()
                except:
                    return False, response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_auth_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_auth_login(self):
        """Test user login with existing credentials"""
        # Try to login with the registered user
        if not hasattr(self, 'test_email'):
            return False
            
        login_data = {
            "email": self.test_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_get_deities(self):
        """Test getting all deities"""
        success, response = self.run_test(
            "Get All Deities",
            "GET",
            "deities",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} deities")
            if len(response) > 0:
                # Test getting a specific deity
                deity_id = response[0].get('id')
                if deity_id:
                    self.test_get_deity(deity_id)
            return True
        return False

    def test_get_deity(self, deity_id):
        """Test getting a specific deity"""
        success, response = self.run_test(
            f"Get Deity {deity_id}",
            "GET",
            f"deities/{deity_id}",
            200
        )
        return success

    def test_get_historical_figures(self):
        """Test getting all historical figures"""
        success, response = self.run_test(
            "Get All Historical Figures",
            "GET",
            "historical-figures",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} historical figures")
            if len(response) > 0:
                # Test getting a specific figure
                figure_id = response[0].get('id')
                if figure_id:
                    self.test_get_figure(figure_id)
            return True
        return False

    def test_get_figure(self, figure_id):
        """Test getting a specific historical figure"""
        success, response = self.run_test(
            f"Get Historical Figure {figure_id}",
            "GET",
            f"historical-figures/{figure_id}",
            200
        )
        return success

    def test_get_sacred_sites(self):
        """Test getting all sacred sites"""
        success, response = self.run_test(
            "Get All Sacred Sites",
            "GET",
            "sacred-sites",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} sacred sites")
            if len(response) > 0:
                # Test getting a specific site
                site_id = response[0].get('id')
                if site_id:
                    self.test_get_site(site_id)
            return True
        return False

    def test_get_site(self, site_id):
        """Test getting a specific sacred site"""
        success, response = self.run_test(
            f"Get Sacred Site {site_id}",
            "GET",
            f"sacred-sites/{site_id}",
            200
        )
        return success

    def test_get_rituals(self):
        """Test getting all rituals and filtering by category"""
        success, response = self.run_test(
            "Get All Rituals",
            "GET",
            "rituals",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} rituals")
            
            # Test filtering by category
            categories = ['Invocation', 'Protection', 'Offering']
            for category in categories:
                self.run_test(
                    f"Get Rituals - {category}",
                    "GET",
                    f"rituals?category={category}",
                    200
                )
            
            if len(response) > 0:
                # Test getting a specific ritual
                ritual_id = response[0].get('id')
                if ritual_id:
                    self.test_get_ritual(ritual_id)
            return True
        return False

    def test_get_ritual(self, ritual_id):
        """Test getting a specific ritual"""
        success, response = self.run_test(
            f"Get Ritual {ritual_id}",
            "GET",
            f"rituals/{ritual_id}",
            200
        )
        return success

    def test_get_timeline(self):
        """Test getting timeline events"""
        success, response = self.run_test(
            "Get Timeline Events",
            "GET",
            "timeline",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} timeline events")
            return True
        return False

    def test_get_archetypes(self):
        """Test getting all archetypes"""
        success, response = self.run_test(
            "Get All Archetypes",
            "GET",
            "archetypes",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} archetypes")
            expected_archetypes = ['shiggy', 'kathleen', 'catherine', 'theresa']
            found_ids = [archetype.get('id') for archetype in response]
            
            for expected in expected_archetypes:
                if expected in found_ids:
                    print(f"   ✅ Found archetype: {expected}")
                else:
                    print(f"   ❌ Missing archetype: {expected}")
                    return False
            
            return len(response) == 4
        return False

    def test_ai_chat_neutral(self):
        """Test AI chat without archetype (neutral persona)"""
        chat_data = {
            "message": "Create a simple protection spell for my home"
        }
        
        success, response = self.run_test(
            "AI Chat - Neutral Persona",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            print(f"   AI Response length: {len(response['response'])} characters")
            # Check that no archetype was used
            if response.get('archetype') is None:
                print("   ✅ Neutral persona used (no archetype)")
                return True
            else:
                print(f"   ❌ Expected neutral, got archetype: {response.get('archetype')}")
                return False
        return False

    def test_ai_chat_shiggy(self):
        """Test AI chat with Shiggy archetype"""
        chat_data = {
            "message": "I need courage for a difficult conversation with my family",
            "archetype": "shiggy"
        }
        
        success, response = self.run_test(
            "AI Chat - Shiggy Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Shiggy-specific elements
            shiggy_indicators = ['poetry', 'courage', 'bird', 'omen', 'rubáiyát', 'practical', 'daily practice']
            found_indicators = [indicator for indicator in shiggy_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Shiggy persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Shiggy persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat_kathleen(self):
        """Test AI chat with Kathleen archetype"""
        chat_data = {
            "message": "Help me protect family secrets while healing old wounds",
            "archetype": "kathleen"
        }
        
        success, response = self.run_test(
            "AI Chat - Kathleen Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Kathleen-specific elements
            kathleen_indicators = ['secret', 'protection', 'resilience', 'family', 'document', 'photograph', 'veil', 'guard']
            found_indicators = [indicator for indicator in kathleen_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Kathleen persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Kathleen persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat_catherine(self):
        """Test AI chat with Catherine archetype"""
        chat_data = {
            "message": "I want to create something beautiful that brings joy to my family",
            "archetype": "catherine"
        }
        
        success, response = self.run_test(
            "AI Chat - Catherine Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Catherine-specific elements
            catherine_indicators = ['music', 'song', 'craft', 'bird', 'creation', 'joy', 'artisan', 'making']
            found_indicators = [indicator for indicator in catherine_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Catherine persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Catherine persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat_theresa(self):
        """Test AI chat with Theresa archetype"""
        chat_data = {
            "message": "Help me uncover hidden family patterns and break generational cycles",
            "archetype": "theresa"
        }
        
        success, response = self.run_test(
            "AI Chat - Theresa Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Theresa-specific elements
            theresa_indicators = ['truth', 'research', 'story', 'pattern', 'generational', 'naming', 'bird', 'ancestor']
            found_indicators = [indicator for indicator in theresa_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Theresa persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Theresa persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat(self):
        """Test AI chat functionality"""
        chat_data = {
            "message": "Tell me about Hecate in the context of 1910-1945 occult revival"
        }
        
        success, response = self.run_test(
            "AI Chat",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            print(f"   AI Response length: {len(response['response'])} characters")
            return True
        return False

    def test_ai_image_generation(self):
        """Test AI image generation"""
        image_data = {
            "prompt": "Hecate at a moonlit crossroads"
        }
        
        success, response = self.run_test(
            "AI Image Generation",
            "POST",
            "ai/generate-image",
            200,
            data=image_data
        )
        
        if success and isinstance(response, dict) and 'image_base64' in response:
            print(f"   Image generated successfully (base64 length: {len(response['image_base64'])})")
            return True
        return False

    def test_cathleen_spell_generation(self):
        """Test Cathleen spell generation with transformation intention - REVIEW REQUEST TEST"""
        spell_data = {
            "intention": "I need courage to face a difficult transformation",
            "archetype": "kathleen",
            "generate_image": False
        }
        
        success, response = self.run_test(
            "Cathleen Spell Generation - Transformation",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=60
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'session_id']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'Cathleen Winifred Malzard':
                print(f"   ❌ Expected archetype name 'Cathleen Winifred Malzard', got '{archetype.get('name')}'")
                return False
            
            print(f"   ✅ Archetype name correct: {archetype.get('name')}")
            
            # Verify spell structure
            spell = response.get('spell', {})
            spell_required_fields = ['title', 'materials', 'steps', 'spoken_words', 'historical_context']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Check for Cathleen-specific elements in materials
            materials = spell.get('materials', [])
            material_names = [m.get('name', '').lower() for m in materials]
            material_text = ' '.join(material_names)
            
            cathleen_materials_found = []
            cathleen_indicators = ['silver', 'charm', 'crow', 'raven', 'feather', 'silk', 'voice', 'needle', 'thread']
            for indicator in cathleen_indicators:
                if indicator in material_text:
                    cathleen_materials_found.append(indicator)
            
            if cathleen_materials_found:
                print(f"   ✅ Cathleen materials found: {', '.join(cathleen_materials_found)}")
            else:
                print(f"   ⚠️  No Cathleen-specific materials detected in: {material_text}")
            
            # Check for voice/song elements in spoken_words
            spoken_words = spell.get('spoken_words', {})
            spoken_text = ' '.join([
                spoken_words.get('invocation', ''),
                spoken_words.get('main_incantation', ''),
                spoken_words.get('closing', '')
            ]).lower()
            
            voice_elements = ['voice', 'song', 'sing', 'hum', 'breath', 'speak', 'chant']
            voice_found = [elem for elem in voice_elements if elem in spoken_text]
            
            if voice_found:
                print(f"   ✅ Voice magic elements found: {', '.join(voice_found)}")
            else:
                print(f"   ⚠️  No voice magic elements detected in spoken words")
            
            # Check for Morrigan references
            full_spell_text = json.dumps(spell).lower()
            morrigan_refs = ['morrigan', 'great queen', 'phantom queen', 'crow', 'raven', 'transformation', 'shadow']
            morrigan_found = [ref for ref in morrigan_refs if ref in full_spell_text]
            
            if morrigan_found:
                print(f"   ✅ Morrigan/transformation elements found: {', '.join(morrigan_found)}")
            else:
                print(f"   ⚠️  No Morrigan references detected")
            
            # Check for ward/talisman suggestions
            ward_indicators = ['ward', 'talisman', 'charm', 'carry', 'wear', 'brooch', 'amulet', 'protection']
            ward_found = [ward for ward in ward_indicators if ward in full_spell_text]
            
            if ward_found:
                print(f"   ✅ Ward/talisman elements found: {', '.join(ward_found)}")
            else:
                print(f"   ⚠️  No ward/talisman suggestions detected")
            
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Materials count: {len(materials)}")
            print(f"   ✅ Steps count: {len(spell.get('steps', []))}")
            
            return True
        
        return False

    def test_shigg_sample_spells(self):
        """Test retrieving Shigg sample spells - REVIEW REQUEST TEST"""
        success, response = self.run_test(
            "Get Shigg Sample Spells",
            "GET",
            "sample-spells/shiggy",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Found {len(response)} Shigg sample spells")
            
            # Check if we have exactly 4 spells as specified in review request
            if len(response) != 4:
                print(f"   ❌ Expected 4 sample spells, got {len(response)}")
                return False
            
            # Check for expected spell names from review request
            expected_spells = [
                "Dawn Cup Blessing",
                "Boundaries Veil", 
                "Rosemary for Remembrance",
                "Moving Finger Practice"
            ]
            
            found_spells = []
            for spell in response:
                title = spell.get('title', '')
                found_spells.append(title)
                print(f"   - {title}")
            
            missing_spells = [spell for spell in expected_spells if spell not in found_spells]
            if missing_spells:
                print(f"   ❌ Missing expected spells: {', '.join(missing_spells)}")
                return False
            else:
                print(f"   ✅ All expected Shigg spells found")
            
            return True
        
        return False

    def test_bird_oracle_reading(self):
        """Test Bird Oracle Reading endpoint - REVIEW REQUEST TEST"""
        oracle_data = {
            "situation": "I need guidance about a relationship",
            "question": "What should I do?"
        }
        
        success, response = self.run_test(
            "Bird Oracle Reading",
            "POST",
            "ai/bird-oracle-reading",
            200,
            data=oracle_data,
            timeout=60
        )
        
        if success and isinstance(response, dict):
            # Verify response structure from review request
            result = response.get('result', {})
            required_fields = ['greeting', 'birds', 'poetic_reflection', 'closing']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                print(f"   ❌ Missing required fields: {missing_fields}")
                return False
            
            # Verify birds array structure
            birds = result.get('birds', [])
            if not isinstance(birds, list) or len(birds) == 0:
                print(f"   ❌ Birds array is empty or invalid")
                return False
            
            # Check first bird structure
            bird = birds[0]
            bird_required_fields = ['name', 'symbol', 'message', 'ritual', 'prompt']
            missing_bird_fields = [field for field in bird_required_fields if field not in bird]
            
            if missing_bird_fields:
                print(f"   ❌ Missing bird fields: {missing_bird_fields}")
                return False
            
            print(f"   ✅ Bird Oracle reading structure valid")
            print(f"   ✅ Found {len(birds)} bird(s) in reading")
            print(f"   ✅ First bird: {bird.get('name')} {bird.get('symbol')}")
            
            return True
        
        return False

    def test_corrie_tarot_pro_user(self):
        """Test Corrie Tarot with Pro user - REVIEW REQUEST TEST"""
        # First login as Pro user
        pro_login_data = {
            "email": "sub_test@test.com",
            "password": "test123"
        }
        
        success, login_response = self.run_test(
            "Login Pro User for Corrie Tarot",
            "POST",
            "auth/login",
            200,
            data=pro_login_data
        )
        
        if not success or not isinstance(login_response, dict) or 'token' not in login_response:
            print(f"   ❌ Failed to login Pro user")
            return False
        
        # Store the Pro token temporarily
        original_token = self.token
        self.token = login_response['token']
        
        # Test Corrie Tarot with Pro user
        tarot_data = {
            "situation": "Career change at 45",
            "question": "Should I take the risk?"
        }
        
        success, response = self.run_test(
            "Corrie Tarot - Pro User",
            "POST",
            "ai/corrie-tarot",
            200,
            data=tarot_data,
            timeout=60
        )
        
        # Restore original token
        self.token = original_token
        
        if success and isinstance(response, dict):
            # Verify response structure from review request
            result = response.get('result', {})
            required_fields = ['greeting', 'reading', 'overall_guidance', 'closing']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                print(f"   ❌ Missing required fields: {missing_fields}")
                return False
            
            # Verify reading structure (past/present/future)
            reading = result.get('reading', {})
            reading_required_fields = ['past', 'present', 'future']
            missing_reading_fields = [field for field in reading_required_fields if field not in reading]
            
            if missing_reading_fields:
                print(f"   ❌ Missing reading fields: {missing_reading_fields}")
                return False
            
            # Check character structure
            past_char = reading.get('past', {})
            char_required_fields = ['character', 'era', 'archetype', 'symbol', 'message', 'wisdom']
            missing_char_fields = [field for field in char_required_fields if field not in past_char]
            
            if missing_char_fields:
                print(f"   ❌ Missing character fields: {missing_char_fields}")
                return False
            
            print(f"   ✅ Corrie Tarot reading structure valid")
            print(f"   ✅ Past character: {past_char.get('character')}")
            print(f"   ✅ Present character: {reading.get('present', {}).get('character')}")
            print(f"   ✅ Future character: {reading.get('future', {}).get('character')}")
            
            return True
        
        return False

    def test_corrie_tarot_pro_gate(self):
        """Test Corrie Tarot Pro gate (should return 403 without Pro) - REVIEW REQUEST TEST"""
        # Use regular user token (not Pro)
        tarot_data = {
            "situation": "Career change at 45",
            "question": "Should I take the risk?"
        }
        
        success, response = self.run_test(
            "Corrie Tarot - Pro Gate Test",
            "POST",
            "ai/corrie-tarot",
            403,  # Expecting 403 Forbidden
            data=tarot_data
        )
        
        if success and isinstance(response, dict):
            # Verify it's the correct error type
            error_type = response.get('detail', {}).get('error')
            if error_type == 'feature_locked':
                print(f"   ✅ Pro gate working correctly - feature_locked error returned")
                return True
            else:
                print(f"   ❌ Expected 'feature_locked' error, got: {error_type}")
                return False
        
        return success  # If we got 403, that's what we expected

    def test_spell_generation_with_shigg(self):
        """Test spell generation with Shigg archetype - REVIEW REQUEST TEST"""
        spell_data = {
            "intention": "I need courage for a new beginning",
            "archetype": "shiggy",
            "generate_image": False
        }
        
        success, response = self.run_test(
            "Generate Spell - Shigg with Bird Oracle",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=60
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'session_id']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'Shigg':
                print(f"   ❌ Expected archetype name 'Shigg', got '{archetype.get('name')}'")
                return False
            
            print(f"   ✅ Archetype name correct: {archetype.get('name')}")
            
            # Verify spell structure
            spell = response.get('spell', {})
            spell_required_fields = ['title', 'materials', 'steps', 'spoken_words', 'historical_context']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Check for bird oracle element (Shigg's unique feature from review request)
            full_spell_text = json.dumps(spell).lower()
            bird_oracle_indicators = ['bird', 'oracle', 'parliament', 'feather', 'wing', 'flight', 'nest', 'song']
            bird_found = [indicator for indicator in bird_oracle_indicators if indicator in full_spell_text]
            
            if bird_found:
                print(f"   ✅ Bird oracle elements found: {', '.join(bird_found)}")
            else:
                print(f"   ⚠️  No bird oracle elements detected - this should be Shigg's unique feature")
            
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Materials count: {len(spell.get('materials', []))}")
            print(f"   ✅ Steps count: {len(spell.get('steps', []))}")
            
            return True
        
        return False
        """Test retrieving Cathleen sample spells - REVIEW REQUEST TEST"""
        success, response = self.run_test(
            "Get Cathleen Sample Spells",
            "GET",
            "sample-spells/kathleen",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Found {len(response)} Cathleen sample spells")
            
            # Check if we have exactly 4 spells
            if len(response) != 4:
                print(f"   ⚠️  Expected 4 sample spells, got {len(response)}")
            
            # Check for expected categories
            expected_categories = [
                "Wards & Talismans",
                "Voice Magic", 
                "Shadow Work (The Morrigan's Way)",
                "Spirit Communication"
            ]
            
            found_categories = []
            for spell in response:
                category = spell.get('category', '')
                if category in expected_categories:
                    found_categories.append(category)
                print(f"   - {spell.get('title', 'Untitled')} ({category})")
            
            missing_categories = [cat for cat in expected_categories if cat not in found_categories]
            if missing_categories:
                print(f"   ⚠️  Missing expected categories: {', '.join(missing_categories)}")
            else:
                print(f"   ✅ All expected categories found")
            
            return len(response) > 0
        
        return False

    def test_archetype_endpoint(self):
        """Test archetype endpoint includes Shigg - REVIEW REQUEST TEST"""
        success, response = self.run_test(
            "Get Archetypes - Shigg Check",
            "GET",
            "archetypes",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Found {len(response)} archetypes")
            
            # Look for Shigg specifically
            shigg_found = False
            for archetype in response:
                if archetype.get('id') == 'shiggy':
                    shigg_found = True
                    name = archetype.get('name')
                    title = archetype.get('title')
                    
                    print(f"   ✅ Shigg archetype found:")
                    print(f"     - ID: {archetype.get('id')}")
                    print(f"     - Name: {name}")
                    print(f"     - Title: {title}")
                    
                    # Verify expected values from review request
                    if name != 'Shigg':
                        print(f"   ❌ Expected name 'Shigg', got '{name}'")
                        return False
                    
                    if title != 'The Birds of Parliament Poet Laureate':
                        print(f"   ❌ Expected title 'The Birds of Parliament Poet Laureate', got '{title}'")
                        return False
                    
                    break
            
            if not shigg_found:
                print(f"   ❌ Shigg archetype not found in response")
                print(f"   Available archetypes: {[a.get('id') for a in response]}")
                return False
            
            return True
        
        return False

    def test_spell_generation_catherine_creativity(self):
        """Test spell generation with Catherine archetype for creativity"""
        spell_data = {
            "intention": "Help me find creative inspiration",
            "archetype": "catherine",
            "generate_image": False
        }
        
        success, response = self.run_test(
            "Generate Spell - Catherine Creativity",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=60
        )
        
        if success and isinstance(response, dict):
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'Catherine Cosgrove (née Foy)':
                print(f"   ❌ Expected archetype name 'Catherine Cosgrove (née Foy)', got '{archetype.get('name')}'")
                return False
            
            # Verify spell structure (same validation as above)
            spell = response.get('spell', {})
            if not spell.get('title'):
                print(f"   ❌ Spell missing title")
                return False
            
            print(f"   ✅ Catherine archetype spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            
            return True
        
        return False

    def test_spell_generation_neutral(self):
        """Test spell generation without archetype (neutral guidance)"""
        spell_data = {
            "intention": "Help me find inner peace",
            "archetype": None,
            "generate_image": False
        }
        
        success, response = self.run_test(
            "Generate Spell - Neutral Guide",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=60
        )
        
        if success and isinstance(response, dict):
            # Verify archetype info for neutral
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'The Crowlands Guide':
                print(f"   ❌ Expected archetype name 'The Crowlands Guide', got '{archetype.get('name')}'")
                return False
            
            # Verify spell structure
            spell = response.get('spell', {})
            if not spell.get('title'):
                print(f"   ❌ Spell missing title")
                return False
            
            print(f"   ✅ Neutral guide spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            
            return True
        
        return False

    def test_spell_generation_with_image(self):
        """Test spell generation with image generation enabled"""
        spell_data = {
            "intention": "I need courage for a new beginning",
            "archetype": "shiggy",
            "generate_image": True
        }
        
        success, response = self.run_test(
            "Generate Spell - With Image",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=90
        )
        
        if success and isinstance(response, dict):
            # Check if image was generated
            image_base64 = response.get('image_base64')
            if image_base64:
                print(f"   ✅ Image generated (base64 length: {len(image_base64)})")
            else:
                print(f"   ⚠️  Image generation was requested but no image returned")
            
            # Verify spell structure
            spell = response.get('spell', {})
            if not spell.get('title'):
                print(f"   ❌ Spell missing title")
                return False
            
            print(f"   ✅ Spell with image request completed")
            print(f"   ✅ Spell title: {spell.get('title')}")
            
            return True
        
        return False

    def test_favorites(self):
        """Test favorites functionality (requires authentication)"""
        if not self.token:
            print("⚠️  Skipping favorites test - no authentication token")
            return False
            
        # Add a favorite
        favorite_data = {
            "item_type": "deity",
            "item_id": "test-deity-id"
        }
        
        success, response = self.run_test(
            "Add Favorite",
            "POST",
            "favorites",
            200,
            data=favorite_data
        )
        
        if success:
            # Get favorites
            self.run_test(
                "Get Favorites",
                "GET",
                "favorites",
                200
            )
            
            # Remove favorite
            self.run_test(
                "Remove Favorite",
                "DELETE",
                "favorites",
                200,
                data=favorite_data
            )
            
        return success

    def test_grimoire_save_spell(self):
        """Test saving a spell to grimoire (requires authentication)"""
        if not self.token:
            print("⚠️  Skipping grimoire save test - no authentication token")
            return False
        
        # Create a test spell data
        spell_data = {
            "spell_data": {
                "title": "Test Protection Spell",
                "subtitle": "A simple test spell",
                "introduction": "This is a test spell for grimoire functionality",
                "materials": [
                    {"name": "White Candle", "icon": "candle", "note": "For purification"},
                    {"name": "Salt", "icon": "salt", "note": "For protection"}
                ],
                "steps": [
                    {"number": 1, "title": "Prepare Space", "instruction": "Clear your space", "duration": "5 minutes"},
                    {"number": 2, "title": "Light Candle", "instruction": "Light the white candle", "duration": "1 minute"}
                ],
                "spoken_words": {
                    "invocation": "I call upon protective forces",
                    "main_incantation": "By salt and flame, protection claimed",
                    "closing": "So it is done"
                },
                "historical_context": {
                    "tradition": "Folk Magic",
                    "time_period": "1920s",
                    "practitioners": ["Traditional practitioners"],
                    "sources": [
                        {"author": "Test Author", "work": "Test Book", "year": 1925, "relevance": "Protection spells"}
                    ]
                }
            },
            "archetype_id": "shiggy",
            "archetype_name": "Sheila \"Shiggy\" Tayler",
            "archetype_title": "The Psychic Matriarch",
            "image_base64": None
        }
        
        success, response = self.run_test(
            "Save Spell to Grimoire",
            "POST",
            "grimoire/save",
            200,
            data=spell_data
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['id', 'user_id', 'spell_data', 'title', 'created_at']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing fields in save response: {missing_fields}")
                return False
            
            # Store spell_id for later tests
            self.saved_spell_id = response.get('id')
            print(f"   ✅ Spell saved with ID: {self.saved_spell_id}")
            print(f"   ✅ Spell title: {response.get('title')}")
            print(f"   ✅ Archetype: {response.get('archetype_name')}")
            
            return True
        
        return False

    def test_grimoire_get_spells(self):
        """Test retrieving all spells from grimoire (requires authentication)"""
        if not self.token:
            print("⚠️  Skipping grimoire get test - no authentication token")
            return False
        
        success, response = self.run_test(
            "Get Grimoire Spells",
            "GET",
            "grimoire/spells",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Found {len(response)} spells in grimoire")
            
            # Verify spell structure if any spells exist
            if len(response) > 0:
                spell = response[0]
                required_fields = ['id', 'user_id', 'spell_data', 'title', 'created_at']
                missing_fields = [field for field in required_fields if field not in spell]
                
                if missing_fields:
                    print(f"   ❌ Missing fields in spell: {missing_fields}")
                    return False
                
                print(f"   ✅ First spell title: {spell.get('title')}")
                if spell.get('archetype_name'):
                    print(f"   ✅ First spell archetype: {spell.get('archetype_name')}")
            
            return True
        
        return False

    def test_grimoire_delete_spell(self):
        """Test deleting a spell from grimoire (requires authentication)"""
        if not self.token:
            print("⚠️  Skipping grimoire delete test - no authentication token")
            return False
        
        if not hasattr(self, 'saved_spell_id') or not self.saved_spell_id:
            print("⚠️  No saved spell ID available for deletion test")
            return False
        
        success, response = self.run_test(
            f"Delete Spell from Grimoire",
            "DELETE",
            f"grimoire/spells/{self.saved_spell_id}",
            200
        )
        
        if success and isinstance(response, dict):
            if response.get('success'):
                print(f"   ✅ Spell deleted successfully")
                return True
            else:
                print(f"   ❌ Delete response did not indicate success")
                return False
        
        return False

    def test_grimoire_full_flow(self):
        """Test complete grimoire flow: save -> get -> delete"""
        if not self.token:
            print("⚠️  Skipping grimoire full flow test - no authentication token")
            return False
        
        print("\n📖 Testing Complete Grimoire Flow...")
        
        # Step 1: Save a spell
        if not self.test_grimoire_save_spell():
            print("   ❌ Failed to save spell")
            return False
        
        # Step 2: Retrieve spells
        if not self.test_grimoire_get_spells():
            print("   ❌ Failed to retrieve spells")
            return False
        
        # Step 3: Delete the spell
        if not self.test_grimoire_delete_spell():
            print("   ❌ Failed to delete spell")
            return False
        
        print("   ✅ Complete grimoire flow successful")
        return True

def main():
    print("🧙‍♀️ Starting Spiritual App API Testing...")
    print("=" * 60)
    
    # Setup
    tester = SpiritualAppAPITester()
    
    # Test authentication first
    print("\n📝 Testing Authentication...")
    if not tester.test_auth_register():
        print("❌ Registration failed, continuing with other tests...")
    
    # Test archetype system (priority tests from review request)
    print("\n🎭 Testing Archetype System...")
    tester.test_archetype_endpoint()
    
    # Test Cathleen-specific functionality (REVIEW REQUEST PRIORITY)
    print("\n🌟 Testing Cathleen Archetype Enrichment (REVIEW REQUEST)...")
    tester.test_cathleen_spell_generation()
    tester.test_cathleen_sample_spells()
    
    # Test all content endpoints (these should work without auth)
    print("\n🌙 Testing Content APIs...")
    tester.test_get_deities()
    tester.test_get_historical_figures()
    tester.test_get_sacred_sites()
    tester.test_get_rituals()
    tester.test_get_timeline()
    
    # Test Enhanced Spell Generation System (ADDITIONAL TESTS)
    print("\n✨ Testing Enhanced Spell Generation System...")
    tester.test_spell_generation_catherine_creativity()
    tester.test_spell_generation_neutral()
    tester.test_spell_generation_with_image()
    
    # Test AI features with archetype personas
    print("\n🤖 Testing AI Chat Features...")
    tester.test_ai_chat_neutral()
    tester.test_ai_chat_shiggy()
    tester.test_ai_chat_kathleen()
    tester.test_ai_chat_catherine()
    tester.test_ai_chat_theresa()
    tester.test_ai_image_generation()
    
    # Test favorites (requires auth)
    print("\n⭐ Testing Favorites...")
    tester.test_favorites()
    
    # Test Grimoire (My Grimoire feature - requires auth)
    print("\n📖 Testing Grimoire (My Grimoire Feature)...")
    tester.test_grimoire_full_flow()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate > 80 else 1

if __name__ == "__main__":
    sys.exit(main())
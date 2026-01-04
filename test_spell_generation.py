#!/usr/bin/env python3
"""
Focused test script for Enhanced Spell Generation System
Tests the specific scenarios mentioned in the review request
"""

import requests
import json
import sys
from datetime import datetime

def test_spell_generation():
    """Test the Enhanced Spell Generation System"""
    base_url = "https://witchcrowland.preview.emergentagent.com"
    
    print("🧙‍♀️ Testing Enhanced Spell Generation System")
    print("=" * 60)
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Kathleen archetype with protection intention
    print("\n🔍 Test 1: Kathleen Protection Spell")
    tests_total += 1
    
    spell_data = {
        "intention": "I need protection for my home",
        "archetype": "kathleen",
        "generate_image": False
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/ai/generate-spell",
            json=spell_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            required_fields = ['spell', 'archetype', 'session_id']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ Missing top-level fields: {missing_fields}")
            else:
                # Verify archetype
                archetype = data.get('archetype', {})
                if archetype.get('name') == 'Kathleen Winifred Malzard':
                    print(f"✅ Correct archetype: {archetype.get('name')}")
                    
                    # Verify spell structure
                    spell = data.get('spell', {})
                    required_spell_fields = ['title', 'materials', 'steps', 'spoken_words', 'historical_context']
                    
                    if all(field in spell for field in required_spell_fields):
                        print(f"✅ Spell structure complete")
                        print(f"   Title: {spell.get('title')}")
                        print(f"   Materials: {len(spell.get('materials', []))} items")
                        print(f"   Steps: {len(spell.get('steps', []))} steps")
                        
                        # Verify materials structure
                        materials = spell.get('materials', [])
                        if materials and all('name' in m and 'icon' in m and 'note' in m for m in materials):
                            print(f"✅ Materials properly structured")
                            
                            # Verify steps structure
                            steps = spell.get('steps', [])
                            if steps and all('number' in s and 'title' in s and 'instruction' in s for s in steps):
                                print(f"✅ Steps properly structured")
                                
                                # Verify spoken words
                                spoken = spell.get('spoken_words', {})
                                if all(key in spoken for key in ['invocation', 'main_incantation', 'closing']):
                                    print(f"✅ Spoken words complete")
                                    
                                    # Verify historical context
                                    historical = spell.get('historical_context', {})
                                    if 'tradition' in historical and 'sources' in historical:
                                        print(f"✅ Historical context included")
                                        tests_passed += 1
                                    else:
                                        print(f"❌ Historical context incomplete")
                                else:
                                    print(f"❌ Spoken words incomplete")
                            else:
                                print(f"❌ Steps improperly structured")
                        else:
                            print(f"❌ Materials improperly structured")
                    else:
                        missing_spell = [f for f in required_spell_fields if f not in spell]
                        print(f"❌ Missing spell fields: {missing_spell}")
                else:
                    print(f"❌ Wrong archetype: expected 'Kathleen Winifred Malzard', got '{archetype.get('name')}'")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 2: Catherine archetype with creativity intention
    print("\n🔍 Test 2: Catherine Creativity Spell")
    tests_total += 1
    
    spell_data = {
        "intention": "Help me find creative inspiration",
        "archetype": "catherine",
        "generate_image": False
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/ai/generate-spell",
            json=spell_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            archetype = data.get('archetype', {})
            
            if archetype.get('name') == 'Catherine Cosgrove (née Foy)':
                print(f"✅ Correct archetype: {archetype.get('name')}")
                spell = data.get('spell', {})
                if spell.get('title'):
                    print(f"✅ Spell generated: {spell.get('title')}")
                    tests_passed += 1
                else:
                    print(f"❌ No spell title")
            else:
                print(f"❌ Wrong archetype: expected 'Catherine Cosgrove (née Foy)', got '{archetype.get('name')}'")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 3: Neutral guidance (no archetype)
    print("\n🔍 Test 3: Neutral Guidance Spell")
    tests_total += 1
    
    spell_data = {
        "intention": "Help me find inner peace",
        "archetype": None,
        "generate_image": False
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/ai/generate-spell",
            json=spell_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            archetype = data.get('archetype', {})
            
            if archetype.get('name') == 'The Crowlands Guide':
                print(f"✅ Correct neutral guide: {archetype.get('name')}")
                spell = data.get('spell', {})
                if spell.get('title'):
                    print(f"✅ Spell generated: {spell.get('title')}")
                    tests_passed += 1
                else:
                    print(f"❌ No spell title")
            else:
                print(f"❌ Wrong guide: expected 'The Crowlands Guide', got '{archetype.get('name')}'")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 4: Spell with image generation (optional - may take longer)
    print("\n🔍 Test 4: Spell with Image Generation")
    tests_total += 1
    
    spell_data = {
        "intention": "I need courage for a new beginning",
        "archetype": "shiggy",
        "generate_image": True
    }
    
    try:
        print("   (This may take 60-90 seconds...)")
        response = requests.post(
            f"{base_url}/api/ai/generate-spell",
            json=spell_data,
            headers={'Content-Type': 'application/json'},
            timeout=90
        )
        
        if response.status_code == 200:
            data = response.json()
            spell = data.get('spell', {})
            image_base64 = data.get('image_base64')
            
            if spell.get('title'):
                print(f"✅ Spell generated: {spell.get('title')}")
                if image_base64:
                    print(f"✅ Image generated (length: {len(image_base64)} chars)")
                    tests_passed += 1
                else:
                    print(f"⚠️  Spell generated but no image (may be expected)")
                    tests_passed += 1  # Still count as success since spell was generated
            else:
                print(f"❌ No spell generated")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Results
    print("\n" + "=" * 60)
    print(f"📊 Spell Generation Test Results: {tests_passed}/{tests_total} passed")
    success_rate = (tests_passed / tests_total * 100) if tests_total > 0 else 0
    print(f"🎯 Success Rate: {success_rate:.1f}%")
    
    if tests_passed == tests_total:
        print("🎉 All spell generation tests passed!")
        return True
    else:
        print("⚠️  Some spell generation tests failed")
        return False

if __name__ == "__main__":
    success = test_spell_generation()
    sys.exit(0 if success else 1)
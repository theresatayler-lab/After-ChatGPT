import requests
import json

# Test safety routing specifically
base_url = "https://crowlands-magic.preview.emergentagent.com"

# Register a user
import time
timestamp = str(int(time.time() * 1000))
test_user_data = {
    "email": f"test_safety_debug_{timestamp}@example.com",
    "password": "TestPass123!",
    "name": f"Test Safety Debug User {timestamp}"
}

response = requests.post(f"{base_url}/api/auth/register", json=test_user_data)
print(f"Registration: {response.status_code}")
if response.status_code == 200:
    token = response.json()['token']
    
    # Test safety routing
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    reading_data = {
        "situation": "someone is threatening me",
        "spread_type": "one_card"
    }
    
    response = requests.post(f"{base_url}/api/ai/cobbles-oracle/reading", json=reading_data, headers=headers)
    print(f"Reading response: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("Full response:")
        print(json.dumps(result, indent=2))
        
        # Check for safety note
        safety_note = result.get('result', {}).get('safety_note')
        print(f"\nSafety note found: {safety_note is not None}")
        if safety_note:
            print(f"Safety note: {safety_note}")
    else:
        print(f"Error: {response.text}")
else:
    print(f"Registration failed: {response.text}")
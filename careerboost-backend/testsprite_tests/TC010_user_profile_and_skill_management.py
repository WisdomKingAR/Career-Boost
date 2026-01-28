import requests

BASE_URL = "http://localhost:5000"
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_user_profile_and_skill_management():
    # Step 1: Get user profile
    profile_url = f"{BASE_URL}/api/users/profile"
    try:
        resp = requests.get(profile_url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        profile_data = resp.json()
        assert isinstance(profile_data, dict), "Profile response should be a dict"
        # Check at least userId or some expected profile fields exist (e.g. username, email)
        assert "userId" in profile_data or "username" in profile_data or "email" in profile_data
    except Exception as e:
        assert False, f"Failed to get user profile: {e}"

    # Step 2: Update user profile with new data (toggling some field or adding a test name)
    updated_profile = profile_data.copy()
    # Update an existing field for testing
    if "username" in updated_profile:
        updated_profile["username"] = "test_username_TC010"
        field_to_check = "username"
    elif "email" in updated_profile:
        updated_profile["email"] = "test_email_TC010@example.com"
        field_to_check = "email"
    else:
        # If neither field exists, just skip the update test with an assert fail
        assert False, "No updatable field available in profile to test update"

    try:
        resp = requests.put(profile_url, headers=HEADERS, json=updated_profile, timeout=TIMEOUT)
        resp.raise_for_status()
        # Instead of checking response, re-get profile to verify update
        resp_get = requests.get(profile_url, headers=HEADERS, timeout=TIMEOUT)
        resp_get.raise_for_status()
        profile_after_update = resp_get.json()
        # Check updated field is actually changed
        assert profile_after_update.get(field_to_check) == updated_profile[field_to_check], f"Profile update failed to persist {field_to_check}"
    except Exception as e:
        assert False, f"Failed to update user profile: {e}"

    # Step 3: Add a new skill
    skill_url = f"{BASE_URL}/api/users/skills"
    skill_payload = {"skillName": "Python Automation", "level": "Intermediate"}  # Sample skill data
    skill_id = None
    try:
        resp = requests.post(skill_url, headers=HEADERS, json=skill_payload, timeout=TIMEOUT)
        resp.raise_for_status()
        skill_resp = resp.json()
        # Expect the response to contain new skill id
        skill_id = skill_resp.get("id")
        assert skill_id is not None, "Skill ID should be returned after adding skill"
        assert skill_resp.get("skillName") == skill_payload["skillName"]
        assert skill_resp.get("level") == skill_payload["level"]
    except Exception as e:
        assert False, f"Failed to add skill: {e}"

    # Step 4: Remove the skill added
    try:
        if skill_id is not None:
            del_skill_url = f"{BASE_URL}/api/users/skills/{skill_id}"
            resp = requests.delete(del_skill_url, headers=HEADERS, timeout=TIMEOUT)
            # Success usually 200 or 204 No Content
            assert resp.status_code in (200, 204), f"Failed to delete skill, status code {resp.status_code}"
    except Exception as e:
        assert False, f"Failed to remove skill: {e}"

    # Step 5: Retrieve saved items
    saved_items_url = f"{BASE_URL}/api/users/saved"
    try:
        resp = requests.get(saved_items_url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        saved_items = resp.json()
        assert isinstance(saved_items, (list, dict)), "Saved items response should be a list or dict"
    except Exception as e:
        assert False, f"Failed to retrieve saved items: {e}"

    # Step 6: Retrieve applications
    applications_url = f"{BASE_URL}/api/users/applications"
    try:
        resp = requests.get(applications_url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        applications = resp.json()
        assert isinstance(applications, (list, dict)), "Applications response should be a list or dict"
    except Exception as e:
        assert False, f"Failed to retrieve applications: {e}"

test_user_profile_and_skill_management()

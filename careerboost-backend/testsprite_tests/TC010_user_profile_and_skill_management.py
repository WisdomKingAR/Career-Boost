import requests
import time

BASE_URL = "http://localhost:5000"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}
TIMEOUT = 30


def test_user_profile_and_skill_management():
    # Check server reachable and respond quickly
    try:
        start = time.time()
        health_resp = requests.get(f"{BASE_URL}/api/users/profile", headers=HEADERS, timeout=TIMEOUT)
        duration = time.time() - start
        assert health_resp.status_code == 200, f"Profile endpoint not reachable, status {health_resp.status_code}"
        assert duration <= 2, f"Server response too slow: {duration:.2f} seconds"
    except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
        assert False, f"Server unreachable or request timeout: {e}"

    # Retrieve current user profile
    profile_resp = requests.get(f"{BASE_URL}/api/users/profile", headers=HEADERS, timeout=TIMEOUT)
    assert profile_resp.status_code == 200, f"Failed to retrieve user profile: {profile_resp.text}"
    profile_data = profile_resp.json()
    assert isinstance(profile_data, dict), "Profile data is not a dict"

    # Backup original profile to restore later
    original_profile = profile_data.copy()

    # Update user profile - modify username (or any modifiable field), adding suffix "_test"
    updated_profile_payload = original_profile.copy()
    # Assuming 'name' field exists in profile; if not, fallback to 'username' or something similar
    if "name" in updated_profile_payload and isinstance(updated_profile_payload["name"], str):
        updated_profile_payload["name"] = updated_profile_payload["name"] + "_test"
    elif "username" in updated_profile_payload and isinstance(updated_profile_payload["username"], str):
        updated_profile_payload["username"] = updated_profile_payload["username"] + "_test"
    else:
        # If no modifiable field, add a dummy one for test (e.g. 'bio')
        updated_profile_payload["bio"] = "Test update"

    put_resp = requests.put(f"{BASE_URL}/api/users/profile", headers=HEADERS, json=updated_profile_payload, timeout=TIMEOUT)
    assert put_resp.status_code in (200, 204), f"Failed to update user profile: {put_resp.text}"

    # Retrieve profile again to confirm update
    profile_after_update_resp = requests.get(f"{BASE_URL}/api/users/profile", headers=HEADERS, timeout=TIMEOUT)
    assert profile_after_update_resp.status_code == 200, f"Failed to retrieve profile after update: {profile_after_update_resp.text}"
    updated_profile = profile_after_update_resp.json()
    # Confirm update applied (check modified field)
    updated_field_ok = False
    if "name" in updated_profile_payload:
        updated_field_ok = updated_profile.get("name") == updated_profile_payload["name"]
    elif "username" in updated_profile_payload:
        updated_field_ok = updated_profile.get("username") == updated_profile_payload["username"]
    else:
        updated_field_ok = updated_profile.get("bio") == updated_profile_payload.get("bio", None)
    assert updated_field_ok, "Profile update did not persist"

    # Add a skill
    skill_payload = {"skill": "Python Automation Test"}
    skill_post_resp = requests.post(f"{BASE_URL}/api/users/skills", headers=HEADERS, json=skill_payload, timeout=TIMEOUT)
    assert skill_post_resp.status_code == 201, f"Failed to add skill: {skill_post_resp.text}"
    skill_data = skill_post_resp.json()
    assert "id" in skill_data, "Skill addition response missing 'id'"
    skill_id = skill_data["id"]

    try:
        # Confirm skill addition in skills list by retrieving saved items? Probably not saved items, but test skills retrieval indirectly
        # There's no explicit GET for skills endpoint documented, so we test removal directly

        # Remove the skill added
        skill_delete_resp = requests.delete(f"{BASE_URL}/api/users/skills/{skill_id}", headers=HEADERS, timeout=TIMEOUT)
        assert skill_delete_resp.status_code == 200, f"Failed to remove skill: {skill_delete_resp.text}"

        # Check saved items
        saved_items_resp = requests.get(f"{BASE_URL}/api/users/saved", headers=HEADERS, timeout=TIMEOUT)
        assert saved_items_resp.status_code == 200, f"Failed to get saved items: {saved_items_resp.text}"
        saved_items = saved_items_resp.json()
        assert isinstance(saved_items, (list, dict)), "Saved items is not list or dict"

        # Check applications
        applications_resp = requests.get(f"{BASE_URL}/api/users/applications", headers=HEADERS, timeout=TIMEOUT)
        assert applications_resp.status_code == 200, f"Failed to get applications: {applications_resp.text}"
        applications = applications_resp.json()
        assert isinstance(applications, (list, dict)), "Applications is not list or dict"

    finally:
        # Restore original profile
        restore_resp = requests.put(f"{BASE_URL}/api/users/profile", headers=HEADERS, json=original_profile, timeout=TIMEOUT)
        assert restore_resp.status_code in (200, 204), f"Failed to restore original profile: {restore_resp.text}"


test_user_profile_and_skill_management()
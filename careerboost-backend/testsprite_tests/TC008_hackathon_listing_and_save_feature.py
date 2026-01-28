import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_hackathon_listing_and_save_feature():
    saved_hackathon_id = None
    try:
        # Step 1: List upcoming hackathons
        upcoming_url = f"{BASE_URL}/api/hackathons/upcoming"
        response = requests.get(upcoming_url, headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 OK for upcoming hackathons, got {response.status_code}"
        hackathons = response.json()
        assert isinstance(hackathons, list), "Expected list of hackathons in response"
        assert len(hackathons) >= 0, "Hackathons list should be present (empty or not)"
        
        # If no upcoming hackathons, then we cannot test save functionality, but we still pass the listing test.
        if len(hackathons) == 0:
            return

        # Step 2: Pick a hackathon to save
        hackathon = hackathons[0]
        assert "id" in hackathon, "Hackathon item missing 'id' field"
        hackathon_id = hackathon["id"]

        # Step 3: Save the hackathon to user profile
        save_url = f"{BASE_URL}/api/hackathons/{hackathon_id}/save"
        save_response = requests.post(save_url, headers=HEADERS, timeout=TIMEOUT)
        assert save_response.status_code in (200, 201), (
            f"Expected 200 or 201 when saving hackathon, got {save_response.status_code}"
        )
        save_result = save_response.json()
        # Save result validation can vary; assuming success returns some success message or saved hackathon id
        assert ("success" in save_result and save_result["success"]) or ("id" in save_result and save_result["id"] == hackathon_id), \
            "Saving hackathon did not return expected success confirmation"

        saved_hackathon_id = hackathon_id

        # Step 4: Verify saved hackathon appears in user's saved items
        saved_items_url = f"{BASE_URL}/api/users/saved"
        saved_items_response = requests.get(saved_items_url, headers=HEADERS, timeout=TIMEOUT)
        assert saved_items_response.status_code == 200, f"Expected 200 OK for user saved items, got {saved_items_response.status_code}"
        saved_items = saved_items_response.json()
        # saved_items may not include a 'type' field, so just check by matching 'id'
        hackathon_saved = any(
            item.get("id") == saved_hackathon_id
            for item in saved_items
        )
        assert hackathon_saved, "Saved hackathon not found in user's saved items"

    finally:
        # Cleanup: Unsave the hackathon if it was saved
        if saved_hackathon_id is not None:
            unsave_url = f"{BASE_URL}/api/hackathons/{saved_hackathon_id}/save"
            try:
                unsave_resp = requests.delete(unsave_url, headers=HEADERS, timeout=TIMEOUT)
                # Accept 200 or 204 as success for delete
                assert unsave_resp.status_code in (200, 204), f"Expected 200 or 204 on unsave, got {unsave_resp.status_code}"
            except Exception:
                # If unsave fails, we just silently pass here to not mask original test errors
                pass

test_hackathon_listing_and_save_feature()

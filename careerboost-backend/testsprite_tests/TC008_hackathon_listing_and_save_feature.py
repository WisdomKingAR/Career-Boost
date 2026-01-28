import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_hackathon_listing_and_save_feature():
    # List upcoming hackathons
    upcoming_url = f"{BASE_URL}/api/hackathons/upcoming"
    list_resp = requests.get(upcoming_url, headers=HEADERS, timeout=TIMEOUT)
    assert list_resp.status_code == 200, f"Expected 200 but got {list_resp.status_code}"
    hackathons = list_resp.json()
    assert isinstance(hackathons, list), "Response is not a list"
    assert len(hackathons) > 0, "No upcoming hackathons found"

    # Pick the first hackathon to save
    hackathon_id = hackathons[0].get("id")
    assert hackathon_id is not None, "Hackathon ID missing"

    save_url = f"{BASE_URL}/api/hackathons/{hackathon_id}/save"
    try:
        save_resp = requests.post(save_url, headers=HEADERS, timeout=TIMEOUT)
        assert save_resp.status_code == 200, f"Save hackathon failed with status {save_resp.status_code}"

        # Verify the hackathon is saved in user profile
        saved_url = f"{BASE_URL}/api/users/saved"
        saved_resp = requests.get(saved_url, headers=HEADERS, timeout=TIMEOUT)
        assert saved_resp.status_code == 200, f"Get saved items failed with status {saved_resp.status_code}"
        saved_items = saved_resp.json()
        assert any(item.get("id") == hackathon_id for item in saved_items), "Saved hackathon not found in user profile"
    finally:
        # Unsave the hackathon to clean up
        unsave_url = f"{BASE_URL}/api/hackathons/{hackathon_id}/save"
        requests.delete(unsave_url, headers=HEADERS, timeout=TIMEOUT)


test_hackathon_listing_and_save_feature()
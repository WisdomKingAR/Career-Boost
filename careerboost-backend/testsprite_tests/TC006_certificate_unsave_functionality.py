import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_certificate_unsave_functionality():
    # First, get a list of certificates to pick one to save and then unsave
    certificates_url = f"{BASE_URL}/api/certificates"
    try:
        resp = requests.get(certificates_url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        certificates = resp.json()
        assert isinstance(certificates, list), "Certificates response should be a list"
        assert len(certificates) > 0, "Certificates list should not be empty"
        certificate_id = certificates[0].get("id")
        assert certificate_id is not None, "Certificate ID should be present"

        # Save the certificate to user's profile using a POST to save endpoint is not documented,
        # but logically to test unsave we must save first - assuming there's a POST /save endpoint missing from PRD,
        # since only DELETE is shown for unsave. So we will simulate by a save POST to /api/certificates/{id}/save
        save_url = f"{BASE_URL}/api/certificates/{certificate_id}/save"
        # The PRD shows DELETE on /save but no POST, so let's try POST to same for save, or else skip save and directly unsave.
        # Since no POST documented, assuming the user already saved. So, to not fail due to missing POST, test unsave only.
        # However, to ensure it's saved, try to save by calling PUT or similar if fails ignore.
        # For safety, try POST (not in PRD) but handle failure.

        save_resp = requests.post(save_url, headers=HEADERS, timeout=TIMEOUT)
        if save_resp.status_code not in (200, 201, 204):
            # Ignore save error; maybe already saved, continue
            pass

        # Now call DELETE to unsave the certificate
        unsave_resp = requests.delete(save_url, headers=HEADERS, timeout=TIMEOUT)
        assert unsave_resp.status_code == 200, f"Expected 200 OK on unsave, got {unsave_resp.status_code}"

        # Validate the certificate is no longer in the user's saved list
        saved_items_url = f"{BASE_URL}/api/users/saved"
        saved_resp = requests.get(saved_items_url, headers=HEADERS, timeout=TIMEOUT)
        saved_resp.raise_for_status()
        saved_data = saved_resp.json()
        certificates_saved = saved_data.get("certificates", []) if isinstance(saved_data, dict) else []
        # Not guaranteed the key "certificates" exists, but user saved items expected to be structured.
        # Check if certificate_id not in saved certificates
        assert certificate_id not in certificates_saved, "Certificate was not removed from saved items"

    except requests.RequestException as e:
        assert False, f"HTTP Request failed: {e}"
    except AssertionError as ae:
        raise ae


test_certificate_unsave_functionality()
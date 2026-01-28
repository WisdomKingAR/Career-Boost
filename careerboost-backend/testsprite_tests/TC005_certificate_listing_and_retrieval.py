import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/json"
}
TIMEOUT = 30

def test_certificate_listing_and_retrieval():
    session = requests.Session()
    session.headers.update(HEADERS)

    # 1. List all certificates
    try:
        list_resp = session.get(f"{BASE_URL}/api/certificates", timeout=TIMEOUT)
        assert list_resp.status_code == 200, f"Expected 200 OK, got {list_resp.status_code}"
        list_data = list_resp.json()
        assert isinstance(list_data, list), "Certificate list response is not a list"

        if not list_data:
            # If no certificates returned, skip further retrieval tests
            print("No certificates found to retrieve by ID.")
            return

        # Pick one certificate id from the list for retrieval test
        certificate_id = None
        # Items may be dict representing certificate objects, find id key
        # Some APIs use _id, id, or certificateId, assume 'id'
        for item in list_data:
            if isinstance(item, dict) and "id" in item:
                certificate_id = item["id"]
                break

        assert certificate_id is not None, "No certificate ID found in list response"

        # 2. Retrieve certificate by ID
        get_resp = session.get(f"{BASE_URL}/api/certificates/{certificate_id}", timeout=TIMEOUT)
        assert get_resp.status_code == 200, f"Expected 200 OK for certificate retrieval, got {get_resp.status_code}"
        cert_data = get_resp.json()
        assert isinstance(cert_data, dict), "Certificate retrieval response is not a dict"
        assert cert_data.get("id") == certificate_id, "Certificate ID mismatch in retrieval"

        # 3. Search certificates (example search: with empty query or some keyword)
        # Since API doc says /api/certificates/search is GET, presumed with query param
        # Use a generic search param 'q' or 'search' if no docs on param - test with none or sample
        search_params = {"q": "Data"}  # Search keyword example
        search_resp = session.get(f"{BASE_URL}/api/certificates/search", params=search_params, timeout=TIMEOUT)
        assert search_resp.status_code == 200, f"Expected 200 OK for certificate search, got {search_resp.status_code}"
        search_data = search_resp.json()
        assert isinstance(search_data, list), "Certificate search response is not a list"

    except requests.RequestException as e:
        raise AssertionError(f"HTTP request failed: {e}")
    except ValueError as e:
        raise AssertionError(f"Invalid JSON response: {e}")

test_certificate_listing_and_retrieval()
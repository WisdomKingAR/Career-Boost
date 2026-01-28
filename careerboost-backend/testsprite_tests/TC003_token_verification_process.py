import requests

BASE_URL = "http://localhost:5000"
VERIFY_ENDPOINT = "/api/auth/verify"
HEADERS_VALID = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
}
HEADERS_INVALID = {
    "Authorization": "Bearer invalid.or.expired.token"
}
TIMEOUT = 30

def test_token_verification_process():
    # Test valid token
    try:
        response_valid = requests.get(f"{BASE_URL}{VERIFY_ENDPOINT}", headers=HEADERS_VALID, timeout=TIMEOUT)
        assert response_valid.status_code == 200, f"Expected status 200 for valid token, got {response_valid.status_code}"
        json_valid = response_valid.json()
        assert "valid" in json_valid, "Response JSON should contain 'valid' key"
        assert json_valid["valid"] is True, "Valid token should be accepted (valid==True)"
    except requests.RequestException as e:
        assert False, f"Request failed for valid token: {e}"

    # Test invalid/expired token
    try:
        response_invalid = requests.get(f"{BASE_URL}{VERIFY_ENDPOINT}", headers=HEADERS_INVALID, timeout=TIMEOUT)
        # Assuming invalid token returns 401 Unauthorized or 403 Forbidden
        assert response_invalid.status_code in (401, 403), f"Expected status 401 or 403 for invalid token, got {response_invalid.status_code}"
        json_invalid = response_invalid.json()
        assert "valid" in json_invalid, "Response JSON should contain 'valid' key"
        assert json_invalid["valid"] is False, "Invalid/expired token should be rejected (valid==False)"
    except requests.RequestException as e:
        assert False, f"Request failed for invalid token: {e}"

test_token_verification_process()
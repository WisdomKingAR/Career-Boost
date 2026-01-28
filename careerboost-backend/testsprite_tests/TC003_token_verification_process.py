import requests
from requests.exceptions import RequestException

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
TIMEOUT = 30

def test_token_verification_process():
    """Test the token verification endpoint to confirm valid tokens are accepted and invalid or expired
    tokens are rejected."""
    url = f"{BASE_URL}/api/auth/verify"

    # Test valid token - Expect HTTP 200 (Assuming 200 means token valid)
    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        # Validate response content if any, here we assume a JSON response with isValid = True or similar
        json_data = response.json()
        assert isinstance(json_data, dict), "Response is not a JSON object"
        # Assuming response has a field "valid" that confirms token validity; if not, adapt as needed
        assert "valid" in json_data, "Response does not contain 'valid' key"
        assert json_data["valid"] is True, "Valid token was not accepted"
    except RequestException as e:
        assert False, f"Request with valid token failed: {e}"
    except (ValueError, AssertionError) as e:
        assert False, f"Response validation failed for valid token: {e}"

    # Test invalid token (random string)
    invalid_headers = {"Authorization": "Bearer invalid.token.string"}
    try:
        response = requests.get(url, headers=invalid_headers, timeout=TIMEOUT)
        # Expecting failure, e.g., 401 Unauthorized or 403 Forbidden
        assert response.status_code in (401, 403), f"Expected 401 or 403 for invalid token, got {response.status_code}"
    except RequestException as e:
        assert False, f"Request with invalid token failed unexpectedly: {e}"

    # Test expired token (simulate by using a token that is presumably expired)
    # For the sake of test, modify the token slightly to simulate expiry or use the provided token's expiry logic
    # Here we assume provided token is expired for test, so reuse it with different method or header removed
    # Since no other expired token provided, let's create an expired token scenario by manipulating the token:
    expired_token = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTYwOTUyODc5MywiZXhwIjoxNjA5MTMzNTkzfQ."
        "expiredSignatureString"
    )
    expired_headers = {"Authorization": f"Bearer {expired_token}"}
    try:
        response = requests.get(url, headers=expired_headers, timeout=TIMEOUT)
        assert response.status_code in (401, 403), f"Expected 401 or 403 for expired token, got {response.status_code}"
    except RequestException as e:
        assert False, f"Request with expired token failed unexpectedly: {e}"

test_token_verification_process()
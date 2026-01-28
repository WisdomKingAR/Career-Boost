import requests

BASE_URL = "http://localhost:5000"
LOGIN_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

def test_user_login_functionality():
    headers = {
        "Content-Type": "application/json"
    }

    # Valid credentials test
    valid_payload = {
        "email": "validuser@example.com",
        "password": "ValidPass123!"
    }
    try:
        response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=valid_payload,
            headers=headers,
            timeout=TIMEOUT
        )
    except requests.RequestException as e:
        assert False, f"RequestException during valid login test: {e}"
    assert response.status_code == 200, f"Expected 200 OK for valid login, got {response.status_code}"
    json_response = response.json()
    assert "token" in json_response and isinstance(json_response["token"], str) and len(json_response["token"]) > 0, "Login response missing or invalid token"

    # Invalid credentials test
    invalid_payload = {
        "email": "invaliduser@example.com",
        "password": "WrongPassword!"
    }
    try:
        response_invalid = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=invalid_payload,
            headers=headers,
            timeout=TIMEOUT
        )
    except requests.RequestException as e:
        assert False, f"RequestException during invalid login test: {e}"
    # The exact status code and error structure might vary, assume 401 Unauthorized or 400 Bad Request for invalid login
    assert response_invalid.status_code in (400, 401), f"Expected 400 or 401 for invalid login, got {response_invalid.status_code}"
    json_invalid = response_invalid.json()
    assert "error" in json_invalid or "message" in json_invalid, "Invalid login response missing 'error' or 'message' field"

test_user_login_functionality()
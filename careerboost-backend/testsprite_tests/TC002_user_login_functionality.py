import requests

BASE_URL = "http://localhost:5000"
LOGIN_ENDPOINT = f"{BASE_URL}/api/auth/login"

def test_user_login_functionality():
    timeout = 30
    headers = {"Content-Type": "application/json"}

    # Valid credentials (example)
    valid_payload = {
        "email": "testuser@example.com",
        "password": "ValidPass123!"
    }

    # Invalid credentials: wrong password
    invalid_payload_wrong_password = {
        "email": "testuser@example.com",
        "password": "WrongPass"
    }

    # Invalid credentials: non-existent user
    invalid_payload_no_user = {
        "email": "nouser@example.com",
        "password": "SomePass123"
    }

    try:
        # Test login with valid credentials
        resp = requests.post(LOGIN_ENDPOINT, json=valid_payload, headers=headers, timeout=timeout)
        assert resp.status_code == 200, f"Expected 200 for valid login, got {resp.status_code}"
        json_resp = resp.json()
        assert "token" in json_resp and isinstance(json_resp["token"], str) and len(json_resp["token"]) > 0, "Token missing or invalid in valid login response"

        # Test login with invalid password
        resp_invalid_pw = requests.post(LOGIN_ENDPOINT, json=invalid_payload_wrong_password, headers=headers, timeout=timeout)
        assert resp_invalid_pw.status_code in [400, 401], f"Expected 400 or 401 for invalid password, got {resp_invalid_pw.status_code}"
        json_resp_invalid_pw = resp_invalid_pw.json()
        assert "error" in json_resp_invalid_pw or "message" in json_resp_invalid_pw, "Error message missing for invalid password login"

        # Test login with non-existent user
        resp_no_user = requests.post(LOGIN_ENDPOINT, json=invalid_payload_no_user, headers=headers, timeout=timeout)
        assert resp_no_user.status_code in [400, 401], f"Expected 400 or 401 for non-existent user, got {resp_no_user.status_code}"
        json_resp_no_user = resp_no_user.json()
        assert "error" in json_resp_no_user or "message" in json_resp_no_user, "Error message missing for non-existent user login"

    except requests.RequestException as e:
        assert False, f"Request failed: {str(e)}"

test_user_login_functionality()
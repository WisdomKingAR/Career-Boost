import requests
import uuid

BASE_URL = "http://localhost:5000"
REGISTER_ENDPOINT = "/api/auth/register"
TIMEOUT = 30


def test_user_registration_functionality():
    headers = {
        "Content-Type": "application/json"
    }

    # Generate a unique email to avoid conflicts
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    valid_payload = {
        "email": unique_email,
        "password": "StrongP@ssw0rd123",
        "name": "Test User"
    }

    # 1. Test successful registration with valid data
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=valid_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert response.status_code == 201 or response.status_code == 200, f"Unexpected status code: {response.status_code}"
    try:
        body = response.json()
    except Exception:
        assert False, "Response is not valid JSON"
    # Assuming response contains user id or success message
    assert "user" in body or "id" in body or "message" in body, "Response JSON missing expected keys"

    # 2. Test registration with missing email
    invalid_payload = valid_payload.copy()
    del invalid_payload["email"]
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=invalid_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert response.status_code == 400 or response.status_code == 422, f"Expected error code for missing email but got {response.status_code}"

    # 3. Test registration with invalid email format
    invalid_payload = valid_payload.copy()
    invalid_payload["email"] = "invalid-email-format"
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=invalid_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert response.status_code == 400 or response.status_code == 422, f"Expected error code for invalid email but got {response.status_code}"

    # 4. Test registration with missing password
    invalid_payload = valid_payload.copy()
    del invalid_payload["password"]
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=invalid_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert response.status_code == 400 or response.status_code == 422, f"Expected error code for missing password but got {response.status_code}"

    # 5. Test registration with weak password (simple example)
    invalid_payload = valid_payload.copy()
    invalid_payload["password"] = "123"
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=invalid_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert response.status_code == 400 or response.status_code == 422, f"Expected error code for weak password but got {response.status_code}"


test_user_registration_functionality()
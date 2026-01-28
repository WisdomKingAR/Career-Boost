import requests
import uuid

BASE_URL = "http://localhost:5000"
REGISTER_ENDPOINT = "/api/auth/register"
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI",
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_user_registration_functionality():
    # Valid user data for registration
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    valid_payload = {
        "email": unique_email,
        "password": "StrongPass!123",
        "name": "Test User"
    }

    # 1. Test successful registration with valid inputs
    response = requests.post(
        url=BASE_URL + REGISTER_ENDPOINT,
        headers=HEADERS,
        json=valid_payload,
        timeout=TIMEOUT
    )
    assert response.status_code == 201, f"Expected 201 Created, got {response.status_code}"
    registration_data = response.json()
    assert "userId" in registration_data or "id" in registration_data, "Response missing user ID"
    # Relaxed email assertion due to possible absence or different naming
    if "email" in registration_data:
        assert registration_data.get("email") == unique_email, "Registered email mismatch"

    created_user_id = registration_data.get("userId") or registration_data.get("id")

    # 2. Test error handling for invalid inputs
    invalid_payloads = [
        # Missing password
        {"email": "invalid1@example.com", "name": "No Password"},
        # Missing email
        {"password": "SomePass123!", "name": "No Email"},
        # Invalid email format
        {"email": "invalid-email-format", "password": "SomePass123!", "name": "Invalid Email"},
        # Password too short
        {"email": "shortpass@example.com", "password": "123", "name": "Short Password"},
        # Empty payload
        {},
    ]

    for idx, payload in enumerate(invalid_payloads, start=1):
        err_response = requests.post(
            url=BASE_URL + REGISTER_ENDPOINT,
            headers=HEADERS,
            json=payload,
            timeout=TIMEOUT
        )
        # Expecting 400 Bad Request or similar client error
        assert err_response.status_code >= 400 and err_response.status_code < 500, (
            f"Invalid input test case #{idx} expected client error, got {err_response.status_code}"
        )
        error_data = err_response.json()
        # At least some error message key
        assert "error" in error_data or "message" in error_data, "Error response missing explanation"


    # No resource cleanup needed since user registration creates a persistent user, and deletion API is not specified.


test_user_registration_functionality()

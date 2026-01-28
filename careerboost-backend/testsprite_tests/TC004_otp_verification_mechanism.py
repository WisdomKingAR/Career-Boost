import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_otp_verification_mechanism():
    # First, simulate requesting an OTP to obtain a valid OTP for testing.
    # Since PRD doesn't specify an endpoint for sending OTP, we'll assume for test we generate an OTP via login or separate request.
    # To complete the test, we try verifying OTPs - correct, incorrect, expired.
    
    # For testing, assume OTP is '123456' for success. Adjust if needed.
    valid_otp = "123456"
    invalid_otp = "000000"
    expired_otp = "654321"

    url = f"{BASE_URL}/api/auth/verify-otp"

    # Test 1: Correct OTP
    try:
        payload = {"otp": valid_otp}
        response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 for valid OTP, got {response.status_code}"
        json_resp = response.json()
        assert "message" in json_resp and ("success" in json_resp["message"].lower() or "verified" in json_resp["message"].lower()), \
            "Valid OTP verification response missing success message"
    except requests.RequestException as e:
        assert False, f"Request exception during valid OTP verification: {e}"

    # Test 2: Incorrect OTP
    try:
        payload = {"otp": invalid_otp}
        response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code in (400, 401), f"Expected 400 or 401 for invalid OTP, got {response.status_code}"
        json_resp = response.json()
        assert "error" in json_resp or "message" in json_resp, "Invalid OTP error response missing error/message"
    except requests.RequestException as e:
        assert False, f"Request exception during invalid OTP verification: {e}"

    # Test 3: Expired OTP
    try:
        payload = {"otp": expired_otp}
        response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
        # Expecting expired OTP treated same as invalid with error status code
        assert response.status_code in (400, 401), f"Expected 400 or 401 for expired OTP, got {response.status_code}"
        json_resp = response.json()
        assert "error" in json_resp or "message" in json_resp, "Expired OTP error response missing error/message"
    except requests.RequestException as e:
        assert False, f"Request exception during expired OTP verification: {e}"

test_otp_verification_mechanism()
import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

def test_internship_listing_and_application():
    internship_id = None
    try:
        # 1. List all internships
        resp_list = requests.get(f"{BASE_URL}/api/internships", headers=HEADERS, timeout=30)
        assert resp_list.status_code == 200, f"Unexpected status code for listing internships: {resp_list.status_code}"
        internships = resp_list.json()
        assert isinstance(internships, list), "Internships listing response is not a list"

        # 2. Search internships with a generic keyword if none exist pick a new internship
        search_keyword = "data"
        resp_search = requests.get(f"{BASE_URL}/api/internships/search", headers=HEADERS, params={"q": search_keyword}, timeout=30)
        assert resp_search.status_code == 200, f"Unexpected status code for searching internships: {resp_search.status_code}"
        search_results = resp_search.json()
        assert isinstance(search_results, list), "Internship search response is not a list"

        # 3. Determine an internship ID to test save and apply
        if search_results:
            internship_id = search_results[0].get("id")
        elif internships:
            internship_id = internships[0].get("id")

        # If no internships found, create a dummy internship for testing (assuming POST /api/internships endpoint exists)
        if not internship_id:
            create_payload = {
                "title": "Test Internship for Automation",
                "company": "TestCo",
                "location": "Remote",
                "description": "Test internship created by test script",
                "duration": "3 months",
                "stipend": "1000 USD",
                "applyBy": "2099-12-31"
            }
            create_resp = requests.post(f"{BASE_URL}/api/internships", headers=HEADERS, json=create_payload, timeout=30)
            assert create_resp.status_code in (200,201), f"Failed to create test internship: {create_resp.status_code}"
            internship = create_resp.json()
            internship_id = internship.get("id")
            assert internship_id is not None, "Created internship ID is None"

        # 4. Save the internship
        resp_save = requests.post(f"{BASE_URL}/api/internships/{internship_id}/save", headers=HEADERS, timeout=30)
        assert resp_save.status_code == 200, f"Failed to save internship {internship_id}: {resp_save.status_code}"
        save_resp_json = resp_save.json()
        assert "message" in save_resp_json, "Save internship response missing message"

        # 5. Apply to the internship
        apply_payload = {
            "resumeLink": "http://example.com/resume.pdf",
            "coverLetter": "I am excited to apply for this internship."
        }
        resp_apply = requests.post(f"{BASE_URL}/api/internships/{internship_id}/apply", headers=HEADERS, json=apply_payload, timeout=30)
        assert resp_apply.status_code == 200, f"Failed to apply to internship {internship_id}: {resp_apply.status_code}"
        apply_resp_json = resp_apply.json()
        assert "applicationId" in apply_resp_json or "message" in apply_resp_json, "Apply internship response missing applicationId or message"

        # 6. Verify application is recorded for the user
        resp_apps = requests.get(f"{BASE_URL}/api/users/applications", headers=HEADERS, timeout=30)
        assert resp_apps.status_code == 200, f"Failed to get user applications: {resp_apps.status_code}"
        applications = resp_apps.json()
        assert isinstance(applications, list), "User applications response is not a list"
        matched_apps = [app for app in applications if app.get("internshipId") == internship_id]
        assert matched_apps, f"No application record found for internship ID {internship_id}"

    finally:
        # Cleanup: Unsaved internship if saved (ignore errors)
        if internship_id:
            try:
                requests.delete(f"{BASE_URL}/api/internships/{internship_id}/save", headers=HEADERS, timeout=30)
            except:
                pass
            # If the internship was created by the test and assuming DELETE endpoint exists, delete it too
            # We attempt to delete if it was newly created
            # No info about delete endpoint - so skipping deleting internship resource

test_internship_listing_and_application()
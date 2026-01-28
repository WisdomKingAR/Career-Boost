
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** careerboost-frontend
- **Date:** 2026-01-28
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 User Registration Success
- **Test Code:** [TC001_User_Registration_Success.py](./TC001_User_Registration_Success.py)
- **Test Error:** Test result: FAILED to register a new user and receive a JWT.

What was executed:
- Opened the Sign Up modal and filled the form with: Full Name='Test User', Username='testuser', Email='test@example.com', Password='abc123456'.
- Submitted the Sign Up form.
- Inspected the page content and browser storage for evidence of success and token.

Observed evidence:
- Page body contains the error text: 'User already exists' (registration prevented by existing account).
- localStorage keys inspected: {token: null, jwt: null, accessToken: null, authToken: null, authorization: null, access_token: null, id_token: null}.
- sessionStorage keys inspected: {token: null, jwt: null, accessToken: null, authToken: null, authorization: null, access_token: null, id_token: null}.
- No JWT or access token found in storage, and no visible success message or redirect to an authenticated/dashboard page.

Conclusion:
- New user registration did not succeed because the account already exists. Consequently, no JWT was issued/stored by the client.

Recommended next steps:
1) Use a unique email/username (not already registered) and repeat the registration to confirm success and token issuance.
2) Alternatively, remove the existing test account on the backend (or reset test data) and retry registration.
3) If backend should allow duplicate signups, investigate server-side validation that returns 'User already exists'.

Status: Stopping as requested. If a re-run is desired with a unique test email/username, provide the new credentials or request to reset the backend test user.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/16207c1e-3981-464b-aef3-032a0a9edfb6/4f2eb86a-ebac-413b-839b-6bc61aaf5724
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 User Registration with Existing Email
- **Test Code:** [TC002_User_Registration_with_Existing_Email.py](./TC002_User_Registration_with_Existing_Email.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/16207c1e-3981-464b-aef3-032a0a9edfb6/1b011d97-2475-448a-ac93-7f919c22b67b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 User Login Success
- **Test Code:** [TC003_User_Login_Success.py](./TC003_User_Login_Success.py)
- **Test Error:** Test summary and result — Authentication validation (test@example.com / abc123456): FAILED

What was attempted:
- Opened site and Login modal (done).
- Filled credentials and submitted login (2 attempts).
- Attempted Sign Up with same email (1 attempt) — sign-up response indicated 'User already exists'.
- Re-attempted login after sign-up (done).
- Inspected storage (localStorage, sessionStorage, document.cookie) after attempts (multiple checks).

What was observed (evidence):
- Login modal remains visible after submissions (no navigation to authenticated dashboard).
- First login attempt produced visible text: "Invalid credentials".
- Sign-up attempt produced visible text: "User already exists".
- Storage inspections returned: localStorage = {}, sessionStorage = {}, cookies = "". No JWT-like values or token candidates found.
- Extracted jwtCandidates/decode results: none.
- Dashboard-like content visible behind modal appears to be public/homepage content, not proof of authentication.

Conclusion:
- Registered user login could not be validated. No valid JWT was stored and UI stayed on the login modal. Success=false.

Collected data (raw state highlights):
- localStorage: {}
- sessionStorage: {}
- cookies: ""
- jwtCandidates: []
- Visible messages: "Invalid credentials" (after attempt), "User already exists" (signup)
- Login modal visible with inputs: email=test@example.com, password populated

Recommended next steps for debugging (optional):
1) Confirm the correct credentials with the backend/user store or reset the test user's password.
2) Check backend authentication endpoints and server logs to confirm whether login requests are received and tokens are issued.
3) Verify frontend login request is sent to correct API URL and responses are handled (look for network/XHR entries).
4) Confirm token storage code path (localStorage/sessionStorage) is reachable on successful login.

If further validation is desired, provide permission to: (A) run network/XHR inspection to capture the login response, (B) create/force-reset the test user on the backend, or (C) proceed with API-level authentication checks.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/16207c1e-3981-464b-aef3-032a0a9edfb6/2e18ecdd-6a7a-4acb-bf3a-956fed0ec191
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 User Login Failure with Invalid Credentials
- **Test Code:** [TC004_User_Login_Failure_with_Invalid_Credentials.py](./TC004_User_Login_Failure_with_Invalid_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/16207c1e-3981-464b-aef3-032a0a9edfb6/baa904ad-9124-440b-bb6d-9484d168df18
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Dashboard Data Accuracy
- **Test Code:** [TC005_Dashboard_Data_Accuracy.py](./TC005_Dashboard_Data_Accuracy.py)
- **Test Error:** Result summary:

Outcome: FAILED to verify dashboard after login because authentication did not complete. The login modal remained open and the page shows an 'Invalid credentials' message after two submit attempts. Therefore user-specific dashboard content could not be confirmed.

What was extracted from the current page (saved in extracted_content_0.md):

Metrics (metric_name -> value):
- Certificates -> 50+
- Internships -> 100+
- Hackathons -> 30+
- Saved Items -> null
- AI Tools & Platforms -> null
- Project Ideas -> null
- Latest Tech News -> null

Quick links / quick-action buttons (visible text -> href if available):
- Login (top nav) -> null
- Sign Up (top nav) -> null
- Find Certificates -> null
- Discover Internships -> null
- Upcoming Hackathons -> null
- Latest Tech News -> null
- AI Tools -> null
- Project Ideas -> null
- Saved Items -> null
- Sign Up (modal link) -> #
- Login (modal link) -> #

Additional page details observed:
- Login modal is open with email prefilled as test@example.com and password prefilled; submit button index is [19].
- Page displays an 'Invalid credentials' message after submission attempts.
- No shadow DOM items with additional metrics were found.

Next steps recommended (not executed because user asked to stop):
1) Confirm correct test credentials or update server test account so authentication succeeds.
2) If credentials are correct and login still fails, check backend logs or API responses for authentication errors.
3) After successful login, re-extract the dashboard metrics and quick links to verify user-specific values and link hrefs.

Saved files: extracted_content_0.md (contains the extracted JSON with metrics and quick_links)

Because the requested verification (dashboard after login) could not be completed, success=false.

Attachments:

extracted_content_0.md:
<url>
http://localhost:3000/
</url>
<query>
After login, extract the dashboard content: 1) All career metric labels and their displayed values (e.g., Certificates, Internships, Hackathons, Projects, Saved, or similar) visible on the page; 2) All quick links or quick-action buttons visible on the dashboard (their visible text/label and href if available). Return the findings as structured data (metric_name -> value, and quick_link_text -> href). If some items are inside shadow DOM, include their text as well.
</query>
<result>
{
  "metrics": {
    "Certificates": "50+",
    "Internships": "100+",
    "Hackathons": "30+",
    "Saved Items": null,
    "AI Tools & Platforms": null,
    "Project Ideas": null,
    "Latest Tech News": null
  },
  "quick_links": {
    "Login (top nav)": null,
    "Sign Up (top nav)": null,
    "Find Certificates": null,
    "Discover Internships": null,
    "Upcoming Hackathons": null,
    "Latest Tech News": null,
    "AI Tools": null,
    "Project Ideas": null,
    "Saved Items": null,
    "Sign Up (modal link)": "#",
    "Login (modal link)": "#"
  },
  "shadow_dom_items": []
}
</result>
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/16207c1e-3981-464b-aef3-032a0a9edfb6/30d0cf5a-7ed8-4d0d-b951-8f0485b1b6fe
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **40.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---
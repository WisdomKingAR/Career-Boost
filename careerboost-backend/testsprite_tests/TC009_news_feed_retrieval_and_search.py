import requests

BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTc2OTUyODc5MywiZXhwIjoxNzcwMTMzNTkzfQ.FMkJFPqr-VkFrr61YXkDMQDRp1gKc57kLji-29pShOI"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}"
}
TIMEOUT = 30


def test_news_feed_retrieval_and_search():
    # Test latest news
    url_latest = f"{BASE_URL}/api/news"
    response_latest = requests.get(url_latest, headers=HEADERS, timeout=TIMEOUT)
    assert response_latest.status_code == 200, f"Expected 200 OK for latest news, got {response_latest.status_code}"
    latest_news = response_latest.json()
    assert isinstance(latest_news, list), "Latest news response should be a list"
    if latest_news:  # If there is news, verify key fields
        sample = latest_news[0]
        assert "id" in sample or "title" in sample or "category" in sample, "Latest news items should contain id/title/category"

    # Test news by category (use category from latest news if available)
    category = None
    if latest_news and "category" in latest_news[0]:
        category = latest_news[0]["category"]
    else:
        # Fallback category to test if no news available
        category = "technology"

    url_category = f"{BASE_URL}/api/news/category/{category}"
    response_category = requests.get(url_category, headers=HEADERS, timeout=TIMEOUT)
    assert response_category.status_code == 200, f"Expected 200 OK for news by category, got {response_category.status_code}"
    category_news = response_category.json()
    assert isinstance(category_news, list), "Category news response should be a list"
    if category_news:
        for item in category_news:
            assert "category" in item and item["category"].lower() == category.lower(), "News item category should match requested category"

    # Test news search - search for a common keyword like "AI" or fallback "tech"
    search_query = "AI"
    url_search = f"{BASE_URL}/api/news/search"
    params = {"q": search_query}
    response_search = requests.get(url_search, headers=HEADERS, params=params, timeout=TIMEOUT)
    assert response_search.status_code == 200, f"Expected 200 OK for news search, got {response_search.status_code}"
    searched_news = response_search.json()
    assert isinstance(searched_news, list), "Search news response should be a list"
    if searched_news:
        # Check if at least one result contains the search keyword (case insensitive) in title or description if present
        found = False
        for item in searched_news:
            title = item.get("title", "").lower()
            description = item.get("description", "").lower() if "description" in item else ""
            if search_query.lower() in title or search_query.lower() in description:
                found = True
                break
        assert found, f"Search results should contain news with keyword '{search_query}' in title or description"


test_news_feed_retrieval_and_search()
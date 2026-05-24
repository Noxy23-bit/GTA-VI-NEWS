"""Backend tests for GTA 6 News Hub API."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://gta6-news-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

CATEGORIES = {"rumor", "official", "leak", "trailer", "gameplay"}


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Root ----
def test_root(session):
    r = session.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "message" in data and "GTA 6" in data["message"]
    assert data.get("version") == "1.0"


# ---- News listing ----
def test_list_news(session):
    r = session.get(f"{API}/news", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list)
    assert len(arr) > 0, "Expected seeded articles"
    a = arr[0]
    for k in ["id", "title_pt", "title_en", "summary_pt", "summary_en",
              "content_pt", "content_en", "category", "image_url", "tags", "views"]:
        assert k in a, f"missing {k}"
    assert a["category"] in CATEGORIES


def test_list_news_filter_category(session):
    r = session.get(f"{API}/news", params={"category": "rumor"}, timeout=20)
    assert r.status_code == 200
    for a in r.json():
        assert a["category"] == "rumor"


def test_list_news_search(session):
    r = session.get(f"{API}/news", params={"search": "gta"}, timeout=20)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---- Trending ----
def test_trending(session):
    r = session.get(f"{API}/news/trending", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list) and len(arr) <= 5
    if len(arr) >= 2:
        # sorted desc by views
        for i in range(len(arr) - 1):
            assert arr[i]["views"] >= arr[i + 1]["views"]


# ---- Get article + view increment ----
def test_get_article_and_view_increment(session):
    r = session.get(f"{API}/news", timeout=20)
    article_id = r.json()[0]["id"]
    r1 = session.get(f"{API}/news/{article_id}", timeout=20)
    assert r1.status_code == 200
    v1 = r1.json()["views"]
    r2 = session.get(f"{API}/news/{article_id}", timeout=20)
    assert r2.status_code == 200
    v2 = r2.json()["views"]
    # increments happen after read; second call should see at least v1+1
    assert v2 >= v1 + 1, f"views did not increment {v1}->{v2}"


def test_get_article_404(session):
    r = session.get(f"{API}/news/nonexistent-id-xyz", timeout=15)
    assert r.status_code == 404


# ---- Seed idempotent ----
def test_seed_idempotent(session):
    r = session.post(f"{API}/news/seed", params={"count": 6}, timeout=30)
    assert r.status_code == 200
    data = r.json()
    # Since DB already seeded with ~15 articles, should skip
    assert data.get("status") == "skipped", f"expected skipped but got {data}"
    assert data.get("existing", 0) >= 6


# ---- Comments ----
def test_comments_flow(session):
    r = session.get(f"{API}/news", timeout=20)
    article_id = r.json()[0]["id"]

    # list
    rl = session.get(f"{API}/news/{article_id}/comments", timeout=15)
    assert rl.status_code == 200
    assert isinstance(rl.json(), list)

    # create
    payload = {"nickname": "TEST_user", "message": "TEST_comment_" + uuid.uuid4().hex[:6]}
    rc = session.post(f"{API}/news/{article_id}/comments", json=payload, timeout=15)
    assert rc.status_code == 200, rc.text
    c = rc.json()
    assert c["nickname"] == "TEST_user"
    assert c["message"] == payload["message"]
    assert c["article_id"] == article_id

    # verify persisted
    rl2 = session.get(f"{API}/news/{article_id}/comments", timeout=15)
    ids = [x["id"] for x in rl2.json()]
    assert c["id"] in ids


def test_comment_default_nickname(session):
    r = session.get(f"{API}/news", timeout=20)
    article_id = r.json()[0]["id"]
    payload = {"nickname": "", "message": "TEST_anon_" + uuid.uuid4().hex[:6]}
    rc = session.post(f"{API}/news/{article_id}/comments", json=payload, timeout=15)
    assert rc.status_code == 200
    assert rc.json()["nickname"] == "Anônimo"


def test_comment_article_not_found(session):
    payload = {"nickname": "x", "message": "x"}
    r = session.post(f"{API}/news/nonexistent-id/comments", json=payload, timeout=15)
    assert r.status_code == 404


# ---- Newsletter ----
def test_newsletter_subscribe_and_duplicate(session):
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    r1 = session.post(f"{API}/newsletter/subscribe", json={"email": email}, timeout=15)
    assert r1.status_code == 200
    assert r1.json()["status"] == "subscribed"

    r2 = session.post(f"{API}/newsletter/subscribe", json={"email": email}, timeout=15)
    assert r2.status_code == 200
    assert r2.json()["status"] == "already_subscribed"


# ---- Weekly summary ----
def test_weekly_summary(session):
    r = session.get(f"{API}/weekly-summary", timeout=90)
    assert r.status_code == 200
    d = r.json()
    assert "summary_pt" in d and "summary_en" in d
    assert isinstance(d.get("highlights"), list)
    assert len(d["summary_pt"]) > 0
    assert len(d["summary_en"]) > 0


def test_weekly_summary_refresh(session):
    r = session.post(f"{API}/weekly-summary/refresh", timeout=120)
    assert r.status_code == 200
    d = r.json()
    assert "summary_pt" in d and "summary_en" in d


# ---- Stats ----
def test_stats(session):
    r = session.get(f"{API}/stats", timeout=15)
    assert r.status_code == 200
    d = r.json()
    for k in ["news", "comments", "subscribers"]:
        assert k in d
        assert isinstance(d[k], int)
    assert d["news"] >= 1


# ---- AI Generate (slow) ----
def test_news_generate(session):
    r = session.post(f"{API}/news/generate", timeout=120)
    assert r.status_code == 200, r.text
    a = r.json()
    for k in ["id", "title_pt", "title_en", "summary_pt", "summary_en",
              "content_pt", "content_en", "category", "tags", "image_url"]:
        assert k in a, f"missing {k}"
    assert a["category"] in CATEGORIES
    assert isinstance(a["tags"], list)
    assert a.get("is_ai_generated") is True

    # verify persisted (GET by id)
    rg = session.get(f"{API}/news/{a['id']}", timeout=20)
    assert rg.status_code == 200
    assert rg.json()["title_en"] == a["title_en"]

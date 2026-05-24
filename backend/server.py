from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import re
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI(title="GTA 6 News Hub API")
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

CATEGORIES = ["rumor", "official", "leak", "trailer", "gameplay"]

NEWS_IMAGES = [
    "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.unsplash.com/photo-1770177267441-1d8dadda4feb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
]


class NewsArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_pt: str
    title_en: str
    summary_pt: str
    summary_en: str
    content_pt: str
    content_en: str
    category: str
    source: str = "AI Tracker"
    image_url: str
    tags: List[str] = Field(default_factory=list)
    is_ai_generated: bool = True
    views: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    article_id: str
    nickname: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CommentCreate(BaseModel):
    nickname: str
    message: str


class NewsletterSub(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NewsletterCreate(BaseModel):
    email: EmailStr


class WeeklySummary(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    summary_pt: str
    summary_en: str
    highlights: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============== HELPERS ==============

def serialize_doc(doc: dict) -> dict:
    if doc and '_id' in doc:
        del doc['_id']
    if doc and 'created_at' in doc and isinstance(doc['created_at'], str):
        try:
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        except Exception:
            pass
    return doc


def to_mongo(model: BaseModel) -> dict:
    d = model.model_dump()
    if 'created_at' in d and isinstance(d['created_at'], datetime):
        d['created_at'] = d['created_at'].isoformat()
    return d


async def generate_ai_news(topic_hint: Optional[str] = None) -> dict:
    """Use Claude to generate a realistic GTA 6 news article in PT-BR and EN."""
    session_id = f"news-gen-{uuid.uuid4().hex[:8]}"
    system_msg = (
        "You are an investigative gaming journalist specialized in tracking GTA 6 (Grand Theft Auto VI) news, "
        "leaks, rumors, and official announcements from across the internet. You scan keywords like #GTA6, "
        "#GTAVI, Rockstar Games, Vice City, Jason and Lucia. Generate REALISTIC sounding news articles based "
        "on publicly known information and plausible rumors. Always return a JSON object only."
    )
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_msg,
    ).with_model("anthropic", "claude-sonnet-4-6")

    prompt = f"""Generate ONE GTA 6 news article. Topic hint: {topic_hint or 'recent rumor or leak'}.

Return ONLY a valid JSON object (no markdown, no code fences) with these exact keys:
{{
  "title_pt": "punchy Portuguese headline (max 90 chars)",
  "title_en": "punchy English headline (max 90 chars)",
  "summary_pt": "2-sentence Portuguese summary",
  "summary_en": "2-sentence English summary",
  "content_pt": "full Portuguese article body (4-6 paragraphs, mention sources like Reddit/X/forums)",
  "content_en": "full English article body (4-6 paragraphs, mention sources like Reddit/X/forums)",
  "category": "one of: rumor, official, leak, trailer, gameplay",
  "tags": ["array", "of", "3-5", "lowercase", "tags"]
}}

Topics rotate between: map size, Vice City return, Jason and Lucia characters, release date, online mode, vehicles, missions, soundtrack, gameplay mechanics, easter eggs."""

    response = await chat.send_message(UserMessage(text=prompt))

    # Extract JSON robustly
    text = response.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        text = match.group(0)
    data = json.loads(text)

    if data.get("category") not in CATEGORIES:
        data["category"] = "rumor"
    return data


# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "GTA 6 News Hub API", "version": "1.0"}


@api_router.get("/news", response_model=List[NewsArticle])
async def list_news(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
):
    query = {}
    if category and category != "all":
        query["category"] = category
    if search:
        query["$or"] = [
            {"title_pt": {"$regex": search, "$options": "i"}},
            {"title_en": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
        ]
    cursor = db.news.find(query).sort("created_at", -1).limit(limit)
    docs = await cursor.to_list(limit)
    return [NewsArticle(**serialize_doc(d)) for d in docs]


@api_router.get("/news/trending", response_model=List[NewsArticle])
async def trending_news(limit: int = 5):
    cursor = db.news.find({}).sort([("views", -1), ("created_at", -1)]).limit(limit)
    docs = await cursor.to_list(limit)
    return [NewsArticle(**serialize_doc(d)) for d in docs]


@api_router.get("/news/{article_id}", response_model=NewsArticle)
async def get_article(article_id: str):
    doc = await db.news.find_one({"id": article_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.news.update_one({"id": article_id}, {"$inc": {"views": 1}})
    return NewsArticle(**serialize_doc(doc))


@api_router.post("/news/generate", response_model=NewsArticle)
async def generate_news(topic: Optional[str] = None):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    try:
        data = await generate_ai_news(topic)
    except Exception as e:
        logger.exception("AI generation failed")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Pick an image deterministically from pool
    img = NEWS_IMAGES[hash(data["title_en"]) % len(NEWS_IMAGES)]
    article = NewsArticle(
        title_pt=data["title_pt"],
        title_en=data["title_en"],
        summary_pt=data["summary_pt"],
        summary_en=data["summary_en"],
        content_pt=data["content_pt"],
        content_en=data["content_en"],
        category=data["category"],
        tags=data.get("tags", []),
        image_url=img,
    )
    await db.news.insert_one(to_mongo(article))
    return article


@api_router.post("/news/seed")
async def seed_news(count: int = 6):
    """Seed initial AI-generated articles (idempotent: only if collection is small)."""
    existing = await db.news.count_documents({})
    if existing >= count:
        return {"status": "skipped", "existing": existing}

    topics = [
        "GTA 6 release date confirmed by Rockstar leak",
        "Vice City map size rumored to be larger than GTA 5",
        "Jason and Lucia gameplay mechanics leaked from Reddit",
        "GTA 6 trailer 2 reaction and breakdown",
        "GTA Online mode for GTA 6 leaked details",
        "GTA 6 soundtrack featuring 80s synthwave artists",
        "GTA 6 vehicles list and customization rumors",
        "GTA 6 next-gen graphics showcase analysis",
    ]
    created = []
    for t in topics[:count]:
        try:
            data = await generate_ai_news(t)
            img = NEWS_IMAGES[hash(data["title_en"]) % len(NEWS_IMAGES)]
            article = NewsArticle(
                title_pt=data["title_pt"],
                title_en=data["title_en"],
                summary_pt=data["summary_pt"],
                summary_en=data["summary_en"],
                content_pt=data["content_pt"],
                content_en=data["content_en"],
                category=data["category"],
                tags=data.get("tags", []),
                image_url=img,
            )
            await db.news.insert_one(to_mongo(article))
            created.append(article.id)
        except Exception as e:
            logger.warning(f"Failed to seed topic '{t}': {e}")
    return {"status": "ok", "created": len(created), "ids": created}


@api_router.get("/news/{article_id}/comments", response_model=List[Comment])
async def list_comments(article_id: str):
    cursor = db.comments.find({"article_id": article_id}).sort("created_at", -1).limit(200)
    docs = await cursor.to_list(200)
    return [Comment(**serialize_doc(d)) for d in docs]


@api_router.post("/news/{article_id}/comments", response_model=Comment)
async def add_comment(article_id: str, payload: CommentCreate):
    article = await db.news.find_one({"id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    nickname = (payload.nickname or "").strip()[:40] or "Anônimo"
    message = (payload.message or "").strip()[:1000]
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    c = Comment(article_id=article_id, nickname=nickname, message=message)
    await db.comments.insert_one(to_mongo(c))
    return c


@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"status": "already_subscribed"}
    sub = NewsletterSub(email=payload.email)
    await db.newsletter.insert_one(to_mongo(sub))
    return {"status": "subscribed", "id": sub.id}


@api_router.get("/weekly-summary", response_model=WeeklySummary)
async def get_weekly_summary():
    # Return latest summary or generate new one if none / older than 7 days
    doc = await db.weekly_summary.find_one(sort=[("created_at", -1)])
    if doc:
        return WeeklySummary(**serialize_doc(doc))

    # Generate one based on latest news
    latest_news = await db.news.find({}).sort("created_at", -1).limit(8).to_list(8)
    if not latest_news:
        # fallback static
        summary = WeeklySummary(
            summary_pt="Esta semana, a comunidade GTA 6 continua especulando sobre o mapa expandido de Vice City e novos personagens. Aguarde mais novidades em breve.",
            summary_en="This week, the GTA 6 community continues speculating about the expanded Vice City map and new characters. Stay tuned for more.",
            highlights=["Vice City expandida", "Jason & Lucia", "Trailer 2 em breve"],
        )
        await db.weekly_summary.insert_one(to_mongo(summary))
        return summary

    titles = "\n".join([f"- {n.get('title_en','')}" for n in latest_news])
    session_id = f"weekly-{uuid.uuid4().hex[:8]}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message="You synthesize the week's GTA 6 news into a compact briefing. Return JSON only.",
    ).with_model("anthropic", "claude-sonnet-4-6")
    prompt = f"""Based on these headlines:
{titles}

Return ONLY valid JSON:
{{
  "summary_pt": "3-4 sentence weekly recap in Portuguese",
  "summary_en": "3-4 sentence weekly recap in English",
  "highlights": ["3 to 5 short bullet highlights in English"]
}}"""
    try:
        resp = await chat.send_message(UserMessage(text=prompt))
        text = resp.strip()
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        m = re.search(r'\{.*\}', text, re.DOTALL)
        if m:
            text = m.group(0)
        data = json.loads(text)
        summary = WeeklySummary(
            summary_pt=data["summary_pt"],
            summary_en=data["summary_en"],
            highlights=data.get("highlights", []),
        )
        await db.weekly_summary.insert_one(to_mongo(summary))
        return summary
    except Exception as e:
        logger.warning(f"Weekly summary AI failed: {e}")
        summary = WeeklySummary(
            summary_pt="Resumo semanal indisponível no momento.",
            summary_en="Weekly summary not available right now.",
            highlights=[],
        )
        return summary


@api_router.post("/weekly-summary/refresh", response_model=WeeklySummary)
async def refresh_weekly_summary():
    await db.weekly_summary.delete_many({})
    return await get_weekly_summary()


@api_router.get("/stats")
async def stats():
    news = await db.news.count_documents({})
    comments = await db.comments.count_documents({})
    subs = await db.newsletter.count_documents({})
    return {"news": news, "comments": comments, "subscribers": subs}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

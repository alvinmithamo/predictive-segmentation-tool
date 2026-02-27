"""
Auth endpoint tests.
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

# Use SQLite for isolated tests (no real DB needed)
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_teardown():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


# ─── Register ─────────────────────────────────────────────────────────────────

def test_register_success():
    res = client.post("/auth/register", json={
        "email": "owner@sme.ke",
        "password": "secure1234",
        "business_name": "Mama Mboga Superstore",
        "business_type": "retail",
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "owner@sme.ke"
    assert data["user"]["business_name"] == "Mama Mboga Superstore"


def test_register_duplicate_email():
    payload = {
        "email": "duplicate@sme.ke",
        "password": "secure1234",
        "business_name": "Test Shop",
    }
    client.post("/auth/register", json=payload)
    res = client.post("/auth/register", json=payload)
    assert res.status_code == 409


def test_register_weak_password():
    res = client.post("/auth/register", json={
        "email": "new@sme.ke",
        "password": "short",  # < 8 chars
        "business_name": "Test Shop",
    })
    assert res.status_code == 422  # Pydantic validation error


# ─── Login ────────────────────────────────────────────────────────────────────

def test_login_success():
    client.post("/auth/register", json={
        "email": "login@sme.ke",
        "password": "password123",
        "business_name": "Karibu Shop",
    })
    res = client.post("/auth/login", json={
        "email": "login@sme.ke",
        "password": "password123",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password():
    client.post("/auth/register", json={
        "email": "wrong@sme.ke",
        "password": "correctpass",
        "business_name": "Test",
    })
    res = client.post("/auth/login", json={
        "email": "wrong@sme.ke",
        "password": "wrongpass",
    })
    assert res.status_code == 401


# ─── Protected Route (/me) ────────────────────────────────────────────────────

def test_get_me():
    reg = client.post("/auth/register", json={
        "email": "me@sme.ke",
        "password": "password123",
        "business_name": "My Shop",
    })
    token = reg.json()["access_token"]
    res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "me@sme.ke"


def test_get_me_no_token():
    res = client.get("/auth/me")
    assert res.status_code == 403

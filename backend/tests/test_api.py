import pytest
import sys
from pathlib import Path
from django.core.management import call_command
from rest_framework.test import APIClient

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

@pytest.fixture(autouse=True)
def setup_careers_db(db):
    """Seed the test database with career roles before running API tests."""
    call_command('load_careers')

@pytest.mark.django_db
def test_full_auth_and_profile_flow():
    client = APIClient()

    # 1. Register User
    reg_payload = {
        "username": "testdeveloper",
        "email": "dev@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "first_name": "Test",
        "last_name": "Developer"
    }
    reg_res = client.post("/api/auth/register", reg_payload, format="json")
    assert reg_res.status_code == 201, reg_res.data
    assert "access" in reg_res.data
    assert "refresh" in reg_res.data
    access_token = reg_res.data["access"]
    refresh_token = reg_res.data["refresh"]

    # 2. Login User
    login_payload = {
        "username": "testdeveloper",
        "password": "Password123!"
    }
    login_res = client.post("/api/auth/login", login_payload, format="json")
    assert login_res.status_code == 200
    assert "access" in login_res.data
    assert login_res.data["user"]["email"] == "dev@example.com"

    # 3. Refresh Token
    refresh_res = client.post("/api/auth/refresh", {"refresh": refresh_token}, format="json")
    assert refresh_res.status_code == 200
    assert "access" in refresh_res.data

    # 4. Auth Me
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    me_res = client.get("/api/auth/me")
    assert me_res.status_code == 200
    assert me_res.data["user"]["username"] == "testdeveloper"

    # 5. GET Profile
    prof_res = client.get("/api/profile")
    assert prof_res.status_code == 200

    # 6. PUT Profile
    profile_update = {
        "education_level": "Bachelor's Degree",
        "education_field": "Computer Science",
        "education_institution": "Tech University",
        "education_year": 2024,
        "skills": ["Python", "Machine Learning", "Django", "SQL"],
        "interests": ["Artificial Intelligence", "Web Architecture"],
        "experience_years": 2.5,
        "experience_text": "Built data pipelines and web backend services.",
        "projects": [
            {
                "title": "Smart Career Classifier",
                "description": "ML recommendation platform using scikit-learn and Django.",
                "tech": "Python, Django, Scikit-learn, React"
            }
        ]
    }
    put_res = client.put("/api/profile", profile_update, format="json")
    assert put_res.status_code == 200
    assert put_res.data["education_field"] == "Computer Science"
    assert "Machine Learning" in put_res.data["skills"]

    # 7. POST /api/recommend with saved profile (no payload)
    rec_res = client.post("/api/recommend", {}, format="json")
    assert rec_res.status_code == 200
    recs = rec_res.data["recommendations"]
    assert len(recs) == 5
    top_role = recs[0]["role"]
    assert any(expected in top_role for expected in ["AI/ML", "ML", "Python", "Django", "Data"])

    # 8. GET /api/recommendations/history
    hist_res = client.get("/api/recommendations/history")
    assert hist_res.status_code == 200
    assert len(hist_res.data["results"]) >= 1

    # 9. GET /api/roles
    roles_res = client.get("/api/roles")
    assert roles_res.status_code == 200
    assert roles_res.data["count"] >= 25

    # 10. GET /api/roles/<id>
    first_role_id = roles_res.data["results"][0]["id"]
    role_detail_res = client.get(f"/api/roles/{first_role_id}")
    assert role_detail_res.status_code == 200
    assert "title" in role_detail_res.data

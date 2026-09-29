import pytest
import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from recommender.engine import RecommendationEngine, normalize_text

@pytest.fixture(scope="module")
def engine():
    return RecommendationEngine.get_instance()

def test_text_normalization():
    assert "machine learning" in normalize_text("ml engineer")
    assert "javascript" in normalize_text("js developer")
    assert "react" in normalize_text("reactjs web developer")
    assert "postgresql" in normalize_text("postgres database")

def test_engine_initialization(engine):
    assert engine.is_initialized is True
    assert len(engine.roles_data) >= 25
    assert engine.vectorizer is not None
    assert engine.tfidf_matrix is not None

def test_recommendation_ranking_python_ml(engine):
    user_skills = ["Python", "Machine Learning", "Django", "SQL"]
    recommendations = engine.recommend(
        skills=user_skills,
        interests=["Artificial Intelligence", "Web Development"],
        top_k=5
    )

    assert len(recommendations) == 5
    top_role_names = [r['role'] for r in recommendations]

    # Verify that either AI/ML Engineer, ML Engineer, or Python Developer is ranked at the top (#1 or #2)
    top_two = top_role_names[:2]
    expected_top_roles = {"AI/ML Engineer", "ML Engineer", "Python Developer", "Django Developer", "Data Scientist"}
    assert any(role in expected_top_roles for role in top_two), f"Top roles were: {top_role_names}"

    # Verify response schema fields are present
    top_rec = recommendations[0]
    assert "role" in top_rec
    assert "match_percent" in top_rec
    assert isinstance(top_rec["match_percent"], float)
    assert 0 < top_rec["match_percent"] <= 100
    assert "matched_skills" in top_rec
    assert "missing_skills" in top_rec
    assert "skill_scores" in top_rec
    assert "roadmap" in top_rec
    assert "salary_range" in top_rec
    assert "growth_outlook" in top_rec

def test_skill_gap_and_roadmap(engine):
    user_skills = ["Python", "SQL"]
    recommendations = engine.recommend(skills=user_skills, top_k=3)
    for rec in recommendations:
        # Check matched skills contains at least one of the user skills if relevant
        matched = rec["matched_skills"]
        missing = rec["missing_skills"]
        roadmap = rec["roadmap"]

        # Ensure no intersection between missing and matched
        assert set(matched).isdisjoint(set(missing))

        # Check roadmap format
        assert isinstance(roadmap, list)
        if roadmap:
            first_step = roadmap[0]
            assert "phase" in first_step
            assert "skill" in first_step
            assert "estimated_weeks" in first_step
            assert "objective" in first_step
            assert "resources" in first_step

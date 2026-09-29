import os
import re
import csv
import logging
from pathlib import Path
from typing import List, Dict, Any, Tuple
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
CSV_PATH = DATA_DIR / 'careers.csv'
CACHE_DIR = BASE_DIR / 'recommender' / 'cache'

# Skill synonym dictionary for normalization
SYNONYM_MAP = {
    r'\bml\b': 'machine learning',
    r'\bdl\b': 'deep learning',
    r'\bai\b': 'artificial intelligence',
    r'\bjs\b': 'javascript',
    r'\bts\b': 'typescript',
    r'\bpy\b': 'python',
    r'\bpostgres\b': 'postgresql',
    r'\bk8s\b': 'kubernetes',
    r'\btf\b': 'tensorflow',
    r'\bnlp\b': 'natural language processing',
    r'\bcv\b': 'computer vision',
    r'\bfe\b': 'frontend',
    r'\bbe\b': 'backend',
    r'\bfs\b': 'fullstack',
    r'\breactjs\b': 'react',
    r'\bnodejs\b': 'node.js',
    r'\bvuejs\b': 'vue',
    r'\bnextjs\b': 'next.js',
    r'\bdrf\b': 'django rest framework',
    r'\baws\b': 'amazon web services',
    r'\bgcp\b': 'google cloud platform',
    r'\ba11y\b': 'accessibility',
    r'\brwd\b': 'responsive web design',
}

# Skill learning resource catalogue for detailed roadmap generation
RESOURCE_CATALOG = {
    'python': {'resource': 'Automate the Boring Stuff with Python & Real Python', 'weeks': 2, 'phase': 'Beginner'},
    'machine learning': {'resource': 'Coursera Andrew Ng Machine Learning & Fast.ai', 'weeks': 4, 'phase': 'Intermediate'},
    'deep learning': {'resource': 'DeepLearning.AI Deep Learning Specialization', 'weeks': 5, 'phase': 'Advanced'},
    'tensorflow': {'resource': 'TensorFlow Developer Certificate Course', 'weeks': 3, 'phase': 'Intermediate'},
    'pytorch': {'resource': 'PyTorch for Deep Learning Bootcamp & Official Tutorials', 'weeks': 3, 'phase': 'Intermediate'},
    'scikit-learn': {'resource': 'Hands-On Machine Learning with Scikit-Learn (Geron)', 'weeks': 3, 'phase': 'Intermediate'},
    'django': {'resource': 'Django for Beginners (William Vincent) & Official Docs', 'weeks': 3, 'phase': 'Intermediate'},
    'django rest framework': {'resource': 'Django for APIs by William Vincent', 'weeks': 2, 'phase': 'Intermediate'},
    'sql': {'resource': 'SQLZoo, LeetCode Database 50 & Mode SQL Tutorial', 'weeks': 2, 'phase': 'Beginner'},
    'postgresql': {'resource': 'PostgreSQL Tutorial (postgresqltutorial.com)', 'weeks': 2, 'phase': 'Intermediate'},
    'docker': {'resource': 'Docker Mastery by Bret Fisher on Udemy', 'weeks': 2, 'phase': 'Intermediate'},
    'kubernetes': {'resource': 'Certified Kubernetes Administrator (CKA) by Mumshad Mannambeth', 'weeks': 4, 'phase': 'Advanced'},
    'mlops': {'resource': 'Full Stack Deep Learning & Made With ML (Goku Mohandas)', 'weeks': 4, 'phase': 'Advanced'},
    'javascript': {'resource': 'The Modern JavaScript Tutorial (javascript.info)', 'weeks': 3, 'phase': 'Beginner'},
    'typescript': {'resource': 'Understanding TypeScript by Maximilian Schwarzmuller', 'weeks': 2, 'phase': 'Intermediate'},
    'react': {'resource': 'React Official Docs (react.dev) & Epic React by Kent C. Dodds', 'weeks': 3, 'phase': 'Intermediate'},
    'node.js': {'resource': 'Node.js Developer Course by Andrew Mead', 'weeks': 3, 'phase': 'Intermediate'},
    'aws': {'resource': 'AWS Certified Solutions Architect Associate by Adrian Cantrill', 'weeks': 4, 'phase': 'Intermediate'},
    'linux': {'resource': 'The Linux Command Line by William Shotts', 'weeks': 2, 'phase': 'Beginner'},
    'git': {'resource': 'Pro Git Book (free on git-scm.com)', 'weeks': 1, 'phase': 'Beginner'},
    'tableau': {'resource': 'Tableau Desktop Specialist Certification Course', 'weeks': 2, 'phase': 'Beginner'},
    'power bi': {'resource': 'Microsoft Power BI Data Analyst Professional Certificate', 'weeks': 3, 'phase': 'Beginner'},
    'statistics': {'resource': 'StatQuest with Josh Starmer & Khan Academy Statistics', 'weeks': 3, 'phase': 'Beginner'},
    'nlp': {'resource': 'Hugging Face NLP Course & Stanford CS224N', 'weeks': 4, 'phase': 'Advanced'},
    'computer vision': {'resource': 'CS231N Stanford & PyImageSearch', 'weeks': 4, 'phase': 'Advanced'},
    'solidity': {'resource': 'CryptoZombies & Patrick Collins 32-hour Web3 Bootcamp', 'weeks': 4, 'phase': 'Intermediate'},
    'system design': {'resource': 'Designing Data-Intensive Applications by Martin Kleppmann', 'weeks': 4, 'phase': 'Advanced'},
}


def normalize_text(text: str) -> str:
    """Cleans text, converts to lower case, and expands skill synonyms."""
    if not text:
        return ""
    text = text.lower()
    for pattern, replacement in SYNONYM_MAP.items():
        text = re.sub(pattern, replacement, text)
    # Remove punctuation except plus and slashes for c++, ci/cd, etc.
    text = re.sub(r'[^\w\s\+\/\#\.\-]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def parse_skill_list(skills_val: Any) -> List[str]:
    """Converts a comma-separated string or list into a clean list of individual skills."""
    if isinstance(skills_val, list):
        return [str(s).strip() for s in skills_val if str(s).strip()]
    if isinstance(skills_val, str):
        return [s.strip() for s in skills_val.split(',') if s.strip()]
    return []


class RecommendationEngine:
    _instance = None

    def __init__(self, csv_path: Path = None):
        self.csv_path = csv_path or CSV_PATH
        self.roles_data: List[Dict[str, Any]] = []
        self.vectorizer: TfidfVectorizer = None
        self.tfidf_matrix = None
        self.is_initialized = False
        self._load_or_build_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _get_cache_files(self) -> Tuple[Path, Path, Path]:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        return (
            CACHE_DIR / 'vectorizer.joblib',
            CACHE_DIR / 'tfidf_matrix.joblib',
            CACHE_DIR / 'roles_data.joblib',
        )

    def _load_csv_data(self) -> List[Dict[str, Any]]:
        """Loads career roles from the dataset CSV file."""
        if not self.csv_path.exists():
            # Check fallback in root data/
            root_fallback = BASE_DIR.parent / 'data' / 'careers.csv'
            if root_fallback.exists():
                self.csv_path = root_fallback
            else:
                raise FileNotFoundError(f"Careers dataset not found at {self.csv_path}")

        records = []
        with open(self.csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append({
                    'role': row['role'].strip(),
                    'description': row['description'].strip(),
                    'required_skills': parse_skill_list(row['required_skills']),
                    'nice_to_have_skills': parse_skill_list(row.get('nice_to_have_skills', '')),
                    'avg_salary_range': row.get('avg_salary_range', '₹10 - ₹22 LPA').strip(),
                    'growth_outlook': row.get('growth_outlook', '+25%').strip(),
                    'learning_resources': [r.strip() for r in row.get('learning_resources', '').split(',') if r.strip()],
                })
        return records

    def _build_role_document(self, role_dict: Dict[str, Any]) -> str:
        """
        Builds a weighted text document for a career role.
        Required skills are weighted 3x, nice-to-have 1.5x, role title 2x.
        """
        title = role_dict['role']
        desc = role_dict['description']
        req_skills = " ".join(role_dict['required_skills'])
        nice_skills = " ".join(role_dict['nice_to_have_skills'])

        # Weighting through repetition in the TF-IDF corpus
        weighted_doc = (
            f"{title} {title} "
            f"{req_skills} {req_skills} {req_skills} "
            f"{nice_skills} {nice_skills} "
            f"{desc}"
        )
        return normalize_text(weighted_doc)

    def _load_or_build_models(self):
        """Loads cached models or fits the TF-IDF matrix and caches with joblib."""
        vec_file, mat_file, roles_file = self._get_cache_files()

        # Check if cache exists and is fresh relative to CSV
        csv_mtime = self.csv_path.stat().st_mtime if self.csv_path.exists() else 0
        cache_valid = (
            vec_file.exists() and mat_file.exists() and roles_file.exists() and
            vec_file.stat().st_mtime > csv_mtime
        )

        if cache_valid:
            try:
                self.vectorizer = joblib.load(vec_file)
                self.tfidf_matrix = joblib.load(mat_file)
                self.roles_data = joblib.load(roles_file)
                self.is_initialized = True
                logger.info("Successfully loaded fitted TF-IDF models from cache.")
                return
            except Exception as e:
                logger.warning(f"Failed to load cache, rebuilding models: {e}")

        # Build models from scratch
        self.roles_data = self._load_csv_data()
        documents = [self._build_role_document(r) for r in self.roles_data]

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            min_df=1,
            max_df=0.95,
            sublinear_tf=True
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(documents)

        # Cache with joblib
        try:
            joblib.dump(self.vectorizer, vec_file)
            joblib.dump(self.tfidf_matrix, mat_file)
            joblib.dump(self.roles_data, roles_file)
            logger.info("Cached newly fitted TF-IDF models with joblib.")
        except Exception as e:
            logger.warning(f"Could not persist cache to disk: {e}")

        self.is_initialized = True

    def build_user_query(
        self,
        skills: List[str] = None,
        interests: List[str] = None,
        projects: List[Dict[str, Any]] = None,
        experience_text: str = "",
        experience_years: float = 0.0,
        education_field: str = ""
    ) -> str:
        """Combines user profile attributes into a weighted query string."""
        skills = skills or []
        interests = interests or []
        projects = projects or []

        # Skills are the most critical signal: weight 3x
        skills_str = " ".join(skills)
        weighted_skills = f"{skills_str} {skills_str} {skills_str}"

        # Interests: weight 1.5x
        interests_str = " ".join(interests)

        # Projects tech stack and descriptions
        project_parts = []
        for p in projects:
            if isinstance(p, dict):
                t = p.get('title', '')
                d = p.get('description', '')
                tech = p.get('tech', '') or p.get('tech_stack', '')
                project_parts.append(f"{t} {d} {tech} {tech}")
        projects_str = " ".join(project_parts)

        query = f"{weighted_skills} {interests_str} {projects_str} {experience_text} {education_field}"
        return normalize_text(query)

    def analyze_skill_gap(
        self,
        user_skills: List[str],
        role: Dict[str, Any]
    ) -> Tuple[List[str], List[str], Dict[str, float]]:
        """
        Performs skill-gap analysis.
        Returns:
            - matched_skills: list of matched required or nice-to-have skills
            - missing_skills: list of required skills the user lacks
            - skill_scores: map of role skill to coverage score (1.0 or 0.0)
        """
        norm_user_skills = set(normalize_text(s) for s in user_skills if s)
        matched_skills = []
        missing_skills = []
        skill_scores: Dict[str, float] = {}

        # Check required skills
        for req in role['required_skills']:
            norm_req = normalize_text(req)
            # Exact or substring containment match
            is_matched = any(
                norm_req == u or norm_req in u or u in norm_req
                for u in norm_user_skills
            )
            if is_matched:
                matched_skills.append(req)
                skill_scores[req] = 1.0
            else:
                missing_skills.append(req)
                skill_scores[req] = 0.0

        # Check nice-to-have skills
        for nth in role.get('nice_to_have_skills', []):
            norm_nth = normalize_text(nth)
            is_matched = any(
                norm_nth == u or norm_nth in u or u in norm_nth
                for u in norm_user_skills
            )
            if is_matched:
                if nth not in matched_skills:
                    matched_skills.append(nth)
                skill_scores[nth] = 1.0
            else:
                skill_scores[nth] = 0.0

        return matched_skills, missing_skills, skill_scores

    def generate_roadmap(
        self,
        missing_skills: List[str],
        role_resources: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Produces an ordered, phase-by-phase learning roadmap for missing skills.
        Phases: Beginner -> Intermediate -> Advanced.
        """
        if not missing_skills:
            return [{
                'step_number': 1,
                'phase': 'Advanced',
                'skill': 'Specialized Mastery & Portfolio Projects',
                'estimated_weeks': 4,
                'objective': 'Build end-to-end production capstone projects and prepare for technical interviews.',
                'resources': role_resources[:2] if role_resources else ['LeetCode', 'System Design Primer']
            }]

        roadmap = []
        phase_priority = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3}
        step_items = []

        for skill in missing_skills:
            norm_skill = normalize_text(skill)
            # Lookup in catalog or default
            catalog_match = None
            for key, val in RESOURCE_CATALOG.items():
                if key in norm_skill or norm_skill in key:
                    catalog_match = val
                    break

            if catalog_match:
                phase = catalog_match['phase']
                weeks = catalog_match['weeks']
                res = [catalog_match['resource']]
            else:
                phase = 'Intermediate'
                weeks = 3
                res = [f"Official {skill} Documentation & Hands-on Tutorials"]

            step_items.append({
                'skill': skill,
                'phase': phase,
                'priority': phase_priority.get(phase, 2),
                'estimated_weeks': weeks,
                'objective': f"Master {skill} core concepts, syntax, patterns, and hands-on integration.",
                'resources': res
            })

        # Sort by phase priority (Beginner -> Intermediate -> Advanced)
        step_items.sort(key=lambda x: x['priority'])

        for idx, item in enumerate(step_items, start=1):
            roadmap.append({
                'step_number': idx,
                'phase': item['phase'],
                'skill': item['skill'],
                'estimated_weeks': item['estimated_weeks'],
                'objective': item['objective'],
                'resources': item['resources']
            })

        return roadmap

    def recommend(
        self,
        skills: List[str] = None,
        interests: List[str] = None,
        projects: List[Dict[str, Any]] = None,
        experience_text: str = "",
        experience_years: float = 0.0,
        education_field: str = "",
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Computes cosine similarity ranking and returns top_k recommendations
        with exact match percentage, skill gap analysis, and personalized roadmaps.
        """
        if not self.is_initialized:
            self._load_or_build_models()

        skills = skills or []
        query_text = self.build_user_query(
            skills=skills,
            interests=interests,
            projects=projects,
            experience_text=experience_text,
            experience_years=experience_years,
            education_field=education_field
        )

        if not query_text:
            query_text = "software engineering python programming"

        query_vec = self.vectorizer.transform([query_text])
        cos_sims = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        recommendations = []
        for idx, role in enumerate(self.roles_data):
            tfidf_score = float(cos_sims[idx])

            # Perform skill-gap analysis
            matched_skills, missing_skills, skill_scores = self.analyze_skill_gap(skills, role)

            # Direct skill coverage ratio for required skills
            total_req = len(role['required_skills'])
            matched_req = len([s for s in role['required_skills'] if s in matched_skills])
            skill_ratio = (matched_req / total_req) if total_req > 0 else 0.5

            # Weighted combination of TF-IDF similarity and direct skill overlap
            # 55% TF-IDF cosine similarity, 45% skill ratio
            raw_score = (0.55 * tfidf_score) + (0.45 * skill_ratio)

            # Non-linear scaling to give realistic percentage in [12.0%, 98.5%]
            match_percent = round(min(98.5, max(12.0, (raw_score * 115.0))), 1)

            # Generate learning roadmap for missing skills
            roadmap = self.generate_roadmap(missing_skills, role.get('learning_resources', []))

            recommendations.append({
                'role': role['role'],
                'description': role['description'],
                'match_percent': match_percent,
                'raw_cosine_score': round(tfidf_score, 4),
                'matched_skills': matched_skills,
                'missing_skills': missing_skills,
                'skill_scores': skill_scores,
                'roadmap': roadmap,
                'salary_range': role['avg_salary_range'],
                'growth_outlook': role['growth_outlook'],
                'learning_resources': role.get('learning_resources', []),
            })

        # Rank by match_percent descending
        recommendations.sort(key=lambda x: x['match_percent'], reverse=True)
        return recommendations[:top_k]

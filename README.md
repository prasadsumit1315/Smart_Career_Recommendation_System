# AI-Powered Smart Career Recommendation System

An enterprise-grade, full-stack AI career recommendation platform featuring an interactive 3D animated user interface and a mathematically rigorous machine learning recommendation engine.

---

## 🚀 Interview Explanation (Elevator Pitch)
> "I built an AI-Powered Smart Career Recommendation System featuring a Django REST Framework and Scikit-Learn backend coupled with an interactive React 18 and Three.js frontend. The core recommendation engine vectorizes candidate profiles across skills, interests, and projects using sublinear TF-IDF with (1,2) n-grams, scoring candidates against 27+ weighted industry roles via cosine similarity. Beyond ranking, the platform performs dynamic skill-gap diagnostics, synthesizes phase-based learning roadmaps, and formats ATS-compliant resumes with real-time PDF export. The interface delivers a futuristic dark aesthetic with particle neural constellations, 3D match rings, and GSAP ScrollTrigger animations."

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  React 18 + Vite | Three.js (R3F + Drei) | Framer Motion | GSAP ScrollTrigger     |
+----------------------------------------+------------------------------------------+
                                         |
                                         | REST API (JWT Bearer / Axios Interceptor)
                                         v
+-----------------------------------------------------------------------------------+
|                             DJANGO REST FRAMEWORK                                 |
|  /api/auth/        -> Register, Login, Refresh, Me (SimpleJWT)                    |
|  /api/profile      -> Academic, Skills, Interests, Experience, Projects           |
|  /api/recommend    -> Real-Time ML Similarity Inference & History Archival        |
|  /api/roles        -> 27+ Verified Career Taxonomies & Salary Benchmarks          |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           SCIKIT-LEARN ML ENGINE                                  |
|  1. Text Normalization: Regex synonym expansion ('ml' -> 'machine learning', etc.)|
|  2. TF-IDF Vectorizer: (1, 2) n-grams, sublinear TF, 3x required skill weights    |
|  3. Cosine Similarity: Math dot-product in high-dimensional vector space          |
|  4. Skill-Gap Matrix: Set difference of target vs candidate skills                |
|  5. Roadmap Engine: Ordered milestone synthesis (Beginner -> Advanced)           |
|  6. Joblib Caching: Pre-warmed model persistence for sub-10ms response times      |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             DATABASE & PERSISTENCE                                |
|  Development: SQLite3 | Production: PostgreSQL 16 (Configurable via .env)         |
+-----------------------------------------------------------------------------------+
```

---

## 🧠 Machine Learning Engine: Mathematical Foundation

### 1. Term Frequency - Inverse Document Frequency (TF-IDF)
For any term $t$ in a role document $d$ within career role corpus $D$:

$$\text{TF}(t, d) = 1 + \ln(\text{count}(t, d)) \quad \text{for } \text{count}(t, d) > 0$$

$$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

* **Weighting Policy**: Required competencies receive $3\times$ frequency weighting, titles receive $2\times$ weighting, and secondary skills receive $1.5\times$ weighting.

### 2. Cosine Similarity
Given the normalized query vector $\vec{q}$ representing candidate attributes and the target career vector $\vec{d}_i$:

$$\text{Cosine Similarity}(\vec{q}, \vec{d}_i) = \frac{\vec{q} \cdot \vec{d}_i}{\|\vec{q}\|_2 \|\vec{d}_i\|_2} = \frac{\sum_{k=1}^n q_k \cdot d_{i,k}}{\sqrt{\sum_{k=1}^n q_k^2} \sqrt{\sum_{k=1}^n d_{i,k}^2}}$$

### 3. Integrated Match Percentage Formula
To provide an intuitive, mathematically grounded percentage that reflects both vector similarity and direct skill overlap:

$$\text{SkillRatio} = \frac{|\text{UserSkills} \cap \text{RequiredSkills}|}{|\text{RequiredSkills}|}$$

$$\text{RawScore} = 0.55 \times \text{Cosine Similarity}(\vec{q}, \vec{d}_i) + 0.45 \times \text{SkillRatio}$$

$$\text{MatchPercent} = \min\left(98.5, \max\left(12.0, \text{round}(\text{RawScore} \times 115.0, 1)\right)\right)$$

*Scores are strictly computed dynamically and never hardcoded.*

---

## 📦 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.12+, Django 5/6, Django REST Framework, SimpleJWT, django-cors-headers, python-decouple |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib, Pytest, Pytest-Django |
| **Frontend** | React 18, Vite, React Router v6, Axios, Bootstrap 5, Recharts |
| **3D & Animation** | Three.js, @react-three/fiber, @react-three/drei, Framer Motion, GSAP (ScrollTrigger) |
| **Database** | SQLite (development default) / PostgreSQL 16 ready via Docker or `.env` |
| **Containerization** | Dockerfile, docker-compose.yml, Nginx reverse proxy |

---

## 🛠️ Local Setup Guide

### Prerequisites
- Python 3.11+ (Python 3.12 recommended)
- Node.js v18+ and npm v9+
- Git

### 1. Clone Repository & Environment Setup
```bash
git clone https://github.com/your-username/Smart_Career_Recommendation_System.git
cd Smart_Career_Recommendation_System
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
python backend/manage.py migrate

# Seed 27+ career roles and build ML cache
python backend/manage.py load_careers

# Run backend unit tests
python -m pytest backend/tests/ -v

# Start Django development server
python backend/manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🐳 Optional Docker Run Path
Run the entire production stack (PostgreSQL + Django API + React Nginx) with a single command:
```bash
docker-compose up --build
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api`
- PostgreSQL: Port `5432`

---

## 📡 API Reference Table

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Creates user, generates profile, and returns JWT tokens |
| `POST` | `/api/auth/login` | No | Validates credentials and returns JWT access + refresh pair |
| `POST` | `/api/auth/refresh` | No | Refreshes expired access tokens using valid refresh token |
| `GET` | `/api/auth/me` | Yes (Bearer) | Returns authenticated user details and profile state |
| `GET` | `/api/profile` | Yes (Bearer) | Fetches current user profile (academic, skills, projects) |
| `PUT` | `/api/profile` | Yes (Bearer) | Updates profile attributes |
| `POST` | `/api/recommend` | Optional | Computes top 5 matches using payload or saved profile |
| `GET` | `/api/recommendations/history` | Yes (Bearer) | Returns chronological archive of past recommendation runs |
| `GET` | `/api/roles` | No | Lists all 27+ roles with search and pagination support |
| `GET` | `/api/roles/<id>` | No | Retrieves detailed view of single career role |

---

## 🎨 UI & 3D Feature Highlights
1. **Interactive 3D Constellation Hero**: Real-time particle synapse network reacting to mouse coordinates (parallax), accompanied by orbiting skill satellites.
2. **GSAP 5-Step Pipeline Reveal**: Smooth viewport-triggered staggered cards illustrating the ML pipeline.
3. **Analyzing Screen**: 3D data convergence core where particle streams collapse inward while model inference resolves.
4. **Interactive 3D Tilt Cards**: Framer Motion 3D perspective tilt on hover with dynamic glare.
5. **3D Torus Match Rings**: R3F multi-arc visualization scaling arc lengths to cosine similarity scores.
6. **Competency Radar Chart**: Multidimensional skill coverage assessment via Recharts.
7. **ATS-Optimized Resume Studio**: Role-tailored resume generation with one-click print/PDF styling.

---

## 🔮 Future Enhancements
- **LLM Synthesis (LangChain / Llama-3)**: Dynamic generation of personalized cover letters and narrative interview guides.
- **Automated Resume Parsing (spaCy / PyPDF)**: Extracting skills directly from uploaded PDF resumes.
- **Live Job Board Integration**: Real-time matching against LinkedIn / Indeed API postings.
- **Skill Proficiency Verification**: Interactive coding challenges to validate candidate claims.
#   S m a r t _ C a r e e r _ R e c o m m e n d a t i o n _ S y s t e m  
 #   S m a r t _ C a r e e r _ R e c o m m e n d a t i o n _ S y s t e m  
 
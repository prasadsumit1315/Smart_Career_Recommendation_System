# 🚀 AI-Powered Smart Career Recommendation System

**An intelligent, full-stack career guidance platform powered by Machine Learning, personalized skill-gap analysis, and interactive 3D visualization.**

Transform your skills, interests, academic background, and projects into personalized career recommendations with actionable learning roadmaps and ATS-friendly resume generation.

---

## 🌟 Project Highlights

| Feature | Description |
|---|---|
| 🤖 AI Career Matching | Recommends suitable careers using TF-IDF and cosine similarity |
| 🎯 Skill-Gap Analysis | Identifies missing skills for target career roles |
| 🗺️ Learning Roadmaps | Generates structured learning milestones from beginner to advanced |
| 📄 Resume Studio | Creates role-tailored, ATS-friendly resumes with PDF export |
| 📊 Career Analytics | Visualizes skill coverage and career compatibility |
| 🔐 Secure Authentication | JWT-based registration, login, and token refresh |
| 🧊 Interactive 3D UI | Particle constellations, animated match rings, and 3D cards |
| 📚 Career Database | Supports 27+ career roles and associated skill requirements |

---

## 🎤 Interview Explanation — Elevator Pitch

> I developed an AI-Powered Smart Career Recommendation System using Django REST Framework, Scikit-Learn, React 18, and Three.js. The system analyzes candidate profiles using weighted TF-IDF vectorization with unigram and bigram features, then applies cosine similarity and direct skill-overlap scoring to rank suitable career paths across 27+ industry roles.
>
> Beyond recommendations, it identifies skill gaps, generates phase-based learning roadmaps, maintains recommendation history, and provides ATS-friendly resume generation with PDF export. The frontend features an immersive dark interface with interactive 3D visualizations, animated particle networks, and GSAP-powered transitions.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                                                              │
│  React 18 • Vite • React Router • Axios • Bootstrap 5        │
│  Three.js • React Three Fiber • Drei • Framer Motion         │
│  GSAP ScrollTrigger • Recharts                               │
└────────────────────────────┬─────────────────────────────────┘
                             │
                   REST API • JWT Bearer
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    DJANGO REST API                           │
│                                                              │
│  Authentication & JWT       Candidate Profile Management     │
│  Career Recommendations     Career Roles & Search            │
│  Recommendation History     Profile & Resume Data            │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                  MACHINE LEARNING ENGINE                     │
│                                                              │
│  1. Text Normalization & Synonym Expansion                   │
│  2. Weighted TF-IDF Vectorization                            │
│  3. Cosine Similarity Computation                             │
│  4. Weighted Career Match Scoring                             │
│  5. Skill-Gap Identification                                  │
│  6. Personalized Learning Roadmap Generation                  │
│  7. Joblib Model Persistence & Caching                        │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                   DATA & PERSISTENCE                         │
│                                                              │
│  SQLite (Development) • PostgreSQL 16 (Production)           │
│  Django ORM • Career Taxonomy • User Profiles • History      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧠 Machine Learning Engine

The recommendation engine evaluates candidate profiles against available career-role descriptions using text vectorization, similarity scoring, and explicit skill matching.

### 1. TF-IDF Vectorization

Term Frequency–Inverse Document Frequency assigns importance to terms based on their frequency within a document and their distribution across the career corpus.

**Sublinear term frequency:**

\[
TF(t,d)=
\begin{cases}
1+\ln(count(t,d)), & count(t,d)>0\\
0, & \text{otherwise}
\end{cases}
\]

**Inverse document frequency:**

\[
IDF(t,D)=
\ln\left(\frac{1+|D|}{1+df(t)}\right)+1
\]

Where \(df(t)\) represents the number of career documents containing term \(t\).

**TF-IDF weight:**

\[
TFIDF(t,d,D)=TF(t,d)\times IDF(t,D)
\]

**Feature engineering and weighting:**

- **3×:** Required competencies
- **2×:** Career titles
- **1.5×:** Secondary skills
- **N-grams:** Unigrams and bigrams using `(1, 2)`
- **Sublinear TF:** Reduces the influence of repeated terms
- **Synonym normalization:** Maps variations such as `ML` to `machine learning`

*These multipliers describe the intended weighting policy; actual implementation should apply them explicitly to the corresponding feature groups.*

### 2. Cosine Similarity

Cosine similarity measures the directional similarity between a candidate profile vector and a career-role vector.

\[
\operatorname{CosSim}(q,d_i)=
\frac{q\cdot d_i}{\|q\|_2\|d_i\|_2}
\]

Where:

- \(q\) represents the candidate profile.
- \(d_i\) represents a target career role.
- \(q\cdot d_i\) is the dot product of the vectors.
- The denominator normalizes the vectors by their magnitudes.

Higher similarity indicates stronger alignment between the candidate's profile and the career description.

### 3. Skill-Overlap Ratio

The skill-overlap ratio measures how many required skills a candidate possesses.

\[
SkillRatio=
\frac{|UserSkills\cap RequiredSkills|}
{|RequiredSkills|}
\]

If a role requires 10 skills and the candidate has 7 of them, the skill-overlap ratio is \(0.70\), or 70%.

### 4. Integrated Career Match Score

The proposed scoring model combines semantic similarity and direct skill coverage.

\[
RawScore=0.55(CosSim)+0.45(SkillRatio)
\]

The displayed percentage is calculated using:

\[
MatchPercent=
\min\left(98.5,\max\left(12.0,
round(RawScore\times115,1)\right)\right)
\]

The result is bounded between 12.0% and 98.5%.

**Important:** These percentages are model-generated compatibility scores, not statistically calibrated probabilities of getting hired. The implementation should also handle empty skill lists and zero-length vectors safely.

---

## 🛠️ Technology Stack

### Backend & API

- Python 3.12+
- Django 5/6
- Django REST Framework
- SimpleJWT
- django-cors-headers
- python-decouple

### Machine Learning & Data Processing

- Scikit-Learn
- NumPy
- Pandas
- Joblib
- Pytest
- Pytest-Django

### Frontend Development

- React 18
- Vite
- React Router v6
- Axios
- Bootstrap 5
- Recharts

### 3D Graphics & Animation

- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion
- GSAP ScrollTrigger

### Database & Deployment

- SQLite
- PostgreSQL 16
- Docker
- Docker Compose
- Nginx
- Environment-based configuration

---

## 🎨 UI/UX & 3D Experience

The interface combines a futuristic dark theme with interactive visualizations and smooth motion design.

### ✨ Core Visual Features

**1. Interactive 3D Constellation Hero**

A particle-based neural network with mouse-responsive parallax effects and orbiting skill indicators.

**2. Animated Machine Learning Pipeline**

A five-step visual sequence that introduces the profile analysis and career recommendation workflow using GSAP ScrollTrigger.

**3. AI Analysis Screen**

A dynamic visual experience featuring particle streams converging around a central analysis element while recommendations are processed.

**4. Interactive 3D Career Cards**

Perspective tilt, hover effects, and dynamic glare powered by Framer Motion.

**5. 3D Career Match Rings**

Animated torus-style indicators that represent career compatibility scores.

**6. Competency Radar Chart**

A multidimensional view of skill coverage and competency gaps using Recharts.

**7. ATS-Friendly Resume Studio**

Role-specific resume formatting with browser-based printing and PDF export.

---

## 📡 REST API Reference

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user and initialize their profile |
| POST | `/api/auth/login` | Authenticate and return JWT tokens |
| POST | `/api/auth/refresh` | Refresh an access token |
| GET | `/api/auth/me` | Retrieve the authenticated user's details |

### Candidate Profile

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/profile` | Retrieve the candidate profile |
| PUT | `/api/profile` | Update academic details, skills, interests, and projects |

### Career Recommendations

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/recommend` | Calculate and return top career matches |
| GET | `/api/recommendations/history` | Retrieve previous recommendation runs |

### Career Roles

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/roles` | List, search, and paginate career roles |
| GET | `/api/roles/<id>` | Retrieve details for a specific role |

**Authentication:** Endpoints marked as protected should receive a valid access token through the `Authorization: Bearer <access_token>` header. Recommendation requests may be public or authenticated, depending on the configured API permissions.

---

## ⚙️ Installation & Local Setup

### Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- npm 9 or newer
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/Smart_Career_Recommendation_System.git

cd Smart_Career_Recommendation_System
```

Replace `your-username` with the actual GitHub username or organization.

### Step 2: Set Up the Backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Or on Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Apply database migrations:

```bash
python backend/manage.py migrate
```

Load career-role data and initialize the ML cache:

```bash
python backend/manage.py load_careers
```

Run backend tests:

```bash
python -m pytest backend/tests/ -v
```

Start the Django development server:

```bash
python backend/manage.py runserver 127.0.0.1:8000
```

### Step 3: Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local application:

**Frontend:** http://localhost:5173

**Backend API:** http://127.0.0.1:8000/api/

### Step 4: Run with Docker (Optional)

If the Dockerfile and Compose configuration are complete and correctly configured:

```bash
docker-compose up --build
```

Expected service endpoints:

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api`
- PostgreSQL: `localhost:5432`

Actual ports and startup behavior depend on your Compose configuration.

---

## 🗄️ Database & Persistence

The application supports different database configurations for development and deployment.

| Environment | Database | Purpose |
|---|---|---|
| Development | SQLite | Simple local setup |
| Production | PostgreSQL 16 | Production-oriented relational storage |

Configuration can be managed through environment variables and a `.env` file.

Typical configuration variables include:

```dotenv
DEBUG=True
SECRET_KEY=replace-with-a-secure-secret
DATABASE_URL=sqlite:///db.sqlite3
```

Use a production database URL when deploying to PostgreSQL. Never commit real secrets, production credentials, or private environment files to GitHub.

---

## 🔮 Future Enhancements

### 🤖 Generative AI Integration

Integrate an LLM through LangChain or a compatible model to generate personalized cover letters, career explanations, and interview preparation guides.

### 📄 Automated Resume Parsing

Use spaCy and PyPDF to extract education, experience, projects, and skills from uploaded resumes.

### 💼 Live Job-Market Integration

Match candidate profiles with current job listings through permitted job-board APIs and supported data sources.

### 🧪 Skill-Proficiency Verification

Introduce coding assessments, quizzes, and practical tasks to evaluate skill proficiency beyond self-reported information.

### 📈 Recommendation Quality Evaluation

Build a labeled evaluation dataset and measure ranking quality using metrics such as Precision@K, Recall@K, and NDCG@K.

### ☁️ Cloud Deployment & Monitoring

Add CI/CD, structured logging, model-version tracking, API monitoring, and production deployment workflows.

---

## 📈 Project Impact

The platform is designed to help users:

- Discover career paths aligned with their skills and interests.
- Understand which competencies they need to improve.
- Follow structured learning plans toward their target roles.
- Compare multiple career options using consistent scoring.
- Prepare role-specific resumes more efficiently.

---

## 👨‍💻 Project Summary

**Project:** AI-Powered Smart Career Recommendation System

**Category:** Full-Stack Development • Machine Learning • Career Intelligence

**Backend:** Python, Django REST Framework

**ML Engine:** Scikit-Learn, TF-IDF, Cosine Similarity

**Frontend:** React 18, Three.js, Framer Motion, GSAP

**Database:** SQLite / PostgreSQL

**Deployment:** Docker, Docker Compose, Nginx

**Primary Goal:** Deliver personalized, explainable, and actionable career recommendations through an interactive web platform.

---

## ⭐ Support & Contribution

If you find this project useful, consider giving the repository a star ⭐ and contributing ideas that improve its functionality, accessibility, and recommendation quality.

**Built with Python, React, Machine Learning, and a passion for creating smarter career experiences.**

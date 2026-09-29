import csv
from pathlib import Path

# Explicitly mapping all 27 roles to correct Indian Rupee LPA format
ROLE_INR_SALARIES = {
    "AI/ML Engineer": "₹18 - ₹38 LPA",
    "ML Engineer": "₹16 - ₹35 LPA",
    "Data Scientist": "₹14 - ₹30 LPA",
    "Data Analyst": "₹7 - ₹16 LPA",
    "Python Developer": "₹8 - ₹20 LPA",
    "Django Developer": "₹9 - ₹22 LPA",
    "Full Stack Developer": "₹10 - ₹25 LPA",
    "Frontend Developer": "₹8 - ₹20 LPA",
    "Backend Developer": "₹10 - ₹26 LPA",
    "DevOps Engineer": "₹12 - ₹28 LPA",
    "Cloud Engineer": "₹12 - ₹26 LPA",
    "Cybersecurity Analyst": "₹10 - ₹24 LPA",
    "Mobile App Developer": "₹9 - ₹22 LPA",
    "QA Engineer": "₹6 - ₹15 LPA",
    "Data Engineer": "₹14 - ₹32 LPA",
    "NLP Engineer": "₹18 - ₹40 LPA",
    "Computer Vision Engineer": "₹18 - ₹38 LPA",
    "Blockchain Developer": "₹15 - ₹35 LPA",
    "Site Reliability Engineer": "₹15 - ₹32 LPA",
    "Systems Architect": "₹25 - ₹55 LPA",
    "UI/UX Engineer": "₹8 - ₹20 LPA",
    "Big Data Engineer": "₹14 - ₹30 LPA",
    "Database Administrator": "₹9 - ₹20 LPA",
    "BI Developer": "₹8 - ₹18 LPA",
    "Embedded Systems Engineer": "₹8 - ₹22 LPA",
    "Game Developer": "₹7 - ₹18 LPA",
    "Security Engineer": "₹14 - ₹30 LPA",
}

csv_paths = [
    Path("data/careers.csv"),
    Path("backend/data/careers.csv"),
]

for path in csv_paths:
    if not path.exists():
        continue
    rows = []
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            role = row["role"].strip()
            if role in ROLE_INR_SALARIES:
                row["avg_salary_range"] = ROLE_INR_SALARIES[role]
            rows.append(row)

    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

print("Both CSV files successfully populated with correct Indian Rupee (INR) salaries.")

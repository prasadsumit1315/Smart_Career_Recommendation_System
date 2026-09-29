import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from recommender.models import CareerRole
from recommender.engine import parse_skill_list, RecommendationEngine

class Command(BaseCommand):
    help = "Loads career roles from careers.csv dataset into the database and warms ML cache"

    def handle(self, *args, **options):
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        csv_path = base_dir / 'data' / 'careers.csv'
        if not csv_path.exists():
            csv_path = base_dir.parent / 'data' / 'careers.csv'

        if not csv_path.exists():
            self.stdout.write(self.style.ERROR(f"CSV file not found at {csv_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Loading careers from {csv_path}..."))

        count = 0
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                role_name = row['role'].strip()
                desc = row['description'].strip()
                req_skills = parse_skill_list(row['required_skills'])
                nice_skills = parse_skill_list(row.get('nice_to_have_skills', ''))
                salary = row.get('avg_salary_range', '₹10 - ₹22 LPA').strip()
                growth = row.get('growth_outlook', '+20%').strip()
                resources = [r.strip() for r in row.get('learning_resources', '').split(',') if r.strip()]

                CareerRole.objects.update_or_create(
                    title=role_name,
                    defaults={
                        'description': desc,
                        'required_skills': req_skills,
                        'nice_to_have_skills': nice_skills,
                        'avg_salary_range': salary,
                        'growth_outlook': growth,
                        'learning_resources': resources,
                    }
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully loaded/updated {count} career roles in database."))

        # Warm up the recommendation engine and joblib cache
        self.stdout.write(self.style.NOTICE("Initializing ML RecommendationEngine & building cache..."))
        engine = RecommendationEngine.get_instance()
        self.stdout.write(self.style.SUCCESS(f"ML engine ready with {len(engine.roles_data)} roles in vector space!"))

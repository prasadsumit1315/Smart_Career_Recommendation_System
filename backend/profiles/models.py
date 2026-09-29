from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Education
    education_level = models.CharField(max_length=100, blank=True, default="")
    education_field = models.CharField(max_length=150, blank=True, default="")
    education_institution = models.CharField(max_length=200, blank=True, default="")
    education_year = models.IntegerField(null=True, blank=True)
    
    # Skills & Interests (stored as JSON arrays)
    skills = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    
    # Professional Experience
    experience_years = models.FloatField(default=0.0)
    experience_text = models.TextField(blank=True, default="")
    
    # Projects: list of dicts with keys title, description, tech
    projects = models.JSONField(default=list, blank=True)
    
    # Career Preferences
    target_role = models.CharField(max_length=100, blank=True, default="")
    preferred_work_type = models.CharField(max_length=50, blank=True, default="Remote")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    def get_query_text(self):
        """Builds a rich combined textual representation of the profile for ML vectorization."""
        skills_str = " ".join(self.skills if isinstance(self.skills, list) else [])
        interests_str = " ".join(self.interests if isinstance(self.interests, list) else [])
        
        project_texts = []
        if isinstance(self.projects, list):
            for proj in self.projects:
                if isinstance(proj, dict):
                    t = proj.get('title', '')
                    d = proj.get('description', '')
                    tech = proj.get('tech', '') or proj.get('tech_stack', '')
                    project_texts.append(f"{t} {d} {tech}")
        
        proj_str = " ".join(project_texts)
        edu_str = f"{self.education_level} {self.education_field}".strip()
        exp_str = f"{self.experience_text} with {self.experience_years} years experience".strip()
        
        return f"{skills_str} {interests_str} {proj_str} {edu_str} {exp_str}".strip()

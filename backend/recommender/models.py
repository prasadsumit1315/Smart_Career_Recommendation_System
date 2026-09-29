from django.db import models
from django.contrib.auth.models import User

class CareerRole(models.Model):
    title = models.CharField(max_length=150, unique=True)
    description = models.TextField()
    required_skills = models.JSONField(default=list)
    nice_to_have_skills = models.JSONField(default=list, blank=True)
    avg_salary_range = models.CharField(max_length=100, default="₹10 - ₹22 LPA")
    growth_outlook = models.CharField(max_length=100, default="+20%")
    learning_resources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class RecommendationHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recommendation_history',
        null=True,
        blank=True
    )
    query_snapshot = models.JSONField(default=dict)
    results = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"Recommendation on {self.created_at.strftime('%Y-%m-%d %H:%M')} for {username}"

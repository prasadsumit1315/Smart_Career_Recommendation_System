from rest_framework import serializers
from .models import UserProfile
from accounts.serializers import UserSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            'id',
            'user',
            'user_details',
            'education_level',
            'education_field',
            'education_institution',
            'education_year',
            'skills',
            'interests',
            'experience_years',
            'experience_text',
            'projects',
            'target_role',
            'preferred_work_type',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate_skills(self, value):
        if isinstance(value, str):
            value = [s.strip() for s in value.split(',') if s.strip()]
        if not isinstance(value, list):
            raise serializers.ValidationError("Skills must be a list of strings or comma-separated string.")
        return [str(s).strip() for s in value if str(s).strip()]

    def validate_interests(self, value):
        if isinstance(value, str):
            value = [i.strip() for i in value.split(',') if i.strip()]
        if not isinstance(value, list):
            raise serializers.ValidationError("Interests must be a list of strings.")
        return [str(i).strip() for i in value if str(i).strip()]

    def validate_projects(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Projects must be a list of project items.")
        validated_projects = []
        for p in value:
            if isinstance(p, dict):
                validated_projects.append({
                    'title': str(p.get('title', '')).strip(),
                    'description': str(p.get('description', '')).strip(),
                    'tech': str(p.get('tech', '') or p.get('tech_stack', '')).strip(),
                })
        return validated_projects

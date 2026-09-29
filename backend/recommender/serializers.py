from rest_framework import serializers
from .models import CareerRole, RecommendationHistory

class CareerRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRole
        fields = (
            'id',
            'title',
            'description',
            'required_skills',
            'nice_to_have_skills',
            'avg_salary_range',
            'growth_outlook',
            'learning_resources',
            'created_at',
        )


class RecommendationQuerySerializer(serializers.Serializer):
    skills = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    interests = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    projects = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )
    experience_text = serializers.CharField(required=False, allow_blank=True, default="")
    experience_years = serializers.FloatField(required=False, default=0.0)
    education_field = serializers.CharField(required=False, allow_blank=True, default="")
    top_k = serializers.IntegerField(required=False, default=5, min_value=1, max_value=20)


class RecommendationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationHistory
        fields = ('id', 'query_snapshot', 'results', 'created_at')
        read_only_fields = ('id', 'created_at')

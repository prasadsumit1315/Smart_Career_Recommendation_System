from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import CareerRole, RecommendationHistory
from .serializers import (
    CareerRoleSerializer,
    RecommendationQuerySerializer,
    RecommendationHistorySerializer
)
from .engine import RecommendationEngine

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class CareerRoleListView(generics.ListAPIView):
    """GET /api/roles - lists all career roles in database with search & pagination."""
    permission_classes = [permissions.AllowAny]
    queryset = CareerRole.objects.all()
    serializer_class = CareerRoleSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(title__icontains=search)
        return qs


class CareerRoleDetailView(generics.RetrieveAPIView):
    """GET /api/roles/<id> - returns single career role details."""
    permission_classes = [permissions.AllowAny]
    queryset = CareerRole.objects.all()
    serializer_class = CareerRoleSerializer
    lookup_field = 'pk'


class RecommendView(APIView):
    """
    POST /api/recommend
    Generates AI career recommendations.
    Uses either the provided payload or the logged-in user's saved profile.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data or {}

        skills = data.get('skills', [])
        interests = data.get('interests', [])
        projects = data.get('projects', [])
        experience_text = data.get('experience_text', '')
        experience_years = data.get('experience_years', 0.0)
        education_field = data.get('education_field', '')
        top_k = int(data.get('top_k', 5))

        # If payload has empty skills and user is authenticated with a profile, fallback to profile
        if not skills and request.user.is_authenticated and hasattr(request.user, 'profile'):
            profile = request.user.profile
            skills = profile.skills or []
            interests = profile.interests or []
            projects = profile.projects or []
            experience_text = profile.experience_text or ""
            experience_years = profile.experience_years or 0.0
            education_field = profile.education_field or ""

        # Normalize skills if passed as comma-separated string
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',') if s.strip()]

        engine = RecommendationEngine.get_instance()
        recommendations = engine.recommend(
            skills=skills,
            interests=interests,
            projects=projects,
            experience_text=experience_text,
            experience_years=float(experience_years),
            education_field=education_field,
            top_k=top_k
        )

        query_snapshot = {
            'skills': skills,
            'interests': interests,
            'projects': projects,
            'experience_text': experience_text,
            'experience_years': experience_years,
            'education_field': education_field,
        }

        # Save to recommendation history if user is authenticated
        if request.user.is_authenticated:
            try:
                RecommendationHistory.objects.create(
                    user=request.user,
                    query_snapshot=query_snapshot,
                    results=recommendations
                )
            except Exception as e:
                # Non-blocking log if history recording fails
                pass

        return Response({
            'count': len(recommendations),
            'query_snapshot': query_snapshot,
            'recommendations': recommendations
        }, status=status.HTTP_200_OK)


class RecommendationHistoryListView(generics.ListAPIView):
    """GET /api/recommendations/history - returns authenticated user's past recommendation runs."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecommendationHistorySerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return RecommendationHistory.objects.filter(user=self.request.user)

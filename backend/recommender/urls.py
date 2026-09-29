from django.urls import path, re_path
from .views import (
    RecommendView,
    RecommendationHistoryListView,
    CareerRoleListView,
    CareerRoleDetailView
)

urlpatterns = [
    re_path(r'^recommend/?$', RecommendView.as_view(), name='recommend'),
    re_path(r'^recommendations/history/?$', RecommendationHistoryListView.as_view(), name='recommendation_history'),
    re_path(r'^roles/?$', CareerRoleListView.as_view(), name='roles_list'),
    re_path(r'^roles/(?P<pk>\d+)/?$', CareerRoleDetailView.as_view(), name='role_detail'),
]

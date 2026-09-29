from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, MeView

urlpatterns = [
    re_path(r'^register/?$', RegisterView.as_view(), name='register'),
    re_path(r'^login/?$', CustomTokenObtainPairView.as_view(), name='login'),
    re_path(r'^refresh/?$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^me/?$', MeView.as_view(), name='me'),
]

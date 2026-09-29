from django.urls import re_path
from .views import ProfileView

urlpatterns = [
    re_path(r'^profile/?$', ProfileView.as_view(), name='profile'),
]

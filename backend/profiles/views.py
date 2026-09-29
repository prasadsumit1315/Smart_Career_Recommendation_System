from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, user):
        profile, created = UserProfile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self.get_object(request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = self.get_object(request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Profile
from ..serializers import PublicProfileSerializer


User = get_user_model()
ALLOWED_HOSTS = settings.ALLOWED_HOSTS


@api_view(["GET", "POST"])
def profile_detail_api_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found"}, status=404)
    profile_obj = qs.first()
    data = request.data or {}
    if request.method == "POST":
        current_user = request.user
        action = data.get("action")
        if profile_obj.user == current_user:
            if action == "follow":
                profile_obj.follower.add(current_user)
            elif action == "unfollow":
                profile_obj.follower.remove(current_user)
            else:
                pass
    serializer = PublicProfileSerializer(profile_obj, context={"request": request})
    return Response(serializer.data, status=200)


# @api_view(["GET","POST"])
# @permission_classes([IsAuthenticated])
# def user_follow_view(request, username, *arg, **kwargs):
#     current_user = request.user
#     follow_user_qs = User.objects.filter(username=username)
#     if current_user.username == username:
#         my_follower = current_user.profile.follower.all()
#         return Response({"count": my_follower.count()}, status=200)
#     if not follow_user_qs.exists():
#         return Response({}, status=404)
#     follow_user = follow_user_qs.first()
#     profile = follow_user.profile
#     data = request.data or {}
#     action = data.get("action")
#     if action == "follow":
#         profile.follower.add(current_user)
#     elif action == "unfollow":
#         profile.follower.remove(current_user)
#     else:
#         pass
#     data = PublicProfileSerializer(profile, context={"request": request})
#     return Response(data.data, status=200)




from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from .views import profile_detail_api_view

# api/profile/
urlpatterns = [
    path("<str:username>/follow/", profile_detail_api_view, name="follow"),
    path("<str:username>", profile_detail_api_view, name="detail"),
]
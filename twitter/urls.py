from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from .views import (
    home_view, 
    tweet_detail_view, 
    tweet_list_view, 
    tweet_create_view,
    tweet_delete_view,
    tweet_action_view,
    tweet_feed_view,
)


# api/tweets/
urlpatterns = [
    path('home/', home_view, name="home"),
    path("react/", TemplateView.as_view(template_name="react_via_dj.html")),
    path("action/", tweet_action_view, name="action"),
    path("create/", tweet_create_view, name="create"),
    path("<int:tweet_id>/",tweet_detail_view, name="detail"),
    path("delete/<int:tweet_id>/", tweet_delete_view, name="delete"),
    path("", tweet_list_view, name="list"),
    path("feed/", tweet_feed_view, name="feed"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
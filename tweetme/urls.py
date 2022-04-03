from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

from accounts.views import (
    login_view,
    logout_view,
    register_view,
)

from twitter.views import (
    home_view, 
    django_tweets_detail_view, 
    django_tweets_list_view, 
    tweet_feed_view,
    tweet_detail_view,
)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', home_view, name="home"),
    path("", django_tweets_list_view, name="list"),
    path("<int:tweet_id>",django_tweets_detail_view, name="detail"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
    #path("react/", TemplateView.as_view(template_name="react_via_dj.html")),
    path("api/tweets/", include("twitter.urls")),
    path("profile/", include("profiles.urls")),
    path("api/profile/", include("profiles.api.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
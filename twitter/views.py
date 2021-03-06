import random
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme
from django.http import HttpResponse, Http404, JsonResponse
from django.conf import settings
from django.contrib.auth.decorators import login_required

from rest_framework.authentication import SessionAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from .models import Tweet, TweetLike
from .forms import tweetForm


ALLOWED_HOSTS = settings.ALLOWED_HOSTS
# Create your views here.


"""
Django REST Framework
"""

def home_view(request, *arg, **kwargs):
    return render(request, "pages/feed.html")


def django_tweets_list_view(request, *arg, **kwargs):
    return render(request, "react_tweets/list.html", context={})


def django_tweets_detail_view(request, tweet_id, *arg, **kwargs):
    return render(request, "react_tweets/detail.html", context={"tweet_id":tweet_id})





@api_view(["POST"])
#@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *arg, **kwargs):
    serializer = TweetCreateSerializer(data=request.data)
    user = request.user
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(["DELETE", "POST"])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *arg, **kwarg):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({"message":"You cannot delete this tweet"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message":"Successfully delete"},  status=200)



@api_view(["DELETE", "POST"])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *arg, **kwarg):
    serializer = TweetActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        content = data.get("content")
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == "like":
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data,  status=200)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data,  status=200)
        elif action == "retweet":
            new_tweet = Tweet.objects.create(user=request.user, parent=obj, content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data,  status=201)
        elif action == "delete":
            obj.delete()
            return Response({"message":"Successfully delete"},  status=200)
    return Response({"message":"Successfully"},  status=200)


@api_view(["GET"])
def tweet_detail_view(request, tweet_id, *arg, **kwarg):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=401)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    #print(serializer)
    return Response(serializer.data, status=200)


def paginated_queryset(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tweet_feed_view(request, *arg, **kwarg):
    user = request.user
    qs = Tweet.objects.feed(user)
    return paginated_queryset(qs, request)


@api_view(["GET"])
def tweet_list_view(request, *arg, **kwarg):
    qs = Tweet.objects.all()
    username = request.GET.get("username")
    if username != None:
        qs = qs.by_username(username)
    return paginated_queryset(qs, request)




"""
RET API Create View -> DRF
"""

def tweet_create_view_pure_django(request, *arg, **kwargs):
            """
            RET API Create View -> DRF
            """
            user = request.user
            if not request.user.is_authenticated:
                        user = None
                        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                                    return JsonResponse({}, status=401)
                        return redirect(settings.LOGIN_URL)
            #print("ajax:",request.headers.get('x-requested-with') == 'XMLHttpRequest')
            form = tweetForm(request.POST or None)
            # print("POST data is:", request.POST)
            next_url = request.POST.get("next") or None
            #print("next url:", next_url)
            #print("valid :", form.is_valid())
            if form.is_valid():
                        obj = form.save(commit=False)
                        obj.user = user
                        obj.save()
                        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                                    return JsonResponse(obj.serialize(), status=201)
                        if next_url != None and url_has_allowed_host_and_scheme(next_url, ALLOWED_HOSTS):
                                    return redirect(next_url)
                        form = tweetForm()
            print("error:", form.errors)
            if form.errors:
                        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                                    return JsonResponse(form.errors, status=400)
            return render(request, "components/forms.html", context={"form":form})


def tweet_list_view_pure_django(request, *arg, **kwarg):
            """
            RET API Create View -> DRF
            """
            qs = Tweet.objects.all()
            tweets_list = [x.serialize() for x in qs]
            data = {
                        "is_user":False,
                        "tweets": tweets_list
            }
            return JsonResponse(data)


def tweet_view_pure_django(request, *arg, **kwargs):
            """
            RET API Create View -> DRF
            """
            data = {
                        "id":tweet_id,
            }
            status = 200
            try:
                        obj = Tweet.objects.get(id=tweet_id)
                        data["content"] = obj.content
            except:
                        data["message"] = "Not found"
                        status = 404
            return JsonResponse(data, status=status)
from django.conf import settings
from rest_framework import serializers
from .models import Tweet, TweetLike
from profiles.serializers import PublicProfileSerializer


MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH
TWEET_ACTON_OPTIONS = settings.TWEET_ACTON_OPTIONS


class TweetActionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)
    
    class Meta:
        model = TweetLike
        fields = ('id', 'action', "content")
                
    def validate_action(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTON_OPTIONS:
            raise serializers.ValidationError("This is not a valid action")
        return value
            

# create only
class TweetCreateSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source="user.profile", read_only=True)  #serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Tweet
        fields = ["user", "id", "content", "likes", "timestamp"]
                
    def get_likes(self, obj):
        return obj.likes.count()
                
    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long")
        return value
    
    # def get_user(self, obj):
    #     return obj.user.id
            
            
# read only           
class TweetSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source="user.profile", read_only=True) 
    likes = serializers.SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    
    class Meta:
        model = Tweet
        fields = ["user", "id", "content", "likes", "is_retweet", "parent", "timestamp"]
                
    def get_likes(self, obj):
        return obj.likes.count()
    
    # def get_user(self, obj):
    #     return obj.user.id
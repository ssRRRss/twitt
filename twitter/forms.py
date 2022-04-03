from django import forms
from .models import Tweet
from django.conf import settings


MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH
class tweetForm(forms.ModelForm):
            class Meta:
                        model = Tweet
                        field = ["content"]
                        exclude = ["id", "image","user"]
                        
            def clean_content(self):
                        content = self.cleaned_data.get("content")
                        if len(content) > MAX_TWEET_LENGTH :
                                    raise forms.ValidationError("This tweet is too long")
                        return content
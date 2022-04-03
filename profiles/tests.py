from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import Profile


User = get_user_model()

class ProfileTestCase(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="123", password="somepassword")
        self.user2 = User.objects.create_user(username="123-2", password="somepassword2")
        
    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='somepassword')
        return client
        
    def test_profile_created(self):
        qs = Profile.objects.all()
        self.assertEqual(qs.count(), 2)
        
    def test_following(self):
        user_1 = self.user
        user_2 = self.user2
        user_1.profile.follower.add(user_2)
        user_2_following_whom = user_2.following.all()
        qs = user_2_following_whom.filter(user=user_1)
        self.assertTrue(qs.exists())
        user_1_following_no_one = user_1.following.all()
        self.assertFalse(user_1_following_no_one.exists())
        
        
    def test_following_api_endpoint(self):
        user_1 = self.user
        user_2 = self.user2
        user_1.profile.follower.add(user_2)
        client = self.get_client()
        response = client.post(
            f"/api/profile/{self.user2.username}/follow/",
            {"action": "unfollow"}
        )
        res_data = response.json()
        count = res_data.get("count")
        self.assertEqual(count, 0)
        
        
    def test_cannot_following_api_endpoint(self):
        client = self.get_client()
        response = client.post(
            f"/api/profile/{self.user.username}/follow/",
            {"action": "follow"}
        )
        res_data = response.json()
        count = res_data.get("count")
        self.assertEqual(count, 0)
                        
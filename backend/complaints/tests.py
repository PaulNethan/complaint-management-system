from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class ComplaintThrottlingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_anonymous_throttling(self):
        # The rate limit for anon is 5/min in settings.py
        # Let's make 6 requests without credentials.
        # The first 5 should receive a 200 OK (with "No token provided" since the view doesn't raise a 401 for missing token).
        # The 6th should be throttled and return 429.
        
        url = "/api/user/raisecomplaints/"
        
        for i in range(5):
            response = self.client.post(url, {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data["message"], "No token provided")
            
        # The 6th request should exceed the limit
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertIn("detail", response.data)
        self.assertIn("Request was throttled.", response.data["detail"])


from django.test import TestCase
from rest_framework.test import APIClient
from django.core.cache import cache

class RateLimiterTests(TestCase):
    
    def setUp(self):
        # ARRANGE Phase 1: Clear the memory before the test starts
        cache.clear()

    def test_bot_blocked_by_throttling(self):
        # ARRANGE Phase 2: Spin up the fake bot browser
        bot_browser = APIClient()
        
        # ACT Phase 1: Fire 5 allowed requests
        for i in range(5):
            bot_browser.post('/api/login/')
            
        # ACT Phase 2: Fire the 6th illegal request and save the response
        final_response = bot_browser.post('/api/login/')
        
        # ASSERT: Verify the bouncer kicked the bot out (429 Too Many Requests)
        self.assertEqual(final_response.status_code, 429)
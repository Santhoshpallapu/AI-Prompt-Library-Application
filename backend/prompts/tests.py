from unittest.mock import MagicMock, patch

from django.core.exceptions import ValidationError
from django.test import Client, TestCase

from .models import Prompt


class PromptModelTests(TestCase):
    def test_prompt_validation_rejects_short_fields(self):
        prompt = Prompt(title="AI", content="short prompt", complexity=11)

        with self.assertRaises(ValidationError):
            prompt.full_clean()

    def test_prompt_validation_rejects_url_title(self):
        prompt = Prompt(
            title="http://localhost:4200/prompts",
            content="Create a magical forest portrait with glowing fireflies and soft green mist.",
            complexity=5,
        )

        with self.assertRaises(ValidationError):
            prompt.full_clean()


class PromptApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.prompt = Prompt.objects.create(
            title="Cyberpunk City",
            content="Generate a cinematic cyberpunk skyline at sunset with flying cars.",
            complexity=7,
        )

    def test_get_prompts_returns_prompt_list(self):
        response = self.client.get("/api/prompts/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_post_prompts_creates_prompt(self):
        response = self.client.post(
            "/api/prompts/",
            data={
                "title": "Forest Spirit",
                "content": "Create a magical forest portrait with soft green lighting and floating particles.",
                "complexity": 5,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Prompt.objects.count(), 2)

    @patch("prompts.views.get_redis_client")
    def test_get_prompt_detail_increments_view_count(self, mocked_redis):
        redis_client = MagicMock()
        redis_client.incr.return_value = 3
        mocked_redis.return_value = redis_client

        response = self.client.get(f"/api/prompts/{self.prompt.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["view_count"], 3)

from django.core.exceptions import ValidationError
from django.db import models


class Prompt(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def clean(self):
        errors = {}

        if self.title and len(self.title.strip()) < 3:
            errors["title"] = "Title must be at least 3 characters long."

        if self.title and self.title.strip().lower().startswith(("http://", "https://")):
            errors["title"] = "Title should be a prompt name, not a URL."

        if self.content and len(self.content.strip()) < 20:
            errors["content"] = "Content must be at least 20 characters long."

        if self.complexity is None or not 1 <= self.complexity <= 10:
            errors["complexity"] = "Complexity must be between 1 and 10."

        if errors:
            raise ValidationError(errors)

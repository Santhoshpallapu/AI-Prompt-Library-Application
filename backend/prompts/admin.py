from django.contrib import admin

from .models import Prompt


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ("title", "complexity", "created_at")
    search_fields = ("title", "content")
    list_filter = ("complexity", "created_at")

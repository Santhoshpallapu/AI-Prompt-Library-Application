from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_home(_request):
    return JsonResponse(
        {
            "message": "AI Prompt Library backend is running.",
            "endpoints": {
                "health": "/api/health/",
                "list_create_prompts": "/api/prompts/",
                "prompt_detail_example": "/api/prompts/1/",
                "admin": "/admin/",
            },
        }
    )


def health_check(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("", api_home, name="api-home"),
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path("api/prompts/", include("prompts.urls")),
    path("prompts/", include("prompts.urls")),
]

import json

import redis
from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Prompt


def get_redis_client():
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        decode_responses=True,
    )


def serialize_prompt(prompt, include_content=False, view_count=None):
    data = {
        "id": prompt.id,
        "title": prompt.title,
        "complexity": prompt.complexity,
        "created_at": prompt.created_at.isoformat(),
    }

    if include_content:
        data["content"] = prompt.content

    if view_count is not None:
        data["view_count"] = view_count

    return data


def parse_request_body(request: HttpRequest):
    try:
        body = request.body.decode("utf-8") if request.body else "{}"
        return json.loads(body)
    except json.JSONDecodeError:
        raise ValidationError({"body": "Request body must be valid JSON."})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def prompt_list_create(request: HttpRequest):
    if request.method == "GET":
        prompts = Prompt.objects.all()
        return JsonResponse([serialize_prompt(prompt) for prompt in prompts], safe=False)

    try:
        payload = parse_request_body(request)
    except ValidationError as exc:
        return JsonResponse({"errors": exc.message_dict}, status=400)

    prompt = Prompt(
        title=(payload.get("title") or "").strip(),
        content=(payload.get("content") or "").strip(),
        complexity=payload.get("complexity"),
    )

    try:
        prompt.full_clean()
        prompt.save()
    except ValidationError as exc:
        return JsonResponse({"errors": exc.message_dict}, status=400)

    return JsonResponse(serialize_prompt(prompt, include_content=True, view_count=0), status=201)


@require_http_methods(["GET"])
def prompt_detail(_request: HttpRequest, prompt_id: int):
    try:
        prompt = Prompt.objects.get(pk=prompt_id)
    except Prompt.DoesNotExist:
        return JsonResponse({"error": "Prompt not found."}, status=404)

    redis_client = get_redis_client()
    view_count = int(redis_client.incr(f"prompt:{prompt.id}:views"))
    return JsonResponse(serialize_prompt(prompt, include_content=True, view_count=view_count))

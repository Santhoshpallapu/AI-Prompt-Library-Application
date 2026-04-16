#!/bin/sh
set -e

python - <<'PY'
import os
import socket
import time


def wait_for_service(name, host, port):
    print(f"Waiting for {name} at {host}:{port}...")
    for _ in range(60):
        try:
            with socket.create_connection((host, int(port)), timeout=2):
                print(f"{name} is available.")
                return
        except OSError:
            time.sleep(1)
    raise SystemExit(f"{name} did not become available in time.")


wait_for_service("PostgreSQL", os.getenv("POSTGRES_HOST", "db"), os.getenv("POSTGRES_PORT", "5432"))
wait_for_service("Redis", os.getenv("REDIS_HOST", "redis"), os.getenv("REDIS_PORT", "6379"))
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000

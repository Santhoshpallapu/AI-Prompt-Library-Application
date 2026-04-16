# AI Prompt Library

A beginner-friendly full-stack web application for saving and managing AI image generation prompts. The project uses Angular for the frontend, Django for the backend, PostgreSQL for persistent storage, Redis for prompt view counts, and Docker Compose to run the full stack with one command.

## Tech Stack

- Angular 17
- Django 4.2
- PostgreSQL 16
- Redis 7
- Docker and Docker Compose

## Features

- View all saved prompts
- Add a new prompt with frontend and backend validation
- Open a single prompt to see full content
- Increment and return `view_count` from Redis every time the detail page is opened
- Store prompt records in PostgreSQL
- Run the complete project with `docker-compose up --build`

## Project Structure

```text
.
├── backend
├── frontend
├── docker-compose.yml
├── .env
└── README.md
```

## How To Run

### Option 1: Docker Compose

This is the recommended way because it uses the exact stack required in the assignment.

```bash
docker-compose up --build
```

After the containers start:

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/api/prompts/
- Django Admin: http://localhost:8000/admin/

### Option 2: Run Locally Without Docker

You can also run the apps separately if you already have PostgreSQL, Redis, Python, and Node installed in compatible versions.

Backend:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### `GET /prompts/` or `GET /api/prompts/`

Returns all prompts.

### `POST /prompts/` or `POST /api/prompts/`

Creates a new prompt.

Example request body:

```json
{
  "title": "Cyberpunk City",
  "content": "Create a cinematic cyberpunk skyline at sunset with neon lights and flying cars.",
  "complexity": 7
}
```

### `GET /prompts/:id/` or `GET /api/prompts/:id/`

Returns a single prompt and increments the Redis view counter.

Example response:

```json
{
  "id": 1,
  "title": "Cyberpunk City",
  "content": "Create a cinematic cyberpunk skyline at sunset with neon lights and flying cars.",
  "complexity": 7,
  "created_at": "2026-04-15T10:30:00Z",
  "view_count": 4
}
```

## Validation Rules

Frontend and backend both validate:

- Title must be at least 3 characters
- Content must be at least 20 characters
- Complexity must be between 1 and 10

## Architecture Notes

- Django uses plain function-based views and `JsonResponse` instead of Django REST Framework, as required.
- PostgreSQL stores prompt data permanently.
- Redis stores the view count and acts as the source of truth for prompt views.
- Angular uses a shared service for HTTP calls and reactive forms for prompt creation.
- The frontend uses an Angular proxy so `/api` calls reach Django cleanly during Docker development.

## Screenshots

Add screenshots here before submission if you want to strengthen the final presentation:

- Prompt list page
- Prompt detail page
- Add prompt form

## Bonus Features

This submission focuses on completing the required features cleanly first. Authentication and tagging were not added so the core assignment stays stable and easy to review.

## Submission Checklist

- Public GitHub repository
- Hosted frontend/backend link
- README with setup instructions and architecture notes
- Screenshots
- Screen recording link

## Possible Improvements

- Add authentication for protected prompt creation
- Add tags with filtering support
- Add pagination or search for larger prompt collections
- Add automated CI checks for tests and linting

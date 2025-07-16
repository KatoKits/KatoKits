# API Documentation

This document describes the API endpoints available in the KatoKits application through Netlify Functions.

## Base URL

All API endpoints are available at: `https://katokits.ca/.netlify/functions/`

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <your-auth-token>
```

Tokens are obtained through the login process and stored in localStorage.

## Endpoints

### Authentication

#### POST /auth-signup

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token",
    "expires_at": 1234567890
  },
  "profile": {
    "plan": "free",
    "ai_generations_used": 0
  }
}
```

#### POST /auth-login

Authenticate existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:** Same as signup

#### POST /auth-logout

Logout current user (requires authentication).

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### AI Generation

#### POST /generateAIPlan

Generate an AI lesson plan.

**Request Body:**

```json
{
  "theme": "Ocean Animals",
  "ageGroup": "3-4 years",
  "skills": ["counting", "colors"],
  "materials": ["paper", "crayons"],
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "lessonPlan": {
    "title": "Ocean Animals Adventure",
    "objectives": [...],
    "activities": [...],
    "materials": [...],
    "assessments": [...]
  },
  "usage": {
    "remaining": 2,
    "plan": "free"
  }
}
```

### Usage Tracking

#### GET /ai-usage

Get current AI usage statistics (requires authentication).

**Response:**

```json
{
  "generations_used": 1,
  "generations_limit": 3,
  "can_generate": true,
  "plan": "free"
}
```

#### POST /ai-usage

Record AI usage.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

### Communication

#### POST /contact-form

Submit contact form.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about plans",
  "message": "I have a question..."
}
```

#### POST /email-capture

Subscribe to email list.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

**Error Response Format:**

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- Free users: 3 AI generations per account
- Pro users: Unlimited AI generations
- Contact form: 5 submissions per hour per IP
- Email capture: 1 submission per email per day

## Authentication Flow

1. User registers/logs in through the UI
2. Frontend receives session token
3. Token stored in localStorage
4. Subsequent API calls include Authorization header
5. Server validates token with Supabase
6. Protected resources accessible if valid

## Development

### Testing Endpoints

You can test endpoints using curl:

```bash
# Signup
curl -X POST https://katokits.ca/.netlify/functions/auth-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Generate AI plan
curl -X POST https://katokits.ca/.netlify/functions/generateAIPlan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"theme":"Animals","ageGroup":"3-4","email":"test@example.com"}'
```

### Environment Variables

Required environment variables for Netlify Functions:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

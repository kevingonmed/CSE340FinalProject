# WanderDecide - CSE340 Final Project

WanderDecide is an AI-powered trip planner built with Node.js, Express, EJS, and PostgreSQL.  
Users can register, log in, answer a short trip questionnaire, and receive a saved day-by-day itinerary.

## Features

- Account registration, login, and logout with bcrypt password hashing
- Session-based authentication with PostgreSQL session store
- Trip generation based on budget, travel dates, group type, and vibe
- Dynamic itinerary length based on date range (capped at 12 days)
- Groq AI integration with automatic mock fallback on API errors
- Dashboard with saved trip history and itinerary detail pages
- Admin dashboard for viewing users, trip totals, and recent trips
- Flash messaging for success, warning, info, and error UX

## Tech Stack

- **Backend:** Node.js, Express 5
- **Templating:** EJS
- **Database:** PostgreSQL (`pg`)
- **Sessions:** `express-session`, `connect-pg-simple`
- **Validation:** `express-validator`
- **Security:** `bcrypt`
- **AI Provider:** Groq Chat Completions API

## Project Structure

```text
src/
  controllers/
  middleware/
  models/
  services/
  views/
public/
  css/
server.js
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_URL=postgresql://username:password@host:5432/database_name
SESSION_SECRET=your-long-random-session-secret
NODE_ENV=development
PORT=3000

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

ENABLE_SQL_LOGGING=true
```

Notes:

- Set `AI_PROVIDER=mock` to test without calling Groq.
- Keep `.env` private and never commit API keys.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add `.env` with the variables above.
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open:
   - `http://127.0.0.1:3000`

## Database Notes

The project expects these tables/columns to exist:

- `roles`
- `users` (including `home_city` and `role_id`)
- `trips`
- `itinerary_days`
- `activities`

If you created users before adding trip features, run your schema update SQL so newer columns/tables exist.

## Admin Dashboard

- Route: `/admin`
- Access: logged-in users with `roleName === 'admin'`
- Displays:
  - total user count
  - total trip count
  - users table (name, email, role)
  - recent trips table (destination, owner, dates, vibe, budget)

## Testing Checklist

- Register a user account
- Log in and create a trip from `/trips/new`
- Verify loading message appears while generating
- Verify trip is saved and shown on `/dashboard`
- Open `/trips/:id` and confirm itinerary details
- Force Groq failure (e.g., invalid key) and verify mock fallback warning appears
- Log in as admin and verify `/admin` loads

## Deployment (Render)

- Create a Render PostgreSQL instance
- Set Render environment variables (`DB_URL`, `SESSION_SECRET`, `AI_PROVIDER`, `GROQ_API_KEY`, `GROQ_MODEL`)
- Deploy app using:
  - Build Command: `npm install`
  - Start Command: `npm start`

## Security & Submission Notes

- API keys are stored in environment variables only
- `.env` is gitignored
- Use meaningful commits for each major feature (15+ commits target)

# Supabase Security Compliance Check

A web application to help Supabase project administrators check and enhance their project's security configurations. The tool provides insights and controls for Row Level Security (RLS), Multi-Factor Authentication (MFA), and Point-in-Time Recovery (PITR).

## Features

- **Security Dashboard**: Visual overview of security configurations
- **Row Level Security (RLS) Management**: Check and enable RLS for database tables
- **Multi-Factor Authentication (MFA)**: Monitor and enable MFA for users
- **Point-in-Time Recovery (PITR)**: Enable and manage backup configurations
- **AI-Powered Security Suggestions**: Get contextual security recommendations
- **Real-time Security Stats**: Monitor security metrics in real-time

## Tech Stack

### Frontend
- Next.js 13+ (React)
- Tailwind CSS
- React Query
- React Hot Toast

### Backend
- Node.js
- Express.js
- Supabase Client
- Google AI (Gemini)
- Winston Logger

## Local Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- A Supabase project
- Google AI (Gemini) API key

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the backend server
```bash
npm run dev
```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Install frontend dependencies
```bash
cd frontend
npm install
```

2. Create a `.env.local` file in the frontend directory
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Start the frontend development server
```bash
npm run dev
```

The frontend application will be available at http://localhost:3000

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── security.js
│   │   │   └── ai.js
│   │   ├── lib/
│   │   │   ├── logger.js
│   │   │   └── supabaseClient.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── components/
│   ├── lib/
│   │   ├── api.js
│   │   └── hooks/
│   └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Login with Supabase credentials
- `GET /api/auth/user`: Get current user information

### Security
- `GET /api/security/stats`: Get security statistics
- `POST /api/security/mfa/enable`: Enable MFA for a user
- `POST /api/security/rls/enable`: Enable RLS for a table
- `POST /api/security/pitr/enable`: Enable PITR for the project

### AI
- `POST /api/ai/suggest`: Get AI-powered security suggestions


## Security Considerations

- All API endpoints are protected with authentication
- CORS is configured for specific origins
- Session management with token-based authentication
- Secure credential handling
- Rate limiting on sensitive endpoints


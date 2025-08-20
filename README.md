# MeetusVR Authentication System

### <a href='https://meetusvr-task.vercel.app/'>Live Demo</a>

- **Login Page**
<img width="1918" height="977" alt="image" src="https://github.com/user-attachments/assets/8abf5142-d878-4870-a8c3-c275793ed4cf" />

- **Dashboard**
<img width="1917" height="971" alt="image" src="https://github.com/user-attachments/assets/0b844e1b-4c47-4846-a82e-dd0f04528524" />

- **API Response**
<img width="1758" height="932" alt="image" src="https://github.com/user-attachments/assets/61f99eb4-0011-4cff-bee6-b406ee66707e" />


A secure authentication system built with Next.js 14, featuring protected routes, form validation, and secure token management.

## Features

- **Secure Authentication:**
  - Email and password validation using Zod
  - HTTP-only cookies for token storage
  - Protected routes with middleware
  - Automatic redirects based on auth status

- **User Management:**
  - Secure user information retrieval
  - Caching for better performance
  - Token-based API authentication
  - Proper error handling

- **Route Protection:**
  - Smart routing based on authentication status
  - Protected dashboard and API endpoints
  - Public login page with auth check
  - Secure logout mechanism

## Technical Implementation

### Authentication Flow

1. **Login Process:**
   - Form validation with Zod schema
   - Secure token storage in HTTP-only cookies
   - Automatic redirect to dashboard on success

2. **Route Protection:**
   - Middleware checks auth status
   - Redirects unauthenticated users to login
   - Redirects authenticated users away from login
   - Protected API endpoints

3. **User Information:**
   - Cached user data for performance
   - Secure API calls with bearer token
   - Proper error handling and status codes


## Key Components Explained

### 1. User API (`/api/user/route.ts`)
```typescript
// Fetches user information with caching
export async function GET() {
  const token = await getAuthCookie();
  // Try cache first
  const cachedUser = await getUserInfo();
  if (cachedUser) return NextResponse.json(cachedUser);
  // Fallback to API
  const res = await fetch('api/user/info', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### 2. Middleware (`middleware.ts`)
```typescript
// Smart route protection
if (pathname === '/') {
  if (isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}
// Protect all non-public routes
if (!isAuthed) {
  return NextResponse.redirect(new URL('/', req.url));
}
```

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev # http://localhost:3000
```

## Test Credentials
```
Email: dev.aert@gmail.com
Password: helloworld
```

## Security Notes

- HTTP-only cookies prevent XSS attacks
- Protected routes with middleware
- Proper error handling and status codes
- Token validation on all protected routes
- No client-side token storage
- Automatic auth state management

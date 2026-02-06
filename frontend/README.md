# Todo App Frontend

A responsive, production-ready Next.js frontend application that allows authenticated users to manage their personal todo tasks by securely interacting with the protected backend API.

## Features

- 🔐 Secure authentication with Better Auth
- 📱 Responsive design for mobile and desktop
- ✅ Task management (Create, Read, Update, Delete)
- 🔄 Real-time UI updates after API operations
- 🎨 Modern UI with Tailwind CSS
- ♿ Accessibility compliant (WCAG 2.1 AA)

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **HTTP Client**: Custom fetch wrapper with interceptors
- **State Management**: React Context API + Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your API configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_COOKIE_NAME=auth_token
```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (protected)/       # Protected pages (dashboard, tasks)
│   │   ├── dashboard/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── tasks/[id]/page.tsx
│   │   └── layout.tsx
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── tasks/            # Task management components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── providers/        # Context providers
├── lib/                  # Utility functions and services
│   ├── auth/             # Authentication utilities
│   ├── api/              # API client and services
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── next.config.js        # Next.js configuration
```

## API Integration

All API calls go through the centralized service in `lib/api/client.ts`:

```typescript
import { apiClient } from '@/lib/api/client'

// Get user's tasks
const tasks = await apiClient.getTasks()

// Create a new task
const newTask = await apiClient.createTask({
  title: 'New task',
  description: 'Task description',
  priority: 'medium'
})

// Update a task
const updatedTask = await apiClient.updateTask(taskId, {
  title: 'Updated task',
  completed: true
})
```

## Security

- JWT tokens are automatically attached to all API requests
- Protected routes check authentication before rendering
- All sensitive data is handled securely
- Input validation is performed on both client and server sides

## Testing

Run the tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

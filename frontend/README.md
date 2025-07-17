# ZondaDemo Frontend

## Environment Configuration

Before running the application, you need to set up your environment variables:

1. Create a `.env.local` file in the frontend directory
2. Add the following configuration:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://localhost:7295
```

The application will use these environment variables if available, otherwise falling back to default values.

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run lint`: Run linting

## Project Structure

See `/doc/temp/frontend-reorganization-plan.md` for detailed information about the project structure and ongoing reorganization. 
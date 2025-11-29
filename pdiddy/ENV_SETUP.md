# Environment Variables

## Required Variables

Copy these variables to your `.env.local` file:

```bash
# API Configuration
# Set to 'true' to use mock data from localStorage
# Set to 'false' to use real API endpoints
NEXT_PUBLIC_USE_MOCK=false

# Tec Burger API Base URL
# Development: http://localhost:8080
# Production: https://api.tecburger.com
NEXT_PUBLIC_API_URL=http://localhost:8080

# API Request Timeout (milliseconds)
NEXT_PUBLIC_API_TIMEOUT=10000
```

## Variables Description

- **NEXT_PUBLIC_USE_MOCK**: Toggle between mock data and real API
- **NEXT_PUBLIC_API_URL**: Base URL for the Tec Burger API
- **NEXT_PUBLIC_API_TIMEOUT**: Request timeout in milliseconds

## Setup Instructions

1. Copy the variables above to `.env.local`
2. Adjust `NEXT_PUBLIC_API_URL` if your API runs on a different port
3. Restart the dev server after changing environment variables

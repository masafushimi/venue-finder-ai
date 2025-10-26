# Venue Finder AI

AI-powered venue finder application that helps users find the perfect meeting room or coworking space.

## Features

- AI-powered chat interface for venue recommendations
- Pre-loaded venue database with Tokyo locations
- Real-time chat with OpenAI GPT-4o-mini
- Responsive web interface

## Setup

### 1. Environment Variables

You need to set up the following environment variable in Vercel:

- `OPENAI_API_KEY`: Your OpenAI API key (get from https://platform.openai.com/api-keys)

### 2. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variable `OPENAI_API_KEY` in Vercel dashboard
3. Deploy the application

### 3. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/chat` - Chat with AI for venue recommendations
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get specific venue details

## Technology Stack

- Node.js with Express
- OpenAI GPT-4o-mini
- Vercel Serverless Functions
- Vanilla JavaScript frontend
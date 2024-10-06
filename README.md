# Shorts Generator

A web application for generating YouTube Shorts scripts using AI.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd Shorts-Generator/shorts-gen
   npm install
   cd ../server
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in the `server` directory
   - Add your Google API key to the `.env` file

## Running locally

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd ../shorts-gen
   ng serve
   ```

## Deployment

- Frontend: Deployed on Netlify
- Backend: Deployed on Render

For detailed deployment instructions, please refer to the deployment documentation.
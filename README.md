# MIO - Message Board Application

MIO is an interactive message board application built with Next.js that allows users to share their thoughts and messages in a visually engaging interface.

## Features

- Real-time message posting and viewing
- Animated message display with typing effects
- Cryptic confirmation messages
- Modern, dark-themed UI with subtle animations
- Responsive design for all devices

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (via better-sqlite3)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mio.git
   cd mio-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp example.env.local .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/components` - React components
- `/src/app` - Next.js app router pages and layouts
- `/src/app/api` - API routes
- `/db` - Database setup and schema
- `/public` - Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

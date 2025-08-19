# ArchKings Construction Website

A modern, futuristic construction company website built with Next.js, React, and Firebase.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

### If you encounter SWC binary issues on Windows:

1. Delete node_modules and package-lock.json:
   \`\`\`bash
   rmdir /s node_modules
   del package-lock.json
   \`\`\`

2. Clear npm cache:
   \`\`\`bash
   npm cache clean --force
   \`\`\`

3. Reinstall dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. If the issue persists, try:
   \`\`\`bash
   npm install @next/swc-win32-x64-msvc --save-dev
   \`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Firebase Configuration

Add your Firebase configuration to the environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Admin Access

Visit `/admin` to access the admin dashboard for managing projects and news content.

## Features

- Modern, futuristic design with dark theme and gold accents
- Responsive layout optimized for all devices
- Firebase integration for data storage and media uploads
- Admin dashboard for content management
- Contact form with email integration
- Project portfolio showcase
- Team member profiles
- News and updates section

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase
- Framer Motion (for animations)

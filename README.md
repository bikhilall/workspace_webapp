# Firebase Next.js Web Application

This project is a full-stack web application built with Next.js and Firebase, featuring Firestore database, Storage, and Cloud Functions integration.

## Project Structure

```
├── firebase/              # Firebase configuration files
├── functions/            # Firebase Cloud Functions
└── web-app/              # Next.js web application
```

## Environment Setup

Create a `.env.local` file in the `web-app` directory with your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installation

Install dependencies for the web application:
```bash
cd web-app
npm install
```

Install dependencies for Cloud Functions:
```bash
cd ../functions
npm install
```

## Local Development

1. Start the Next.js development server:
```bash
cd web-app
npm run dev
```
The application will be available at http://localhost:3000
```

## Building for Production

1. Build the web application:
```bash
cd web-app
npm run build
```

2. Build the Cloud Functions:
```bash
cd ../functions
npm run build
```

## Deployment

1. Login to Firebase:
```bash
firebase login
```

2. Initialize Firebase in your project (if not already done):
```bash
firebase init
```

3. Deploy the entire application:
```bash
firebase deploy
```

Or deploy specific components:
```bash
# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# Deploy only firestore rules
firebase deploy --only firestore:rules

# Deploy only storage rules
firebase deploy --only storage:rules
```

## Security Rules

The project includes security rules for both Firestore and Storage. Review and modify the rules in:
- `firebase/firestore.rules`
- `firebase/storage.rules`

## Project Features

- Next.js 13+ with App Router
- Firebase Integration
  - Firestore Database
  - Cloud Storage
  - Cloud Functions
  - Security Rules
- TypeScript Support
- TailwindCSS for styling
- ESLint for code linting


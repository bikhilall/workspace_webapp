# Firebase Next.js Web Application

A modern, full-stack web application built with Next.js 14 and Firebase, featuring TypeScript support, TailwindCSS styling, and comprehensive Firebase services integration.

## Features

- **Next.js 14** with App Router
- **Firebase Integration**
  - Authentication (Email/Password & Google Sign-in)
  - Firestore Database
  - Cloud Storage
  - Cloud Functions
  - Security Rules
- **TypeScript** for type safety
- **TailwindCSS** for modern, responsive styling
- **Material-UI** components and icons
- **ESLint** for code quality
- **Responsive Design**
- **SEO Optimized**

## Project Structure

```
├── .devcontainer/         # Development container configuration
├── firebase/             # Firebase configuration
│   ├── firestore.rules   # Firestore security rules
│   ├── storage.rules     # Storage security rules
│   └── firebase.json     # Firebase configuration
├── functions/            # Firebase Cloud Functions
│   ├── src/             # Functions source code
│   └── package.json     # Functions dependencies
├── web-app/              # Next.js web application
│   ├── app/             # Next.js 14 app directory
│   │   ├── components/  # React components
│   │   ├── firebase/   # Firebase utilities
│   │   └── ...         # Other app pages/routes
│   └── package.json     # Web app dependencies
└── README.md            # Project documentation
```

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project created in the Firebase Console

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create a `.env.local` file in the `web-app` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Install web application dependencies:
```bash
cd web-app
npm install
```

2. Install Cloud Functions dependencies:
```bash
cd ../functions
npm install
```

## Development

1. Start the Next.js development server:
```bash
cd web-app
npm run dev
```
Access the application at http://localhost:3000

2. For Cloud Functions development:
```bash
cd functions
npm run serve
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

3. Deploy specific components:
```bash
# Deploy everything
firebase deploy

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

The project includes comprehensive security rules for both Firestore and Storage:

- **Firestore Rules** (`firebase/firestore.rules`):
  - User profile access control
  - Post creation and management
  - Public data access

- **Storage Rules** (`firebase/storage.rules`):
  - User files protection
  - Profile photos management
  - Post images handling
  - Public files access

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the existing issues
2. Create a new issue with a detailed description
3. Reach out to the maintainers
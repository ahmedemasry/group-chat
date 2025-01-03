# Group Chat Application with Next.js and Firebase

## Live Preview

[🚀 Check out the live demo](group-chat-amber.vercel.app)

## Videos

### Authenticated user can send messages and see all messages from others

https://github.com/user-attachments/assets/d81683af-aba2-42d1-8726-2934743b159d

### Firebase Phone Authentication for the application

https://github.com/user-attachments/assets/4759d781-5702-4545-88d4-d1208156eab0


### Users can only add messages with their own UID

https://github.com/user-attachments/assets/5b1c30ab-fbe2-4949-b280-83e0dd34ff23

### Cloud function tested locally on Firebase Emulator

https://github.com/user-attachments/assets/cda9a7bb-5819-4176-a725-ca064656ace0


## Introduction

This is a full-stack group chat application built with **Next.js**, **TypeScript**, and **Firebase** for authentication, real-time messaging, and Firestore as the data storage. Cloud Functions are used to handle specific features like notifications.

### Features
- **Firebase Phone Authentication** for secure user login.
- **Real-time Group Chat** using Firestore, allowing authenticated users to send and view messages instantly.
- **Cloud Function** to log notifications whenever a new message is added.
- **Firebase Security Rules** ensuring proper access control and data integrity.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Firebase Setup](#firebase-setup)
- [Cloud Functions](#cloud-functions)
- [Security Rules](#security-rules)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/group-chat-nextjs-firebase.git
   cd group-chat-nextjs-firebase
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Install Firebase tools globally (if not already installed):
   ```bash
   yarn global add firebase-tools
   ```

## Configuration

Before running the project, you'll need to set up Firebase and add the necessary configurations.

### Create a Firebase Project:
1. Go to the Firebase Console and create a new project
2. Enable Firebase Phone Authentication
3. Set up Firestore Database and create a collection for storing messages

### Add Firebase Configuration:
1. In the Firebase Console, go to your project settings and copy the Firebase config object
2. Create a `.env.local` file in your project root and add the following:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

### Firebase Emulator Setup (Optional)
For local testing, use the Firebase emulator:
```bash
firebase emulators:start
```

## Firebase Setup

### Firebase Firestore
- Create a collection called `groupChat` where messages will be stored
- Optionally, create a sub-collection for each user's own copy of the message

### Firebase Authentication
- Enable Phone Authentication in the Firebase console
- Users will authenticate using their phone number

## Cloud Functions

The Firebase Cloud Functions are located in the `functions` folder of the project.

### Function to Handle New Message Notification
This Cloud Function triggers when a new message is added to Firestore and logs a message like "Notification sent to [Name] with id [UID]".

To deploy Cloud Functions:
```bash
firebase deploy --only functions
```

## Security Rules

Implement these Firestore security rules to ensure secure data handling:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /groupChat/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.sender;
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment

### Deploy the Application
Deploy your application to Vercel by connecting your GitHub repository to Vercel and following their instructions.

### Deploy Firebase Functions
```bash
firebase deploy --only functions
```

### Deploy Firestore Security Rules
```bash
firebase deploy --only firestore
```

## Usage

### Run Locally
Start the development server:
```bash
yarn dev
```

### Sign in with Phone Number
- Visit the app and sign in using your phone number
- Once authenticated, you can send and receive messages in the group chat

### Real-time Messaging
- Messages are displayed in real-time for all authenticated users
- New messages are automatically synchronized across all clients

## Contributing

Feel free to fork this project, create a branch, and submit a pull request for any improvements, fixes, or enhancements.

## License

This project is licensed under the MIT License.


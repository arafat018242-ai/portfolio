# Portfolio Website - Full Stack

A modern, full-featured portfolio website with complete CRUD functionality, built with Node.js, Express, Firebase, and vanilla JavaScript.

## ✨ Features

- 🎨 **Modern Premium UI** - Beautiful design with glassmorphism effects and smooth animations
- 📝 **Full CRUD Operations** - Manage projects, skills, about section, and contact messages
- 🖼️ **Image Upload** - Upload and manage images with Firebase Storage
- 🔐 **Secure Admin Panel** - Firebase Authentication for admin access
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🚀 **Real-time Updates** - Instant data synchronization with Firestore
- ⚡ **Fast & Scalable** - Built on Firebase infrastructure

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- Firebase Admin SDK
- Multer (file uploads)

### Database & Storage
- Firebase Firestore (NoSQL database)
- Firebase Storage (image hosting)
- Firebase Authentication (admin auth)

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Firebase Web SDK
- Modern ES6+ modules

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher) installed
- A Firebase account (free tier is sufficient)
- Basic knowledge of terminal/command line

## 🚀 Setup Instructions

### 1. Clone or Download the Project

The project is already set up in `c:\Users\HP\Downloads\portfolio`

### 2. Install Dependencies

```bash
cd c:\Users\HP\Downloads\portfolio
npm install
```

### 3. Firebase Project Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "my-portfolio")
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to you)
5. Click "Enable"

#### Enable Firebase Storage

1. Go to **Build** → **Storage**
2. Click "Get started"
3. Use default security rules
4. Click "Done"

#### Enable Firebase Authentication

1. Go to **Build** → **Authentication**
2. Click "Get started"
3. Click on "Email/Password" provider
4. Enable "Email/Password"
5. Click "Save"

#### Create Admin User

1. Still in Authentication, go to the "Users" tab
2. Click "Add user"
3. Enter your email and password
4. Click "Add user"
5. **Important:** Copy this email - you'll need it for the `.env` file

#### Get Firebase Service Account Key (Backend)

1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. Rename this file to `firebase-config.json`
5. Move it to the root of your project: `c:\Users\HP\Downloads\portfolio\firebase-config.json`

#### Get Firebase Web Config (Frontend)

1. Go to **Project Settings** → **General**
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app (give it a nickname)
5. Copy the `firebaseConfig` object

### 4. Configure Environment Variables

#### Create `.env` file

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

#### Edit `.env` file

Open `.env` and update:

```env
PORT=5000
NODE_ENV=development

# Replace with your Firebase project ID
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Replace with the admin email you created in Firebase Auth
ADMIN_EMAIL=admin@example.com
```

#### Update Frontend Firebase Config

Open `public/js/firebase-config.js` and replace the config with your values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📱 Usage

### Public Portfolio

Visit `http://localhost:5000` to see your portfolio website.

### Admin Panel

1. Go to `http://localhost:5000/admin/login.html`
2. Sign in with the email and password you created in Firebase Authentication
3. Manage your portfolio content:
   - **Dashboard**: Overview of your portfolio
   - **Projects**: Add, edit, delete projects with images
   - **Skills**: Manage your skills and proficiency levels
   - **About**: Edit your bio and social links
   - **Messages**: View contact form submissions

## 🔒 Security Notes

### Important Files to Keep Secret

**NEVER commit these files to Git:**
- `firebase-config.json` (service account key)
- `.env` (environment variables)

These are already in `.gitignore`, but double-check before pushing to GitHub.

### Firestore Security Rules

For production, update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /{document=**} {
      allow read: if true;
    }
    
    // Only authenticated admin can write
    match /{document=**} {
      allow write: if request.auth != null && request.auth.token.email == 'your-admin@email.com';
    }
  }
}
```

### Storage Security Rules

Update Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
portfolio/
├── public/                 # Frontend files
│   ├── admin/             # Admin dashboard
│   │   ├── css/
│   │   │   └── admin.css
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   ├── projects.html
│   │   ├── skills.html
│   │   ├── about.html
│   │   └── messages.html
│   ├── css/
│   │   └── style.css      # Main styles
│   ├── js/
│   │   ├── firebase-config.js
│   │   └── main.js
│   └── index.html         # Public portfolio
├── routes/                # API routes
│   ├── projects.js
│   ├── skills.js
│   ├── about.js
│   ├── contact.js
│   └── auth.js
├── services/
│   └── firebase.js        # Firebase initialization
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── upload.js         # File upload middleware
├── server.js             # Express server
├── package.json
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── firebase-config.json  # Firebase service account (download this)
└── .gitignore
```

## 🎨 Customization

### Change Colors

Edit `public/css/style.css` and modify the CSS variables:

```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --accent: #14b8a6;
  /* ... more colors */
}
```

### Update Personal Information

1. Log into the admin panel
2. Go to "About" section
3. Update your bio, profile image, and social links

## 🚀 Deployment

### Deploy to Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Deploy Backend

For the backend, you can use:
- **Heroku** (free tier available)
- **Railway** (easy deployment)
- **Render** (free tier available)
- **Google Cloud Run** (integrates well with Firebase)

## 🐛 Troubleshooting

### "Firebase config file not found"
- Make sure `firebase-config.json` is in the root directory
- Check that you downloaded the service account key correctly

### "Not authorized as admin"
- Verify the email in `.env` matches the Firebase Auth user
- Check that you're using the correct login credentials

### Images not uploading
- Verify Firebase Storage is enabled
- Check storage rules allow authenticated writes
- Ensure file size is under 5MB

### Port already in use
- Change the PORT in `.env` to a different number (e.g., 3000, 8080)

## 📝 API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/skills` - Get all skills
- `GET /api/about` - Get about information
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Require Authentication)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `PUT /api/about` - Update about section
- `GET /api/contact` - Get all messages
- `DELETE /api/contact/:id` - Delete message

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all Firebase services are enabled
3. Check browser console for errors
4. Ensure all environment variables are set correctly

---

**Built with ❤️ using Node.js, Express, and Firebase**

# DANTEKILLSTORM Portfolio Website

A modern, dynamic portfolio website for photographer and videographer DANTEKILLSTORM. Built with React and Firebase for a seamless, professional showcase of visual work.

## 🚀 Features

- **Modern Design**: Sleek, dark theme with gradient accents and smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Dynamic Gallery**: Filterable photo gallery with lightbox functionality
- **Video Showcase**: Professional video project display with external links
- **Admin Panel**: Easy content management for adding new photos and videos
- **Firebase Integration**: Real-time database and cloud storage
- **Contact Form**: Professional contact system for client inquiries
- **Smooth Animations**: Framer Motion powered transitions and effects

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Animations**: Framer Motion
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design patterns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dantekillstorm-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Storage
   - Enable Authentication (optional)
   - Copy your Firebase config and update `src/firebase.js`

4. **Update Firebase Configuration**
   ```javascript
   // src/firebase.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Firebase Setup

### Firestore Collections

Create these collections in your Firestore database:

1. **gallery**
   ```javascript
   {
     title: "string",
     description: "string",
     category: "string", // portrait, wedding, landscape, event
     url: "string", // image URL
     createdAt: "timestamp",
     likes: "number"
   }
   ```

2. **videos**
   ```javascript
   {
     title: "string",
     description: "string",
     category: "string", // Wedding, Corporate, Music, Event
     videoUrl: "string", // YouTube/Vimeo URL
     thumbnail: "string", // thumbnail image URL
     duration: "string", // e.g., "3:45"
     createdAt: "timestamp"
   }
   ```

### Storage Rules

Update your Firebase Storage rules:
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

### Firestore Rules

Update your Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Usage

### Admin Panel
- Navigate to `/admin` to access the content management system
- Add new photos to the gallery with categories and descriptions
- Add video projects with thumbnails and external links
- All content is automatically synced with Firebase

### Gallery Management
- Upload high-quality images for the best display
- Use descriptive titles and categories for better organization
- Images are automatically optimized for web display

### Video Management
- Add YouTube or Vimeo links for video projects
- Upload custom thumbnails for better presentation
- Include project descriptions and categories

## 🎨 Customization

### Colors
Update the color scheme in `src/App.css`:
```css
:root {
  --primary-color: #ff6b35;
  --secondary-color: #f7931e;
  --accent-color: #ffd700;
}
```

### Content
- Update personal information in `src/pages/About/About.js`
- Modify contact details in `src/components/Contact/Contact.js`
- Customize the hero section in `src/components/Hero/Hero.js`

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import project and deploy with zero configuration
- **AWS S3**: Upload build files to S3 bucket with CloudFront

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support or questions, please contact:
- Email: dante@killstorm.com
- Website: [Portfolio URL]

---

Built with ❤️ for visual storytelling
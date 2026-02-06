const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = require(path.join(__dirname, '../firebase-config.json'));
} catch (error) {
  console.error('Firebase config file not found. Please download your service account key from Firebase Console.');
  console.error('Save it as firebase-config.json in the root directory.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const auth = admin.auth();

// Helper function to upload file to Firebase Storage
async function uploadToStorage(file, folder = 'images') {
  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype
    }
  });

  // Make the file publicly accessible
  await fileUpload.makePublic();

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

// Helper function to delete file from Firebase Storage
async function deleteFromStorage(fileUrl) {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split(`${bucket.name}/`);
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await bucket.file(filePath).delete();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

module.exports = {
  admin,
  db,
  bucket,
  auth,
  uploadToStorage,
  deleteFromStorage
};

const express = require('express');
const router = express.Router();
const { db, uploadToStorage, deleteFromStorage } = require('../services/firebase');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get about data
router.get('/', async (req, res) => {
    try {
        const aboutSnapshot = await db.collection('about').limit(1).get();

        if (aboutSnapshot.empty) {
            return res.json({
                bio: '',
                profileImageUrl: '',
                resumeUrl: '',
                social: {
                    github: '',
                    linkedin: '',
                    twitter: '',
                    email: ''
                }
            });
        }

        const doc = aboutSnapshot.docs[0];
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({ error: 'Failed to fetch about data' });
    }
});

// Update about data (admin only)
router.put('/', verifyToken, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), async (req, res) => {
    try {
        const { bio, github, linkedin, twitter, email } = req.body;

        // Get existing about document or create new
        const aboutSnapshot = await db.collection('about').limit(1).get();
        let docRef;
        let currentData = {};

        if (aboutSnapshot.empty) {
            docRef = db.collection('about').doc();
        } else {
            docRef = aboutSnapshot.docs[0].ref;
            currentData = aboutSnapshot.docs[0].data();
        }

        let profileImageUrl = currentData.profileImageUrl || '';
        let resumeUrl = currentData.resumeUrl || '';

        // Handle profile image upload
        if (req.files && req.files.profileImage) {
            if (currentData.profileImageUrl) {
                await deleteFromStorage(currentData.profileImageUrl);
            }
            profileImageUrl = await uploadToStorage(req.files.profileImage[0], 'profile');
        }

        // Handle resume upload
        if (req.files && req.files.resume) {
            if (currentData.resumeUrl) {
                await deleteFromStorage(currentData.resumeUrl);
            }
            resumeUrl = await uploadToStorage(req.files.resume[0], 'resume');
        }

        const aboutData = {
            bio: bio || currentData.bio || '',
            profileImageUrl,
            resumeUrl,
            social: {
                github: github || (currentData.social && currentData.social.github) || '',
                linkedin: linkedin || (currentData.social && currentData.social.linkedin) || '',
                twitter: twitter || (currentData.social && currentData.social.twitter) || '',
                email: email || (currentData.social && currentData.social.email) || ''
            },
            updatedAt: new Date().toISOString()
        };

        if (aboutSnapshot.empty) {
            aboutData.createdAt = new Date().toISOString();
            await docRef.set(aboutData);
        } else {
            await docRef.update(aboutData);
        }

        res.json({ id: docRef.id, ...aboutData });
    } catch (error) {
        console.error('Error updating about data:', error);
        res.status(500).json({ error: 'Failed to update about data' });
    }
});

module.exports = router;

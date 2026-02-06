const express = require('express');
const router = express.Router();
const { auth } = require('../services/firebase');
const { verifyToken } = require('../middleware/auth');

// Verify Firebase ID token
router.post('/verify-token', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required' });
        }

        const decodedToken = await auth.verifyIdToken(idToken);

        // Check if user is admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (decodedToken.email !== adminEmail) {
            return res.status(403).json({ error: 'Not authorized as admin' });
        }

        res.json({
            success: true,
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Check authentication status
router.get('/check', verifyToken, async (req, res) => {
    res.json({
        authenticated: true,
        user: {
            uid: req.user.uid,
            email: req.user.email
        }
    });
});

module.exports = router;

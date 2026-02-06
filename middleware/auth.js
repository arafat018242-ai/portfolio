const { auth } = require('../services/firebase');

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(idToken);

        // Check if user is admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (decodedToken.email !== adminEmail) {
            return res.status(403).json({ error: 'Forbidden - Admin access required' });
        }

        // Attach user info to request
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
}

module.exports = { verifyToken };

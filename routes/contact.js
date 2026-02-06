const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');
const { verifyToken } = require('../middleware/auth');

// Get all contact messages (admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const messagesSnapshot = await db.collection('contacts')
            .orderBy('createdAt', 'desc')
            .get();

        const messages = [];
        messagesSnapshot.forEach(doc => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Submit contact form (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const contactData = {
            name,
            email,
            subject: subject || 'No subject',
            message,
            read: false,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('contacts').add(contactData);

        res.status(201).json({
            id: docRef.id,
            message: 'Message sent successfully',
            ...contactData
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

// Mark message as read (admin only)
router.patch('/:id/read', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('contacts').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await docRef.update({ read: true });

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
});

// Delete message (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('contacts').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await docRef.delete();

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;

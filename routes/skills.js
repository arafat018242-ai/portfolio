const express = require('express');
const router = express.Router();
const { db, uploadToStorage, deleteFromStorage } = require('../services/firebase');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skillsSnapshot = await db.collection('skills')
            .orderBy('order', 'asc')
            .get();

        const skills = [];
        skillsSnapshot.forEach(doc => {
            skills.push({ id: doc.id, ...doc.data() });
        });

        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// Create new skill (admin only)
router.post('/', verifyToken, upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, category, proficiency, order } = req.body;

        let iconUrl = '';
        if (req.files && req.files.icon) {
            iconUrl = await uploadToStorage(req.files.icon[0], 'skills/icons');
        }

        let certificateUrl = '';
        if (req.files && req.files.certificate) {
            certificateUrl = await uploadToStorage(req.files.certificate[0], 'skills/certificates');
        }

        const skillData = {
            name,
            category,
            proficiency: proficiency || 'Beginner',
            iconUrl,
            certificateUrl,
            order: parseInt(order) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection('skills').add(skillData);

        res.status(201).json({ id: docRef.id, ...skillData });
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});

// Update skill (admin only)
router.put('/:id', verifyToken, upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, category, proficiency, order } = req.body;

        const docRef = db.collection('skills').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        const currentData = doc.data();
        let iconUrl = currentData.iconUrl || '';
        let certificateUrl = currentData.certificateUrl || '';

        // Handle icon upload
        if (req.files && req.files.icon) {
            if (currentData.iconUrl) {
                await deleteFromStorage(currentData.iconUrl);
            }
            iconUrl = await uploadToStorage(req.files.icon[0], 'skills/icons');
        }

        // Handle certificate upload
        if (req.files && req.files.certificate) {
            if (currentData.certificateUrl) {
                await deleteFromStorage(currentData.certificateUrl);
            }
            certificateUrl = await uploadToStorage(req.files.certificate[0], 'skills/certificates');
        }

        const skillData = {
            name: name || currentData.name,
            category: category || currentData.category,
            proficiency: proficiency || currentData.proficiency,
            iconUrl,
            certificateUrl,
            order: order !== undefined ? parseInt(order) : currentData.order,
            updatedAt: new Date().toISOString()
        };

        await docRef.update(skillData);

        res.json({ id: req.params.id, ...skillData });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
});

// Delete skill (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('skills').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        await docRef.delete();

        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});

module.exports = router;

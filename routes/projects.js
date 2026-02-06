const express = require('express');
const router = express.Router();
const { db, uploadToStorage, deleteFromStorage } = require('../services/firebase');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projectsSnapshot = await db.collection('projects')
            .orderBy('order', 'asc')
            .get();

        const projects = [];
        projectsSnapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('projects').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create new project (admin only)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, technologies, liveUrl, githubUrl, featured, order } = req.body;

        // Upload image to Firebase Storage if provided
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToStorage(req.file, 'projects');
        }

        const projectData = {
            title,
            description,
            technologies: JSON.parse(technologies || '[]'),
            imageUrl,
            liveUrl: liveUrl || '',
            githubUrl: githubUrl || '',
            featured: featured === 'true',
            order: parseInt(order) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection('projects').add(projectData);

        res.status(201).json({ id: docRef.id, ...projectData });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project (admin only)
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, technologies, liveUrl, githubUrl, featured, order } = req.body;

        const docRef = db.collection('projects').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const currentData = doc.data();
        let imageUrl = currentData.imageUrl;

        // If new image is uploaded, delete old one and upload new
        if (req.file) {
            if (currentData.imageUrl) {
                await deleteFromStorage(currentData.imageUrl);
            }
            imageUrl = await uploadToStorage(req.file, 'projects');
        }

        const projectData = {
            title: title || currentData.title,
            description: description || currentData.description,
            technologies: technologies ? JSON.parse(technologies) : currentData.technologies,
            imageUrl,
            liveUrl: liveUrl !== undefined ? liveUrl : currentData.liveUrl,
            githubUrl: githubUrl !== undefined ? githubUrl : currentData.githubUrl,
            featured: featured !== undefined ? featured === 'true' : currentData.featured,
            order: order !== undefined ? parseInt(order) : currentData.order,
            updatedAt: new Date().toISOString()
        };

        await docRef.update(projectData);

        res.json({ id: req.params.id, ...projectData });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('projects').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projectData = doc.data();

        // Delete image from storage if exists
        if (projectData.imageUrl) {
            await deleteFromStorage(projectData.imageUrl);
        }

        await docRef.delete();

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;

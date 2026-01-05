const { internships } = require('../utils/mockData');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const mockInternships = internships;

exports.getAllInternships = async (req, res) => {
    try {
        const { remote, minStipend, location, limit = 20 } = req.query;

        // Use mock data directly
        let results = mockInternships;

        // Apply filters
        if (remote !== undefined) {
            results = results.filter(i => i.remote === (remote === 'true'));
        }
        if (minStipend) {
            results = results.filter(i => i.stipend >= parseFloat(minStipend));
        }
        if (location) {
            results = results.filter(i =>
                i.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Get internships error:', error);
        res.status(500).json({ error: 'Failed to fetch internships' });
    }
};

exports.searchInternships = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        let results = mockInternships.filter(int =>
            int.title.toLowerCase().includes(q.toLowerCase()) ||
            int.company.toLowerCase().includes(q.toLowerCase()) ||
            int.skills.some(skill => skill.toLowerCase().includes(q.toLowerCase()))
        );

        res.json({
            success: true,
            count: results.length,
            query: q,
            data: results
        });
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};

exports.getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = mockInternships.find(i => i.id === id) || mockInternships[0];

        res.json({
            success: true,
            data: internship
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch internship' });
    }
};

exports.saveInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const existing = await prisma.savedItem.findFirst({
            where: { userId, itemId: id, itemType: 'internship' }
        });

        if (existing) {
            return res.status(400).json({ error: 'Internship already saved' });
        }

        const savedItem = await prisma.savedItem.create({
            data: { userId, itemId: id, itemType: 'internship' }
        });

        res.json({
            success: true,
            message: 'Internship saved',
            data: savedItem
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save internship' });
    }
};

exports.applyForInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const application = await prisma.application.create({
            data: {
                userId,
                internshipId: id,
                status: 'applied'
            }
        });

        res.json({
            success: true,
            message: 'Application submitted',
            data: application
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to apply' });
    }
};

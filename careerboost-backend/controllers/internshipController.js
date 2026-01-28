const { internships } = require('../utils/mockData');
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

        res.json(results);
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

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};

exports.getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = mockInternships.find(i => i.id === id) || mockInternships[0];

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch internship' });
    }
};

exports.saveInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { savedItems } = require('../utils/mockData');

        // Avoid duplicates
        const alreadySaved = savedItems.find(it => it.userId === userId && it.itemId === id && it.itemType === 'internship');

        if (!alreadySaved) {
            savedItems.push({
                id: `save_i_${Date.now()}`,
                userId,
                itemId: id,
                itemType: 'internship',
                createdAt: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Internship saved',
            data: { userId, itemId: id, itemType: 'internship' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save internship' });
    }
};

exports.applyForInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { applications } = require('../utils/mockData');

        const newApp = {
            id: `app_${Date.now()}`,
            userId,
            internshipId: id,
            status: 'applied',
            appliedAt: new Date()
        };

        applications.push(newApp);

        res.json({
            success: true,
            message: 'Application submitted',
            applicationId: newApp.id,
            data: newApp
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to apply' });
    }
};

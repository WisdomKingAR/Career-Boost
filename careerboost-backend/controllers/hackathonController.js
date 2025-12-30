// Hackathon controller
const { hackathons, savedItems } = require('../utils/mockData');
const mockHackathons = hackathons;

exports.getAllHackathons = async (req, res) => {
    try {
        const { remote, limit = 20 } = req.query;
        let results = mockHackathons;

        if (remote !== undefined) {
            results = results.filter(h => h.remote === (remote === 'true'));
        }

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
};

exports.getUpcomingHackathons = async (req, res) => {
    try {
        const now = new Date();
        const results = mockHackathons.filter(h => new Date(h.startDate) > now);

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming hackathons' });
    }
};

exports.getHackathonById = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = mockHackathons.find(h => h.id === id) || mockHackathons[0];

        res.json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hackathon' });
    }
};

exports.saveHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const existing = savedItems.find(item => item.userId === userId && item.itemId === id && item.itemType === 'hackathon');

        if (existing) {
            return res.status(400).json({ error: 'Hackathon already saved' });
        }

        const savedItem = {
            id: `saved${savedItems.length + 1}`,
            userId,
            itemId: id,
            itemType: 'hackathon',
            createdAt: new Date()
        };
        savedItems.push(savedItem);

        res.json({
            success: true,
            message: 'Hackathon saved',
            data: savedItem
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save hackathon' });
    }
};

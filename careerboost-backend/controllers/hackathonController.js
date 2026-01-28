// Hackathon controller
const { hackathons } = require('../utils/mockData');
const mockHackathons = hackathons;

exports.getAllHackathons = async (req, res) => {
    try {
        const { remote, limit = 20 } = req.query;
        let results = mockHackathons;

        if (remote !== undefined) {
            results = results.filter(h => h.remote === (remote === 'true'));
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
};

exports.getUpcomingHackathons = async (req, res) => {
    try {
        const now = new Date();
        const results = mockHackathons.filter(h => new Date(h.startDate) > now);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming hackathons' });
    }
};

exports.getHackathonById = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = mockHackathons.find(h => h.id === id) || mockHackathons[0];

        res.json(hackathon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hackathon' });
    }
};

exports.saveHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { savedItems } = require('../utils/mockData');

        // Avoid duplicates
        const alreadySaved = savedItems.find(it => it.userId === userId && it.itemId === id && it.itemType === 'hackathon');

        if (!alreadySaved) {
            savedItems.push({
                id: `save_h_${Date.now()}`,
                userId,
                itemId: id,
                itemType: 'hackathon',
                createdAt: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Hackathon saved',
            data: { userId, itemId: id, itemType: 'hackathon' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save hackathon' });
    }
};

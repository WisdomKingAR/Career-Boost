// Hackathon controller
const { hackathons } = require('../utils/mockData');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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

        const existing = await prisma.savedItem.findFirst({
            where: { userId, itemId: id, itemType: 'hackathon' }
        });

        if (existing) {
            return res.status(400).json({ error: 'Hackathon already saved' });
        }

        const savedItem = await prisma.savedItem.create({
            data: { userId, itemId: id, itemType: 'hackathon' }
        });

        res.json({
            success: true,
            message: 'Hackathon saved',
            data: savedItem
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save hackathon' });
    }
};

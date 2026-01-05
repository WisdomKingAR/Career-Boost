const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { certificates: mockCertificates } = require('../utils/mockData');

// Get all certificates
exports.getAllCertificates = async (req, res) => {
    try {
        const { level, issuer, maxCost, limit = 20, offset = 0 } = req.query;

        // Build filter
        const where = {};
        if (level) where.level = level;
        if (issuer) where.issuer = { contains: issuer, mode: 'insensitive' };
        if (maxCost) where.cost = { lte: parseFloat(maxCost) };

        // TEMPORARY: Skip database, use mock data directly (no PostgreSQL setup)
        // let certificates = await prisma.certificate.findMany({
        //     where,
        //     take: parseInt(limit),
        //     skip: parseInt(offset),
        //     orderBy: { createdAt: 'desc' }
        // });

        // Use mock data
        let certificates = mockCertificates;

        if (level) {
            certificates = certificates.filter(c => (c.level || '').toLowerCase() === level.toLowerCase());
        }
        if (issuer) {
            certificates = certificates.filter(c =>
                (c.issuer || '').toLowerCase().includes(issuer.toLowerCase())
            );
        }
        if (maxCost) {
            certificates = certificates.filter(c => c.cost <= parseFloat(maxCost));
        }

        res.json({
            success: true,
            count: certificates.length,
            data: certificates
        });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
};

// Search certificates
exports.searchCertificates = async (req, res) => {
    try {
        const { q, level } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // TEMPORARY: Skip database, use mock data
        let certificates = mockCertificates.filter(cert =>
            (cert.name || '').toLowerCase().includes(q.toLowerCase()) ||
            (cert.issuer || '').toLowerCase().includes(q.toLowerCase()) ||
            (cert.skills || []).some(skill => (skill || '').toLowerCase().includes(q.toLowerCase()))
        );

        res.json({
            success: true,
            count: certificates.length,
            query: q,
            data: certificates
        });
    } catch (error) {
        console.error('Search certificates error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        const mockCert = mockCertificates.find(c => c.id === id) || mockCertificates[0];
        return res.json({
            success: true,
            data: mockCert
        });
    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({ error: 'Failed to fetch certificate' });
    }
};

// Save certificate
exports.saveCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const existing = await prisma.savedItem.findFirst({
            where: { userId, itemId: id, itemType: 'certificate' }
        });

        if (existing) {
            return res.status(400).json({ error: 'Certificate already saved' });
        }

        const savedItem = await prisma.savedItem.create({
            data: {
                userId,
                itemId: id,
                itemType: 'certificate'
            }
        });

        res.json({
            success: true,
            message: 'Certificate saved successfully',
            data: savedItem
        });
    } catch (error) {
        console.error('Save certificate error:', error);
        res.status(500).json({ error: 'Failed to save certificate' });
    }
};

// Unsave certificate
exports.unsaveCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.savedItem.deleteMany({
            where: { userId, itemId: id, itemType: 'certificate' }
        });

        res.json({
            success: true,
            message: 'Certificate removed from saved items'
        });
    } catch (error) {
        console.error('Unsave certificate error:', error);
        res.status(500).json({ error: 'Failed to unsave certificate' });
    }
};

const { certificates: mockCertificates } = require('../utils/mockData');

// Get all certificates
exports.getAllCertificates = async (req, res) => {
    try {
        const { level, issuer, maxCost, limit = 20, offset = 0 } = req.query;

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

        res.json(certificates);
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

        let certificates = mockCertificates.filter(cert =>
            (cert.name || '').toLowerCase().includes(q.toLowerCase()) ||
            (cert.issuer || '').toLowerCase().includes(q.toLowerCase()) ||
            (cert.skills || []).some(skill => (skill || '').toLowerCase().includes(q.toLowerCase()))
        );

        res.json(certificates);
    } catch (error) {
        console.error('Search certificates error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        const cert = mockCertificates.find(c => c.id === id) || mockCertificates[0];
        return res.json(cert);
    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({ error: 'Failed to fetch certificate' });
    }
};

// Save certificate (Mock Persistence)
exports.saveCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { savedItems } = require('../utils/mockData');

        // Avoid duplicates
        const alreadySaved = savedItems.find(it => it.userId === userId && it.itemId === id && it.itemType === 'certificate');

        if (!alreadySaved) {
            savedItems.push({
                id: `save_${Date.now()}`,
                userId,
                itemId: id,
                itemType: 'certificate',
                createdAt: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Certificate saved successfully',
            data: { userId, itemId: id, itemType: 'certificate' }
        });
    } catch (error) {
        console.error('Save certificate error:', error);
        res.status(500).json({ error: 'Failed to save certificate' });
    }
};

// Unsave certificate (Mock Persistence)
exports.unsaveCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const mockData = require('../utils/mockData');
        const index = mockData.savedItems.findIndex(it => it.userId === userId && it.itemId === id && it.itemType === 'certificate');

        if (index !== -1) {
            mockData.savedItems.splice(index, 1);
        }

        res.json({
            success: true,
            message: 'Certificate removed from saved items'
        });
    } catch (error) {
        console.error('Unsave certificate error:', error);
        res.status(500).json({ error: 'Failed to unsave certificate' });
    }
};

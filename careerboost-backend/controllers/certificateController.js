const { savedItems } = require('../utils/mockData');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// Mock data for certificates (can be replaced with real API/scraping)
const mockCertificates = [
    {
        name: "Google AI Essentials",
        issuer: "Google",
        url: "https://www.coursera.org/learn/google-ai-essentials",
        duration: 10,
        cost: 0,
        level: "beginner",
        skills: ["AI Fundamentals", "Machine Learning Basics", "Generative AI"],
        salaryImpact: "10-15% increase for entry-level AI roles",
        description: "Learn AI fundamentals from Google experts. Perfect for beginners looking to understand AI and its applications.",
        deadline: new Date('2025-12-31')
    },
    {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        duration: 40,
        cost: 100,
        level: "beginner",
        skills: ["Cloud Computing", "AWS Services", "Cloud Architecture"],
        salaryImpact: "15-20% increase for cloud roles",
        description: "Industry-recognized AWS certification for cloud computing fundamentals.",
        deadline: null
    },
    {
        name: "IBM Data Science Professional Certificate",
        issuer: "IBM",
        url: "https://www.coursera.org/professional-certificates/ibm-data-science",
        duration: 120,
        cost: 0,
        level: "intermediate",
        skills: ["Python", "Data Analysis", "Machine Learning", "SQL", "Data Visualization"],
        salaryImpact: "20-30% increase for data science roles",
        description: "Complete data science program covering Python, SQL, ML, and real-world projects.",
        deadline: null
    },
    {
        name: "Microsoft Azure AI Fundamentals",
        issuer: "Microsoft",
        url: "https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/",
        duration: 25,
        cost: 99,
        level: "beginner",
        skills: ["Azure", "AI Services", "Machine Learning", "Computer Vision"],
        salaryImpact: "12-18% increase",
        description: "Learn AI concepts and Azure AI services for building intelligent applications.",
        deadline: null
    },
    {
        name: "Deep Learning Specialization",
        issuer: "DeepLearning.AI",
        url: "https://www.coursera.org/specializations/deep-learning",
        duration: 80,
        cost: 49,
        level: "advanced",
        skills: ["Neural Networks", "Deep Learning", "TensorFlow", "CNN", "RNN"],
        salaryImpact: "30-40% increase for ML engineers",
        description: "Andrew Ng's comprehensive deep learning course covering neural networks and modern architectures.",
        deadline: null
    },
    {
        name: "NPTEL - Introduction to Machine Learning",
        issuer: "IIT Madras via NPTEL",
        url: "https://nptel.ac.in/courses/106106139",
        duration: 60,
        cost: 0,
        level: "intermediate",
        skills: ["Machine Learning", "Python", "Algorithms", "Mathematics"],
        salaryImpact: "15-25% increase",
        description: "Free Indian course from IIT Madras covering ML fundamentals with Indian context.",
        deadline: new Date('2025-06-30')
    },
    {
        name: "Google Cybersecurity Professional Certificate",
        issuer: "Google",
        url: "https://www.coursera.org/google-certificates/cybersecurity-certificate",
        duration: 100,
        cost: 0,
        level: "beginner",
        skills: ["Cybersecurity", "Network Security", "Linux", "Python", "Security Tools"],
        salaryImpact: "25-35% increase for security roles",
        description: "Job-ready cybersecurity program designed by Google with hands-on projects.",
        deadline: null
    },
    {
        name: "TensorFlow Developer Certificate",
        issuer: "TensorFlow",
        url: "https://www.tensorflow.org/certificate",
        duration: 60,
        cost: 100,
        level: "advanced",
        skills: ["TensorFlow", "Deep Learning", "Neural Networks", "Computer Vision", "NLP"],
        salaryImpact: "30-45% increase",
        description: "Official TensorFlow certification demonstrating ML engineering proficiency.",
        deadline: null
    }
];

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

        // Apply filters to mock data
        if (level) {
            certificates = certificates.filter(c => c.level === level);
        }
        if (issuer) {
            certificates = certificates.filter(c =>
                c.issuer.toLowerCase().includes(issuer.toLowerCase())
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
            cert.name.toLowerCase().includes(q.toLowerCase()) ||
            cert.issuer.toLowerCase().includes(q.toLowerCase()) ||
            cert.skills.some(skill => skill.toLowerCase().includes(q.toLowerCase()))
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

        // TEMPORARY: Skip database, return first mock cert
        const mockCert = mockCertificates[0];
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

        // Check if already saved
        const existing = savedItems.find(item => item.userId === userId && item.itemId === id && item.itemType === 'certificate');

        if (existing) {
            return res.status(400).json({ error: 'Certificate already saved' });
        }

        // Save item
        const savedItem = {
            id: `saved${savedItems.length + 1}`,
            userId,
            itemId: id,
            itemType: 'certificate',
            createdAt: new Date()
        };
        savedItems.push(savedItem);

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

        const index = savedItems.findIndex(item => item.userId === userId && item.itemId === id && item.itemType === 'certificate');

        if (index !== -1) {
            savedItems.splice(index, 1);
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

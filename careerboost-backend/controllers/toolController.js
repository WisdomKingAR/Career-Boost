// Tools controller
const { tools } = require('../utils/mockData');
const mockTools = tools;

exports.getAllTools = async (req, res) => {
    try {
        const { difficulty, category, freeTier } = req.query;

        let results = mockTools;

        if (difficulty) {
            results = results.filter(t => t.difficulty === difficulty);
        }
        if (category) {
            results = results.filter(t => t.category === category);
        }
        if (freeTier !== undefined) {
            results = results.filter(t => t.freeTier === (freeTier === 'true'));
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tools' });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const { level = 'beginner' } = req.query;

        const tools = mockTools.filter(t => t.difficulty === level);

        res.json(tools);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

exports.getToolsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const tools = mockTools.filter(t =>
            t.category.toLowerCase() === category.toLowerCase()
        );

        res.json(tools);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tools by category' });
    }
};

// Project controller
const { projects } = require('../utils/mockData');
const mockProjects = projects;

exports.getAllProjects = async (req, res) => {
    try {
        const { difficulty, limit = 10 } = req.query;

        let results = mockProjects;

        if (difficulty) {
            results = results.filter(p => p.difficulty === difficulty);
        }

        res.json({
            success: true,
            count: results.length,
            data: results.slice(0, parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = mockProjects.find(p => p.id === id) || mockProjects[0];

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

exports.generateProjectIdeas = async (req, res) => {
    try {
        const { skills = [], difficulty = 'beginner', interests = [] } = req.body;

        let results = mockProjects.filter(p => p.difficulty === difficulty);

        if (skills.length > 0) {
            results = results.filter(p =>
                p.techStack.some(tech =>
                    skills.some(skill =>
                        tech.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            );
        }

        res.json({
            success: true,
            message: `Generated project ideas for ${difficulty} level`,
            parameters: { skills, difficulty, interests },
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate project ideas' });
    }
};

exports.startProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Mock start project
        const userProject = {
            id: `up${Math.floor(Math.random() * 1000)}`,
            userId,
            projectId: id,
            status: 'planning',
            createdAt: new Date()
        };

        res.json({
            success: true,
            message: 'Project started! Good luck!',
            data: userProject
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start project' });
    }
};

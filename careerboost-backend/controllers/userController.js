// User controller
const { users, savedItems, applications } = require('../utils/mockData');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, bio, location, avatar } = req.body;

        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...(name && { name }),
            ...(bio && { bio }),
            ...(location && { location }),
            ...(avatar && { avatar })
        };

        const { password, ...userWithoutPassword } = users[userIndex];

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const userId = req.userId;
        const { skillName, proficiency = 'beginner' } = req.body;

        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.skills.some(s => s.name === skillName)) {
            return res.status(400).json({ error: 'Skill already exists' });
        }

        const skill = {
            id: `s${user.skills.length + 1}`,
            name: skillName,
            level: proficiency
        };
        user.skills.push(skill);

        res.json({
            success: true,
            message: 'Skill added successfully',
            data: skill
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add skill' });
    }
};

exports.removeSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.userId;

        const user = users.find(u => u.id === userId);
        if (user) {
            user.skills = user.skills.filter(s => s.id !== skillId);
        }

        res.json({
            success: true,
            message: 'Skill removed successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove skill' });
    }
};

exports.getSavedItems = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemType } = req.query;

        let results = savedItems.filter(item => item.userId === userId);
        if (itemType) {
            results = results.filter(item => item.itemType === itemType);
        }

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved items' });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const userId = req.userId;
        const userApps = applications.filter(app => app.userId === userId);

        res.json({
            success: true,
            count: userApps.length,
            data: userApps
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

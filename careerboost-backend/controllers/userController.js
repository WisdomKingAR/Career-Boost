// User controller using Mock Data
const { users } = require('../utils/mockData');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            ...userWithoutPassword,
            userId: user.id
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, username, email, bio, location, avatar } = req.body;

        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Update fields
        if (name !== undefined) users[userIndex].name = name;
        if (username !== undefined) users[userIndex].username = username;
        if (email !== undefined) users[userIndex].email = email;
        if (bio !== undefined) users[userIndex].bio = bio;
        if (location !== undefined) users[userIndex].location = location;
        if (avatar !== undefined) users[userIndex].avatar = avatar;

        const { password, ...userWithoutPassword } = users[userIndex];

        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const userId = req.userId;
        const { skillName, proficiency = 'beginner' } = req.body;

        const user = users.find(u => u.id === userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (!user.skills) user.skills = [];

        const existingSkill = user.skills.find(s => s.name === skillName);
        if (existingSkill) {
            return res.status(201).json({ success: true, data: existingSkill });
        }

        const newSkill = {
            id: `s${Date.now()}`,
            name: skillName,
            level: proficiency || req.body.level || 'beginner'
        };
        user.skills.push(newSkill);

        res.status(201).json({
            success: true,
            message: 'Skill added successfully',
            id: newSkill.id,
            ...newSkill
        });
    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({ success: false, error: 'Failed to add skill' });
    }
};

exports.removeSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.userId;

        const user = users.find(u => u.id === userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.skills) {
            user.skills = user.skills.filter(s => s.id !== skillId);
        }

        res.json({
            success: true,
            message: 'Skill removed successfully'
        });
    } catch (error) {
        console.error('Remove skill error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove skill' });
    }
};

exports.getSavedItems = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemType } = req.query;

        const { savedItems } = require('../utils/mockData');

        let results = savedItems.filter(it => it.userId === userId);

        if (itemType) {
            results = results.filter(it => it.itemType === itemType);
        }

        const flattened = results.map(it => ({
            ...it,
            id: it.itemId,
            category: it.itemType
        }));
        res.json(flattened);
    } catch (error) {
        console.error('Get saved items error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved items' });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const userId = req.userId;
        const { applications, internships } = require('../utils/mockData');

        const userApps = applications.filter(app => app.userId === userId);

        // Map internship details to applications
        const results = userApps.map(app => ({
            ...app,
            internship: internships.find(i => i.id === app.internshipId)
        }));

        const flattened = results.map(app => ({
            ...app,
            id: app.internshipId
        }));
        res.json(flattened);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
};

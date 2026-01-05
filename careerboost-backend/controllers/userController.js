// User controller using Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                skills: true,
                preferences: true
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, bio, location, avatar } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(bio && { bio }),
                ...(location && { location }),
                ...(avatar && { avatar })
            }
        });

        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const userId = req.userId;
        const { skillName, proficiency = 'beginner' } = req.body;

        const existingSkill = await prisma.userSkill.findUnique({
            where: {
                userId_skillName: {
                    userId,
                    skillName
                }
            }
        });

        if (existingSkill) {
            return res.status(400).json({ success: false, error: 'Skill already exists' });
        }

        const skill = await prisma.userSkill.create({
            data: {
                userId,
                skillName,
                proficiency
            }
        });

        res.json({
            success: true,
            message: 'Skill added successfully',
            data: skill
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

        await prisma.userSkill.deleteMany({
            where: {
                id: skillId,
                userId: userId
            }
        });

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

        const results = await prisma.savedItem.findMany({
            where: {
                userId,
                ...(itemType && { itemType })
            }
        });

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Get saved items error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved items' });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const userId = req.userId;
        const userApps = await prisma.application.findMany({
            where: { userId },
            include: {
                internship: true
            }
        });

        res.json({
            success: true,
            count: userApps.length,
            data: userApps
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
};

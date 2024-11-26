const { Teacher } = require('../models');

// Create a new teacher
async function createTeacher(req, res) {
    try {
        const { name, teacherId, subject } = req.body;

        if (!name || !teacherId || !subject) {
            return res.status(400).json({ error: 'Missing required fields: name, teacherId, or subject.' });
        }

        const newTeacher = new Teacher({
            name,
            teacherId,
            subject,
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher created successfully!', teacher: newTeacher });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create teacher.', details: error.message });
    }
}

// Edit an existing teacher
async function editTeacher(req, res) {
    try {
        const { id } = req.params; // Get teacher ID from URL
        const updates = req.body; // Get fields to update

        const updatedTeacher = await Teacher.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedTeacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        res.status(200).json({ message: 'Teacher updated successfully!', teacher: updatedTeacher });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update teacher.', details: error.message });
    }
}

// Delete a teacher
async function deleteTeacher(req, res) {
    try {
        const { id } = req.params;

        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully!', teacher: deletedTeacher });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete teacher.', details: error.message });
    }
}

module.exports = {
    createTeacher,
    editTeacher,
    deleteTeacher,
};

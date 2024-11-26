const { Student } = require('../models');

// Create a new student
async function createStudent(req, res) {
    try {
        const { name, studentId, class: studentClass } = req.body;

        if (!name || !studentId || !studentClass) {
            return res.status(400).json({ error: 'Missing required fields: name, studentId, or class.' });
        }

        const newStudent = new Student({
            name,
            studentId,
            class: studentClass,
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully!', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create student.', details: error.message });
    }
}

// Edit an existing student
async function editStudent(req, res) {
    try {
        const { id } = req.params; // Get student ID from URL
        const updates = req.body; // Get fields to update

        const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({ message: 'Student updated successfully!', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update student.', details: error.message });
    }
}

// Delete a student
async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({ message: 'Student deleted successfully!', student: deletedStudent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student.', details: error.message });
    }
}

module.exports = {
    createStudent,
    editStudent,
    deleteStudent,
};

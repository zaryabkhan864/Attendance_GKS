// controllers/attendanceController.js

const { Student, Teacher, Attendance } = require('../models');

// Check if a student has attended a specific teacher's class today
async function checkAttendance(req, res) {
    try {
        const { studentId, teacherName } = req.body;

        if (!studentId || !teacherName) {
            return res.status(400).json({ error: 'Missing required fields: studentId or teacherName' });
        }

        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const teacher = await Teacher.findOne({ teacherName });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            studentId: student._id,
            teacherId: teacher._id,
            date: { $gte: today }
        });

        if (!attendance) {
            return res.status(200).json({ message: `${student.name} has not attended ${teacher.teacherName}'s class today.` });
        }
        
        return res.status(200).json({ message: `${student.name} has already attended ${teacher.teacherName}'s class today.` });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

// Mark attendance for a student under a specific teacher
async function markAttendance(req, res) {
    try {
        const { studentId, teacherName, status } = req.body;

        if (!studentId || !teacherName || !status) {
            return res.status(400).json({ error: 'Missing required fields: studentId, teacherName, or status' });
        }

        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const teacher = await Teacher.findOne({ teacherName });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        const attendance = new Attendance({
            studentId: student._id,
            teacherId: teacher._id,
            status
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully.' });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

// List all students assigned to a specific teacher
async function listStudentsByTeacher(req, res) {
    try {
        const { teacherName } = req.params;

        const teacher = await Teacher.findOne({ teacherName }).populate('students');
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        res.status(200).json({ students: teacher.students });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = {
    checkAttendance,
    markAttendance,
    listStudentsByTeacher
};

const { Student, Attendance } = require('../models');

// Check if a student has marked attendance today
async function checkAttendance(req, res) {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ error: 'Missing required field: studentId' });
        }

        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            studentId: student._id,
            date: { $gte: today }
        });

        if (!attendance) {
            return res.status(200).json({ message: `${student.name} has not marked attendance today.` });
        }

        return res.status(200).json({ message: `${student.name} has already marked attendance today.` });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

// Mark attendance for a student
async function markAttendance(req, res) {
    try {
        const { studentId, status } = req.body;

        if (!studentId || !status) {
            return res.status(400).json({ error: 'Missing required fields: studentId or status' });
        }

        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const attendance = new Attendance({
            studentId: student._id,
            status,
            date: new Date()
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully.' });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

// List all attendance records for a specific student
async function listAttendanceForStudent(req, res) {
    try {
        const { studentId } = req.params;

        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const attendanceRecords = await Attendance.find({ studentId: student._id });

        res.status(200).json({ student: student.name, attendance: attendanceRecords });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = {
    checkAttendance,
    markAttendance,
    listAttendanceForStudent
};

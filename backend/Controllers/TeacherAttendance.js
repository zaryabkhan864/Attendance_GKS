const { Teacher, Attendance } = require('../models');

// Mark attendance for a teacher
async function markTeacherAttendance(req, res) {
    try {
        const { teacherId, status } = req.body;

        if (!teacherId || !status) {
            return res.status(400).json({ error: 'Missing required fields: teacherId or status.' });
        }

        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day

        const existingAttendance = await Attendance.findOne({
            teacherId: teacher._id,
            date: { $gte: today },
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance for this teacher has already been marked today.' });
        }

        const attendance = new Attendance({
            teacherId: teacher._id,
            status,
            date: new Date(),
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully!', attendance });
    } catch (error) {
        res.status(500).json({ error: 'Server Error.', details: error.message });
    }
}

// Check attendance status for a teacher today
async function checkTeacherAttendance(req, res) {
    try {
        const { teacherId } = req.params;

        if (!teacherId) {
            return res.status(400).json({ error: 'Missing required field: teacherId.' });
        }

        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day

        const attendance = await Attendance.findOne({
            teacherId: teacher._id,
            date: { $gte: today },
        });

        if (!attendance) {
            return res.status(200).json({ message: `No attendance marked for ${teacher.name} today.` });
        }

        res.status(200).json({
            message: `Attendance for ${teacher.name} has already been marked today.`,
            attendance,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error.', details: error.message });
    }
}

// Get all attendance records for a teacher
async function getTeacherAttendance(req, res) {
    try {
        const { teacherId } = req.params;

        if (!teacherId) {
            return res.status(400).json({ error: 'Missing required field: teacherId.' });
        }

        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        const attendanceRecords = await Attendance.find({ teacherId: teacher._id });

        res.status(200).json({
            message: `Attendance records for ${teacher.name}.`,
            attendance: attendanceRecords,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error.', details: error.message });
    }
}

module.exports = {
    markTeacherAttendance,
    checkTeacherAttendance,
    getTeacherAttendance,
};

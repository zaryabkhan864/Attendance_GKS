// models
const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: String,
    studentId: { type: String, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});
const teacherSchema = new mongoose.Schema({
    teacherName: String,
    subject: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    date: { type: Date, default: Date.now },
    status: String
});

const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { Student, Teacher, Attendance };

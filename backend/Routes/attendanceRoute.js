const express = require('express');
const mongoose = require('mongoose');
const { Student, Teacher, Attendance } = require('./models'); // Import models from models.js

const app = express();

app.use(express.json());

// mongodb running on the default self host port
mongoose.connect('mongodb://localhost:27017/attendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.post('/attendance/check', async (req, res) => {
    try {
        const { studentId, teacherName } = req.body;

        // Validate the received data
        if (!studentId || !teacherName) {
            return res.status(400).json({ error: 'Missing required fields: studentId or teacherName' });
        }

        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const teacher = await Teacher.findOne({ teacherName });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the start of the day
        const attendance = await Attendance.findOne({
            studentId: student._id,
            teacherId: teacher._id,
            date: { $gte: today }
        });

        if (!attendance) {
            return res.status(200).json({ message: `${student.name} has not attended ${teacher.teacherName}'s class today.` });
        } else {
            return res.status(200).json({ message: `${student.name} has already attended ${teacher.teacherName}'s class today.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

async function createTeacher() {
    try {
        const teacher = new Teacher({
            teacherName: 'Ms. Smith',
            subject: 'Information Technology'
        });

        const student1 = new Student({ name: 'Noor', studentId: 'S12345', teacherId: teacher._id });
        const student2 = new Student({ name: 'Zayn', studentId: 'S12346', teacherId: teacher._id });

        teacher.students.push(student1, student2);

        await teacher.save();
        await student1.save();
        await student2.save();

        console.log('Teacher and students saved to MongoDB.');
    } catch (err) {
        console.error('Error creating teacher and students:', err);
    }
}

createTeacher();

// enables the server, change port later
app.listen(3000, () => {
    console.log('server is running');
});

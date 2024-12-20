const express = require('express');
const upload = require('../config/multer');
const tcController = require('../controllers/tcController');

const router = express.Router();

// **Student Routes**
// Route to get all students
router.get('/students', tcController.getStudents);

// Route to get a single student by ID
router.get('/students/:studentId', tcController.getStudent);

// Route to create a new student
router.post('/students', upload.single('TC'), tcController.createStudent);

// Route to update an existing student's details and file
router.put('/students/:studentId', upload.single('TC'), tcController.updateStudent);

// Route to delete a student and clean up their file
router.delete('/students/:studentId', tcController.deleteStudent);

router.get('/student/:studentId/view', tcController.viewStudentTC);

// **Class Routes**
// Route to get all classes
router.get('/classes', tcController.getClasses);

// Route to get a single class by ID
router.get('/classes/:classId', tcController.getClass);

// Route to create a new class
router.post('/classes', tcController.createClass);

// Route to update an existing class
router.put('/classes/:classId', tcController.updateClass);

// Route to delete a class
router.delete('/classes/:classId', tcController.deleteClass);

// **Session Routes**
// Route to get all sessions
router.get('/sessions', tcController.getSessions);

// Route to get a single session by ID
router.get('/sessions/:sessionId', tcController.getSession);

// Route to create a new session
router.post('/sessions', tcController.createSession);

// Route to update an existing session
router.put('/sessions/:sessionId', tcController.updateSession);

// Route to delete a session
router.delete('/sessions/:sessionId', tcController.deleteSession);

// **Additional Route**
// Route to get all classes, sessions, and students (Example route, if needed)
router.get('/', tcController.getAllClassesSessionsStudents);

module.exports = router;

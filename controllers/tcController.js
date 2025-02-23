const sharp = require('sharp');

async function resizeFile(fileBuffer, mimetype) {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    // Check if it's an image file based on mimetype
    if (!mimetype.startsWith('image')) {
        // Handle non-image file (e.g., reject or compress using a different method)
        return fileBuffer;
    }

    if (fileBuffer.length > MAX_SIZE_BYTES) {
        const compressedBuffer = await sharp(fileBuffer)
            .resize({ width: 1024 })  // Resize width to 1024px (adjustable)
            .toBuffer();
        
        return compressedBuffer;
    }
    return fileBuffer;
}



const Class = require('../models/tc/class');
const Session = require('../models/tc/session');
const Student = require('../models/tc/student');


async function getAllClassesSessionsStudents(req, res) {
    try {
        // Fetch all classes, sessions, and students
        const classes = await Class.find().populate('sessionId').exec();
        const sessions = await Session.find();
        const students = await Student.find().populate('classId').exec();
        // Render the view and pass the data
        res.render('Admin/tcadmin', { classes, sessions, students });
    } catch (err) {
        console.error('Error loading Classes, Sessions, and Students data:', err);
        res.status(500).send('Error loading Classes, Sessions, and Students data');
    }
}

// -------------- Class Controller --------------

// Create a new class for a session
async function createClass(req, res) {
    try {
        const { className, sessionId } = req.body;
        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        const newClass = new Class({
            className,
            sessionId,
        });

        await newClass.save();
        res.redirect('/Admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all classes
async function getClasses(req, res) {
    try {
        const classes = await Class.find().populate('sessionId');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single class by ID
async function getClass(req, res) {
    try {
        const classObj = await Class.findById(req.params.classId).populate('sessionId');
        if (!classObj) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(classObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a class
async function updateClass(req, res) {
    try {
        const { className, sessionId } = req.body;

        const classObj = await Class.findById(req.params.classId);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        classObj.className = className || classObj.className;
        classObj.sessionId = sessionId || classObj.sessionId;

        await classObj.save();
        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a class
async function deleteClass(req, res) {
    try {
        const classObj = await Class.findByIdAndDelete(req.params.classId);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// -------------- Session Controller --------------

// Create a new session
async function createSession(req, res) {
    try {
        const { year } = req.body;

        const newSession = new Session({
            year,
        });

        await newSession.save();
        res.status(201).redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all sessions
async function getSessions(req, res) {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single session by ID
async function getSession(req, res) {
    try {
        const session = await Session.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a session
async function updateSession(req, res) {
    try {
        const { year } = req.body;

        const session = await Session.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        session.year = year || session.year;

        await session.save();
        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a session
async function deleteSession(req, res) {
    try {
        const session = await Session.findByIdAndDelete(req.params.sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// -------------- Student Controller --------------

// Create a new student with a file upload
async function createStudent(req, res) {
    try {
        const { classId, student_name } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Validate classId
        const classObj = await Class.findById(classId);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        const compressedFileBuffer = await resizeFile(file.buffer, file.mimetype);

        // Create a new student instance
        const newStudent = new Student({
            student_name,
            classId,  // Reference to the class
            TC: {
                data: compressedFileBuffer, // Store the file buffer
                contentType: file.mimetype, // Store the MIME type
            },
        });

        // Save the student
        await newStudent.save();
        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all students
async function getStudents(req, res) {
    try {
        const students = await Student.find().populate('classId');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single student by ID
async function getStudent(req, res) {
    try {
        const student = await Student.findById(req.params.studentId).populate('classId');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update student information (including file)
async function updateStudent(req, res) {
    try {
        const { student_name, classId } = req.body;
        const studentId = req.params.studentId;
        const file = req.file;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Validate classId
        const classObj = await Class.findById(classId);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        // Update student file if a new one is provided
        if (file) {
            const compressedFileBuffer = await resizeFile(file.buffer, file.mimetype);
            student.TC.data = compressedFileBuffer;
            student.TC.contentType = file.mimetype;
        }

        // Update student info
        if (student_name) student.student_name = student_name;
        student.classId = classId;

        await student.save();
        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a student
async function deleteStudent(req, res) {
    try {
        const student = await Student.findByIdAndDelete(req.params.studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.redirect('/admin/tc');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// View the uploaded TC (Transfer Certificate) for a student
async function viewStudentTC(req, res) {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the student has a TC file
        if (!student.TC || !student.TC.data) {
            return res.status(404).json({ message: 'No TC file uploaded for this student' });
        }

        // Set appropriate headers for file download or display
        res.setHeader('Content-Type', student.TC.contentType);
        res.setHeader('Content-Disposition', 'inline; filename="TC-' + student.student_name + '.' + student.TC.contentType.split('/')[1] + '"');
        res.send(student.TC.data);  // Send the file buffer
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAllClassesSessionsStudents,
    // Class Functions
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass,

    // Session Functions
    createSession,
    getSessions,
    getSession,
    updateSession,
    deleteSession,

    // Student Functions
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    viewStudentTC
};

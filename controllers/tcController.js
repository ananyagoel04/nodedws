const sharp = require("sharp");

const Class = require("../models/tc/class");
const Session = require("../models/tc/session");
const Student = require("../models/tc/student");

const uploadToR2 = require("../utils/uploadToR2");
const r2 = require("../utils/r2");

const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const TC_BASE_URL = "https://tc.divinewisdom.edu.in";

// ---------------- FILE RESIZE ----------------

async function resizeFile(fileBuffer, mimetype) {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (!mimetype.startsWith("image")) {
    return fileBuffer;
  }

  if (fileBuffer.length > MAX_SIZE_BYTES) {
    return await sharp(fileBuffer).resize({ width: 1024 }).toBuffer();
  }

  return fileBuffer;
}

// ---------------- DASHBOARD ----------------

async function getAllClassesSessionsStudents(req, res) {
  try {
    const classes = await Class.find().populate("sessionId").exec();

    const sessions = await Session.find();

    const students = await Student.find()
      .select("-__v")
      .populate({
        path: "classId",
        populate: {
          path: "sessionId",
          model: "Session",
        },
      })
      .exec();

    res.render("Admin/tcadmin", {
      classes,
      sessions,
      students,
    });
  } catch (err) {
    console.error("Error loading data:", err);
    res.status(500).send("Error loading data");
  }
}

// ================= CLASS CONTROLLER =================

async function createClass(req, res) {
  try {
    let { className, sessionId } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    className = className.trim().toUpperCase();

    await Class.create({
      className,
      sessionId,
    });

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getClasses(req, res) {
  try {
    const classes = await Class.find().populate("sessionId");

    res.json(classes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getClass(req, res) {
  try {
    const classObj = await Class.findById(req.params.classId).populate(
      "sessionId",
    );

    if (!classObj) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json(classObj);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateClass(req, res) {
  try {
    const { className, sessionId } = req.body;

    const classObj = await Class.findById(req.params.classId);

    if (!classObj) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (className) {
      classObj.className = className.trim().toUpperCase();
    }

    if (sessionId) {
      classObj.sessionId = sessionId;
    }

    await classObj.save();

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteClass(req, res) {
  try {
    await Class.findByIdAndDelete(req.params.classId);

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// ================= SESSION CONTROLLER =================

async function createSession(req, res) {
  try {
    await Session.create({
      year: req.body.year,
    });

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getSessions(req, res) {
  try {
    res.json(await Session.find());
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getSession(req, res) {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateSession(req, res) {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.year = req.body.year || session.year;

    await session.save();

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteSession(req, res) {
  try {
    await Session.findByIdAndDelete(req.params.sessionId);

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// ================= STUDENT CONTROLLER =================

async function createStudent(req, res) {
  try {
    const { classId, student_name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const classObj = await Class.findById(classId);

    if (!classObj) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const buffer = await resizeFile(file.buffer, file.mimetype);

    const tcKey = await uploadToR2(buffer, file.mimetype, student_name);

    const tcUrl = `${TC_BASE_URL}/${tcKey}`;

    await Student.create({
      student_name,
      classId,
      tcKey,
      tcUrl,
    });

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getStudents(req, res) {
  try {
    const students = await Student.find().select("-__v").populate("classId");

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getStudent(req, res) {
  try {
    const student = await Student.findById(req.params.studentId).populate(
      "classId",
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateStudent(req, res) {
  try {
    const { student_name, classId } = req.body;
    const file = req.file;

    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (classId) {
      student.classId = classId;
    }

    if (student_name) {
      student.student_name = student_name;
    }

    if (file) {
      if (student.tcKey) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: student.tcKey,
          }),
        );
      }

      const buffer = await resizeFile(file.buffer, file.mimetype);

      const tcKey = await uploadToR2(
        buffer,
        file.mimetype,
        student.student_name,
      );

      student.tcKey = tcKey;
      student.tcUrl = `${TC_BASE_URL}/${tcKey}`;
    }

    await student.save();

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteStudent(req, res) {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.tcKey) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: student.tcKey,
        }),
      );
    }

    await Student.findByIdAndDelete(req.params.studentId);

    res.redirect("/admin/tc");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// ================= VIEW FILE =================

async function viewStudentTC(req, res) {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student || !student.tcUrl) {
      return res.status(404).json({
        message: "TC not found",
      });
    }

    return res.redirect(student.tcUrl);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getAllClassesSessionsStudents,

  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,

  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,

  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  viewStudentTC,
};

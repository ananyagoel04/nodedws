const express = require('express');
const mongoose = require('mongoose');
const { Homeimg, VisionMission, Environment, Teacher, Program, Review } = require('../models/home');
const { AboutImage, Message } = require('../models/about');
const Student = require('../models/tc/student');
const Class = require('../models/tc/class');
const Session = require('../models/tc/session');
const router = express.Router();
const tcController = require('../controllers/tcController');




router.get("/login", (req, res) => {
  const { errorMessage } = req.query;
  res.render("login", { errorMessage });
});

// Home route - render index.ejs and pass data
router.get('/', async (req, res) => {
  try {
    // Fetch data from MongoDB collections
    const homeimgData = await Homeimg.find({});
    const visionMissionData = await VisionMission.find({});
    const environmentData = await Environment.find({});
    const teacherData = await Teacher.find({});
    const programData = await Program.find({});
    const reviewData = await Review.find({});

    // Render the index.ejs and pass the data
    res.render('index', {
      homeimgData,
      visionMissionData,
      environmentData,
      teacherData,
      programData,
      reviewData
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/about', async (req, res) => {
  try {
    const aboutImages = await AboutImage.find({});
    const messages = await Message.find({});
    const { successMessage, errorMessage } = req.query;
    res.render('About', {
      aboutImages,
      messages,
      successMessage,
      errorMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tc', async (req, res) => {
  try {
    // Fetch all data from MongoDB collections
    const students = await Student.find().populate('classId').exec();
    const sessions = await Session.find();
    const classes = await Class.find().populate('sessionId').exec();
    // Render the 'tc' view and pass the data
    res.render('Tc', {
      students,   // Pass student data
      sessions,   // Pass session data
      classes     // Pass class data
    });
  } catch (err) {
    console.error('Error fetching data for TC:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/student/:studentId/view', tcController.viewStudentTC);

router.get('/class_students/:id', async (req, res) => {
  try {
    // Get the class ID from the request params
    const classId = req.params.id;

    // Fetch the class details using the classId
    const cls = await Class.findById(classId).populate('sessionId').exec();
    
    if (!cls) {
      return res.status(404).send('Class not found');
    }

    // Fetch all students that belong to this class (using classId)
    const students = await Student.find({ classId: classId }).exec();
    
    // Fetch all sessions (optional, if needed in the view)
    const sessions = await Session.find();
    
    // Render the 'class_students' view and pass the data
    res.render('class_students', {
      students,  // Pass the students data
      sessions,  // Pass session data (optional)
      cls        // Pass the class details
    });
  } catch (err) {
    console.error('Error fetching data for class students:', err);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/admissions', async (req, res) => {
  try {
    res.render('admissions');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/Infrastructure', async (req, res) => {
  try {
    res.render('Infrastructure');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/Club', async (req, res) => {
  try {
    res.render('Clubs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/Cbse', async (req, res) => {
  try {
    res.render('Cbse');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/parent', async (req, res) => {
  try {
    res.render('parent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/contact', async (req, res) => {
  try {
    res.render('contactus');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});






router.get('/PersonalGrowthandDevelopment', async (req, res) => {
  try {
    res.render('Programs/PersonalGrowthandDevelopment');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/PrepareforOccupation', async (req, res) => {
  try {
    res.render('Programs/PrepareforOccupation');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/EffectiveInterpersonalSkills', async (req, res) => {
  try {
    res.render('Programs/EffectiveInterpersonalSkills');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/EffectiveCommunicationSkills', async (req, res) => {
  try {
    res.render('Programs/EffectiveCommunicationSkills');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/DeepenedSpiritualValues', async (req, res) => {
  try {
    res.render('Programs/DeepenedSpiritualValues');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/IntellectualGrowth', async (req, res) => {
  try {
    res.render('Programs/IntellectualGrowth');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/RespondAesthetically', async (req, res) => {
  try {
    res.render('Programs/RespondAesthetically');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/SocialResponsibility', async (req, res) => {
  try {
    res.render('Programs/SocialResponsibility');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

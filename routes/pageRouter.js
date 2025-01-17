const express = require('express');
const mongoose = require('mongoose');
const { Homeimg, VisionMission, Environment, Teacher, Program, Review } = require('../models/home');
const { AboutImage, Message } = require('../models/about');
const Student = require('../models/tc/student');
const Class = require('../models/tc/class');
const Session = require('../models/tc/session');
const { Gallery, Maingallery } = require('../models/gallery');
const Event = require('../models/event');
const News = require('../models/news');
const Ad = require('../models/ad');
const router = express.Router();
const tcController = require('../controllers/tcController');
const upload = require('../config/multer');
const transporter = require('../config/mailService');

router.post('/send-resume', upload.single('Resume'), async (req, res) => {
  try {
    // Extract form data
    const { Name, Email, Phone, Message } = req.body;
    const resumeFile = req.file;

    // Validate required fields
    if (!Name || !Email || !resumeFile) {
      return res.redirect('/about?errorMessage=All fields are required.');
    }

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address (from the environment variable)
      to: `${Email}`,
      bcc: 'principaldws08@gmail.com, management@divinewisdomschool.in',
      subject: 'Resume Submitted',
      html: `
        <h3>Thank you for submitting your resume!</h3>
        <p>Name: ${Name}</p>
        <p>Email: ${Email}</p>
        <p>Phone: ${Phone}</p>
        <p>Message: ${Message}</p>
      `,
      attachments: [
        {
          filename: resumeFile.originalname,
          content: resumeFile.buffer,
          encoding: 'base64',
        },
      ],
    };

    // Send email using the transporter from mailservice.js
    await transporter.sendMail(mailOptions);

    // Redirect with success message
    res.redirect('/about?successMessage=Your resume has been submitted successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/message-send', async (req, res) => {
  try {
    // Extract form data
    const { Name, Email, Phone, Message } = req.body;

    // Validate required fields
    if (!Name || !Email || !Message || !Phone) {
      return res.redirect('/contact?errorMessage=All fields are required.');
    }

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address (from the environment variable)
      to: 'info@divinewisdom.edu.in', // You can add a specific email to receive the message
      bcc: 'management@divinewisdomschool.in, receptiondivinewisdom@gmail.com', // You can add other emails here
      subject: 'New Message from Website',
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Phone:</strong> ${Phone}</p>
        <p><strong>Message:</strong> ${Message}</p>
      `,
    };

    // Send the email using the transporter from mailService.js
    await transporter.sendMail(mailOptions);

    // Redirect with success message
    res.redirect('/contact?successMessage=Your message has been sent successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});





router.get("/login", (req, res) => {
  const { errorMessage } = req.query;
  res.render("login", { errorMessage });
});

// Home route - render index.ejs and pass data
router.get('/', async (req, res) => {
  try {
    if (!req.cookies.cookieConsent) {
      res.cookie('cookieConsent', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    }

    // Fetch data
    const homeimgData = await Homeimg.find({}).select('-image');
    const visionMissionData = await VisionMission.find({}).select('-image');
    const environmentData = await Environment.find({}).select('-image');
    const teacherData = await Teacher.find({}).select('-image');
    // const programData = await Program.find({});
    // const reviewData = await Review.find({});

    let randomAd = null;

    // // Fetch a random ad if not already seen
    // if (!req.session.adSeen) {
    //   randomAd = await Ad.aggregate([{ $sample: { size: 1 } }]);
    //   randomAd = randomAd[0] || null;

    //   if (randomAd) {
    //     req.session.adSeen = true;
    //   }
    // }

    res.render('index', {
      homeimgData,
      visionMissionData,
      environmentData,
      teacherData,
      randomAd,
      cookieConsent: req.cookies.cookieConsent,
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

router.get('/gallery', async (req, res) => {
  try {
    // Fetch all data from MongoDB collections
    const galleryItems = await Gallery.find({});
    const maingalleryItems = await Maingallery.find({});
    res.render('gallery', {
      galleryItems,
      maingalleryItems,
    });
  } catch (err) {
    console.error('Error fetching data for Gallery', err);
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
    const homeimgData = await Homeimg.find({}).select('_id');
    res.render('admissions',{homeimgData});
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
    const events = await Event.find();
    const news = await News.find().sort({ createdAt: -1 });
    res.render('parent', { events, news });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/contact', async (req, res) => {
  try {
    const { successMessage, errorMessage } = req.query;
    res.render('contactus', {
      successMessage,
      errorMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error contact us not found');
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

router.get('/privacypolicy', async (req, res) => {
  try {
    res.render('privacypolicy');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/faqs', async (req, res) => {
  try {
    res.render('faqs');
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

router.get('/article', (req, res) => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "DWS - COMMITTED TO EXCELLENCE IN EDUCATION",
    "description": "DWS - A School Committed to Excellence in Education. Offering a comprehensive curriculum and nurturing environment for students.",
    "author": {
      "@type": "Organization",
      "name": "Divine Wisdom School",
      "url": "https://www.divinewisdom.edu.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://divinewisdom.edu.in/icons/logo.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Divine Wisdom School",
      "logo": {
        "@type": "ImageObject",
        "url": "https://divinewisdom.edu.in/icons/logo.png"
      }
    },
    "datePublished": "2025-01-01T08:00:00+00:00", // Ensure correct date
    "dateModified": "2023-01-03T08:00:00+00:00", // Optional, only include if modified
    "image": "https://divinewisdom.edu.in/path/to/article-image.jpg", // Ideally, host image on your own domain
    "mainEntityOfPage": "https://www.divinewisdom.edu.in/article/dws-committed-to-excellence", // Link to the article's page
    "keywords": "education, school, excellence, curriculum, DWS, Divine Wisdom School" // Optional but useful for SEO
  };

  res.render('article', { schemaMarkup });
});

module.exports = router;
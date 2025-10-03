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
const cookieParser = require('cookie-parser');
const router = express.Router();
const tcController = require('../controllers/tcController');
const upload = require('../config/multer');
const transporter = require('../config/mailService');
const rateLimit = require('express-rate-limit');
const newsletterController = require('../controllers/newsletterController');


const publicSubscribeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5,              // limit each IP to 5 requests per windowMs
  message: 'Too many subscription attempts from this IP, please try again later.'
});

const resumeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many submissions from this IP, please try again later."
});
const messageRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many submissions from this IP, please try again later."
});


router.post('/send-resume', resumeRateLimiter, upload.single('Resume'), async (req, res) => {
  try {
    const {
      Name,
      Email,
      Phone,
      Message,
      captchaAnswer,
      captchaNum1,
      captchaNum2,
      website
    } = req.body;

    const resumeFile = req.file;

    if (website && website.trim() !== '') {
      return res.redirect('/about?errorMessage=Spam detected.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.redirect('/about?errorMessage=Invalid email address.');
    }

    const expectedAnswer = parseInt(captchaNum1) + parseInt(captchaNum2);
    if (parseInt(captchaAnswer) !== expectedAnswer) {
      return res.redirect('/about?errorMessage=CAPTCHA is incorrect.');
    }

    if (!Name || !Email || !Phone || !resumeFile) {
      return res.redirect('/about?errorMessage=All required fields must be filled.');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${Email}`,
      bcc: 'principal@divinewisdom.edu.in, management@divinewisdomschool.in',
      subject: 'Resume Submitted',
      html: `
        <h3>Thank you for submitting your resume!</h3>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Phone:</strong> ${Phone}</p>
        <p><strong>Message:</strong> ${Message}</p>
      `,
      attachments: [
        {
          filename: resumeFile.originalname,
          content: resumeFile.buffer,
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.redirect('/about?successMessage=Your resume has been submitted successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/message-send', messageRateLimiter, async (req, res) => {
  try {
    const {
      Name,
      Email,
      Phone,
      Message,
      website,
      formStartTime
    } = req.body;

    // Honeypot field - must be empty
    if (website && website.trim() !== '') {
      return res.redirect('/contact?errorMessage=Spam detected.');
    }

    // Time check - at least 3 seconds must have passed
    const submittedAt = Date.now();
    const formStartedAt = parseInt(formStartTime, 10);
    if (!formStartedAt || submittedAt - formStartedAt < 3000) {
      return res.redirect('/contact?errorMessage=Form submitted too quickly. Possible bot.');
    }

    // Basic validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.redirect('/contact?errorMessage=Invalid email format.');
    }

    if (!Name || !Email || !Phone || !Message) {
      return res.redirect('/contact?errorMessage=All fields are required.');
    }

    // Compose and send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@divinewisdom.edu.in',
      bcc: 'management@divinewisdomschool.in, receptiondivinewisdom@gmail.com',
      subject: 'New Message from Website',
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Phone:</strong> ${Phone}</p>
        <p><strong>Message:</strong> ${Message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.redirect('/contact?successMessage=Your message has been sent successfully.');
  } catch (err) {
    console.error('Error in /message-send:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/subscribe', publicSubscribeLimiter, newsletterController.subscribe);

router.post('/subscribe', publicSubscribeLimiter, newsletterController.unsubscribe);

router.get("/login", (req, res) => {
  console.log('Flash messages:', {
    errorMessage: res.locals.errorMessage,
    successMessage: res.locals.successMessage,
  });
  res.render("login");
});

router.get('/', async (req, res) => {
  try {
    if (!req.cookies.cookieConsent) {
      res.cookie('cookieConsent', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    }

    // Show modal only if 'showSubscribeModal' cookie NOT set
    let showSubscribeModal = false;
    if (!req.cookies.showSubscribeModal) {
      showSubscribeModal = true;
      res.cookie('showSubscribeModal', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    }

    const [homeimgData, visionMissionData, environmentData, teacherData] = await Promise.all([
      Homeimg.find({}),
      VisionMission.find({}),
      Environment.find({}),
      Teacher.find({})
    ]);

    let randomAd = null;
    if (!req.session.lastAdShown || (Date.now() - req.session.lastAdShown >= 30 * 60 * 1000)) {
      randomAd = await Ad.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 1 } }
      ]);
      randomAd = randomAd[0] || null;

      if (randomAd) {
        req.session.adSeen = true;
        req.session.lastAdShown = Date.now();
      }
    } else {
      req.session.adSeen = false;
    }
    showSubscribeModal=true;
    
    // console.log(showSubscribeModal)
    res.render('index', {
      homeimgData,
      visionMissionData,
      environmentData,
      teacherData,
      randomAd,
      cookieConsent: req.cookies.cookieConsent,
      showSubscribeModal,
      errorMessage: res.locals.errorMessage,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/about', async (req, res) => {
  try {
    const [aboutImages, messages] = await Promise.all([
      AboutImage.find({}),
      Message.find({}),
    ]);
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
    const sessions = await Session.find().select('year').exec();
    const classes = await Class.find()
      .select('className sessionId')
      .populate('sessionId', 'year')
      .exec();

    const classOrder = [
      'CLASS NUR', 'CLASS JKG', 'CLASS SKG',
      'CLASS I', 'CLASS II', 'CLASS III', 'CLASS IV', 'CLASS V',
      'CLASS VI', 'CLASS VII', 'CLASS VIII', 'CLASS IX', 'CLASS X',
      'CLASS XI', 'CLASS XII'
    ];

    // Group and sort classes per session
    const groupedClasses = {};

    sessions.forEach((session) => {
      const sessionClasses = classes
        .filter(cls => cls.sessionId && cls.sessionId._id.toString() === session._id.toString())
        .sort((a, b) => {
          const nameA = a.className.trim();
          const nameB = b.className.trim();

          const indexA = classOrder.indexOf(nameA);
          const indexB = classOrder.indexOf(nameB);

          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return nameA.localeCompare(nameB);
        });

      groupedClasses[session._id] = sessionClasses;
    });

    res.render('Tc', { sessions, groupedClasses });
  } catch (err) {
    console.error('Error fetching data for TC:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/student/:studentId/view', tcController.viewStudentTC);

router.get('/class_students/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const cls = await Class.findById(classId).populate('sessionId').exec();

    if (!cls) {
      return res.status(404).send('Class not found');
    }

    const students = await Student.find({ classId: classId }).exec();
    const sessions = await Session.find();

    res.render('class_students', {
      students,
      sessions,
      cls
    });
  } catch (err) {
    console.error('Error fetching data for class students:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const [galleryItems, maingalleryItems] = await Promise.all([
      Gallery.find({}),
      Maingallery.find({}),
    ]);
    res.render('gallery', {
      galleryItems,
      maingalleryItems,
    });
  } catch (err) {
    console.error('Error fetching data for Gallery', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/admissions', async (req, res) => {
  try {
    const homeimgData = await Homeimg.find({}).select('image_url');
    res.render('admissions', { homeimgData });
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
    "datePublished": "2025-01-01T08:00:00+00:00",
    "dateModified": "2023-01-03T08:00:00+00:00",
    "image": "https://divinewisdom.edu.in/path/to/article-image.jpg",
    "mainEntityOfPage": "https://www.divinewisdom.edu.in/article/dws-committed-to-excellence",
    "keywords": "education, school, excellence, curriculum, DWS, Divine Wisdom School"
  };

  res.render('article', { schemaMarkup });
});

module.exports = router;
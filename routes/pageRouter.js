const express = require('express');
const { Homeimg, VisionMission, Environment, Teacher, Program, Review } = require('../models/home');
const { AboutImage, Message } = require('../models/about');
const router = express.Router();
const upload = require('../config/multer');
const transporter = require('../config/mailService');


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
router.post('/send-resume', upload.single('Resume'), async (req, res) => {
  const { Name, Email, Phone, Message } = req.body;
  const resumeFile = req.file; // This contains the uploaded file

  // Check if all required fields are filled
  if (!Name || !Email || !resumeFile) {
    return res.render('About', {
      errorMessage: 'Please fill in all required fields.',
    });
  }

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@divinewisdom.edu.in',
    subject: 'New Resume Submission',
    html: `
      <h3>New Resume Submission</h3><br>
      <p><strong>Name:</strong> ${Name}</p><br>
      <p><strong>Email:</strong> ${Email}</p><br>
      <p><strong>Phone:</strong> ${Phone}</p><br>
      <p><strong>Message:</strong> ${Message}</p>
    `,
    attachments: [
      {
        filename: resumeFile.originalname,  // Use the original file name
        content: resumeFile.buffer,  // Use the file buffer from Multer
        encoding: 'base64',  // Ensure the file is encoded properly
      },
    ],
  };

  // Send the email with the resume attached
  try {
    await transporter.sendMail(mailOptions);
    return res.redirect('/about?successMessage=Your resume has been sent successfully!');
  } catch (err) {
    console.error(err);
    return res.redirect('/about?errorMessage=There was an error sending your resume. Please try again later.');
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
    res.render('infrastructure');
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
  const { successMessage, errorMessage } = req.query;
  try {
    res.render('contactus', {
      successMessage,
      errorMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/contact', async (req, res) => {
  const { Name, Email, Phone, Message } = req.body;

  // Check if all required fields are filled
  // if (!Name || !Email || !Phone || !Message) {
  //   return res.redirect('/contact?errorMessage=Please fill in all required fields.');
  // }

  // Check if phone number is valid (exactly 10 digits)
  if (Phone.length !== 10) {
    return res.redirect('/contact?errorMessage=Phone number must be exactly 10 digits.');
  }

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@divinewisdom.edu.in',
    subject: 'New Contact Us Message',
    html: `
      <h3>New Contact Us Message</h3><br>
      <p><strong>Name:</strong> ${Name}</p><br>
      <p><strong>Email:</strong> ${Email}</p><br>
      <p><strong>Phone:</strong> ${Phone}</p><br>
      <p><strong>Message:</strong> ${Message}</p>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return res.redirect('/contact?successMessage=Your message has been sent successfully!');
  } catch (err) {
    console.error(err);
    return res.redirect('/contact?errorMessage=There was an error sending your message. Please try again later.');
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

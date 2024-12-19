const express = require('express');
const mongoose = require('mongoose');
const { Homeimg, VisionMission, Environment, Teacher, Program, Review } = require('../models/home');
const { AboutImage, Message } = require('../models/about');
const router = express.Router();




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
    res.render('about', {
      aboutImages,
      messages
    });
  } catch (err) {
    console.error(err);
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

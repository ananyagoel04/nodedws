const NewsletterSubscription = require('../models/NewsletterSubscription');
const Subscriber = require('../models/NewsletterSubscription');

const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.render('admin/newsletter', { subscribers });
  } catch (err) {
    console.error('Error loading subscribers:', err);
    res.status(500).send('Error loading subscribers');
  }
};

const subscribe = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email) {
      req.flash('errorMessage', 'Email is required');
      return res.redirect('/');
    }

    const existing = await NewsletterSubscription.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('errorMessage', 'Email is already subscribed');
      return res.redirect('/');
    }

    const subscription = new NewsletterSubscription({
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
    });

    await subscription.save();
    req.flash('successMessage', 'Subscription successful!');
    return res.redirect('/');
  } catch (error) {
    console.error('Error subscribing:', error);
    req.flash('errorMessage', 'Error subscribing');
    return res.redirect('/');
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send('Email is required for unsubscription');
    }

    const deleted = await NewsletterSubscription.findOneAndDelete({ email: email.toLowerCase().trim() });

    if (!deleted) {
      return res.status(404).send('Email not found in subscription list');
    }

    res.status(200).redirect('/admin/subscribe');
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).send('Error unsubscribing');
  }
};

const listSubscriptions = async (req, res) => {
  try {
    const subscriptions = await NewsletterSubscription.find().sort({ createdAt: -1 });
    res.render('admin/subscription_list', { subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Error fetching subscriptions');
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await NewsletterSubscription.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).send('Subscription not found');
    }

    res.status(200).redirect('/admin/subscribe');
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).send('Error deleting subscription');
  }
};

module.exports = {
  getAllSubscribers,
  subscribe,
  unsubscribe,
  listSubscriptions,
  deleteSubscription,
};

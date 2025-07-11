const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// ---------------------- Newsletter Subscription Routes ----------------------

// Subscribe (create subscription)
router.post('/', newsletterController.subscribe);

// Unsubscribe (delete by email)
router.post('/unsubscribe', newsletterController.unsubscribe);

// List all subscriptions (admin)
router.get('/', newsletterController.getAllSubscribers);

// Delete a subscription by ID (admin)
router.delete('/:id', newsletterController.deleteSubscription);

module.exports = router;

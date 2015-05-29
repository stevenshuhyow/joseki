var router = require('express').Router();
var db = require('../../db');

// Return a list of all events
router.get('/', function(req, res) {
 db.Event.findAll()
   .then(function(results){
     res.json(results);
   });
});

// Return one specific event by eventId
router.get('/:eventId', function(req, res) {
  db.Event.findOne({
    where: {
      id: req.params.eventId
    }
  }).then(function(event) {
    res.json(event);
  });
});

// Return a list of all events for a user where the user is a shepherd
router.get('/user/:userId', function(req, res) {
  // First find user by userId
  db.User.findOne({
    where: {
      id: req.params.userId
    }
  }).then(function(user) {
    if (user) {
      // For the user, find all events where the user is a shepherd
      user.getShepherdEvents().then(function(results) {
        res.json(results);
      });
    } else {
      // If user not found, send back null
      res.json(user);
    }
  });
});

// Create a new event and return event
router.post('/create', function(req, res) {
  var currentDate = new Date();

  // Make sure user exists
  db.User.findOne({
    where: {
      id: req.body.userId
    }
  }).then(function(user) {
    if (user) {
      // User exists, continue to create event
      db.Event.create({
        eventName: req.body.eventName || '',
        // If no start time specified, default to now
        start: req.body.start || currentDate,
        // If no end time specified, default to 24 hours from now
        end: req.body.end || new Date(currentDate.getTime() + 60 * 60 * 24 * 1000),
        location: req.body.location || '',
        minParticipants: req.body.minParticipants || null,
        maxParticipants: req.body.maxParticipants || null
      }).then(function(event) {
        // After creating the event, associate the event with the user as a shepherd
        user.addShepherdEvent(event).then(function(shepherdEvent) {
          event.addShepherd(user);
          res.json(event);
        });
      });
    }
  });
});

// Edit details for an event
router.put('/:eventId', function(req, res) {
  // Find the event by ID
  db.Event.findOne({
    where: {
      id: req.params.eventId
    }
  }).then(function(event) {
    if (event) {
      // Found event in db, continue to update
      event.updateAttributes({
        eventName: req.body.eventName,
        location: req.body.location
      }).then(function() {
        res.sendStatus(200);
      });
    } else {
      // Event not found
      res.sendStatus(400);
    }
  });
});

module.exports = router;
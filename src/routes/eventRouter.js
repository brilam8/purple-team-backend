//dependencies
const routes = require('express').Router();
//const data = require('../../exampleData.json');
const { Event } = require('../database/models/eventsModel');
const { getDatabase } = require('../database/mongo');

// GET JSON of all events
routes.get('/all', async (req, res, next) => {

    Event.find(function (err, events) {
        if (err) {
          console.log('error ', err.res);
        }
        else {
          res.status(200).json(events);
        }
      })
});


// POST a new event to the database
routes.post('/event', (request, res) => {
    if (!request.body || request.body == {}){
      return res.send("no request body")
    }
    const event = new Event({
        title: request.body.title,
        location: request.body.location,
        startTime: request.body.startTime,
        endTime: request.body.endTime,
        checkIn: request.body.checkIn,
        url: request.body.url,
        tags: request.body.tags
    }).save((err, response) => {
        if (err) res.status(400).send(err);
        res.status(200).send(response);
    })
    
});

routes.delete('/event', async (req, res) => {
  try {
    // Remove event
    await Event.findOneAndRemove({ event: req.body.id });

    res.json({ msg: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*
routes.edit('/event', (request, res) => {
    const event = Event.findByIdAndUpdate(request.body.id, {$set: request.body}, function(err, events) {
      if (err) {
        console.log('error ', err);
      } else {
        res.status(200).json(events).send("updated");
      }
    });
});
*/

// GET specific events from the database via a "query" (title search, description, time, etc.)
routes.get("/event/:query", (request, res) => {
    const event = Event.find({ $text: { $search: request.params.query}}, function(err, events){
      if (err) {
        console.log('error ', err);
      }
      else {
        res.status(200).json(events);
      }
    });
})


module.exports = routes;
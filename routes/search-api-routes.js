// require the dependencies
var db = require("../models");

module.exports = function(app) {

  // post route saving a search's parameters to the database
  app.post("/api/search", function(req, res) {
    db.SearchParam.create({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      maxDistance: req.body.maxDistance,
      minLength: req.body.minLength,
      UserId: req.body.UserId
    }).then(function(dbSearch) {
      res.json(dbSearch);
    });
  });

  // get route to return a user's saved searches and the associted activities
  app.get("/api/search", function(req, res) {
    db.SearchParam.findAll({
      where: {
        UserId: req.body.UserId
      },
      include: [db.Activity]
    }).then(function(dbSearch) {
      res.json(dbSearch);
    }).catch(function(err){
      res.send(err);
    });
  });

  // get route used to determine if a specific search has already been made (prevents duplicate searches from being saved)
  app.get("/api/check/search", function(req, res) {
    db.SearchParam.findAll({
      where: {
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        maxDistance: req.query.maxDistance,
        minLength: req.query.minLength,
        UserId: req.query.UserId
      },
      include: [db.Activity]
    }).then(function(dbSearch) {
      res.json(dbSearch);
    });
  });

  // delete route to remove a saved search from the database (will delet all associated activities as well)
  app.delete("/api/search", function(req, res) {
    db.SearchParam.destroy({
      where: {
        id: req.body.id
      }
    }).then(function(dbSearch) {
      res.json(dbSearch);
    });
  });

};
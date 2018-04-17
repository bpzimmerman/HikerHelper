// require the dependencies
var db = require("../models");

module.exports = function(app) {

  // post route saving the parameters of an activity to the database
  app.post("/api/activity", function(req, res) {
    db.Activity.create({
      name: req.body.name,
      activityNum: req.body.activityNum,
      difficulty: req.body.difficulty,
      length: req.body.length,
      rating: req.body.rating,
      lat: req.body.lat,
      lng: req.body.lng,
      imgUrl: req.body.imgUrl,
      SearchParamId: req.body.SearchParamId
    }).then(function(dbActivity) {
      res.json(dbActivity);
    }).catch(function(err){
      res.send(err);
    });
  });

  // delete route to remove a saved activity from the database (will NOT delete the saved search it is associated with)
  app.delete("/api/activity", function(req, res) {
    db.Activity.destroy({
      where: {
        id: req.body.id
      }
    }).then(function(dbActivity) {
      res.json(dbActivity);
    });
  });

};


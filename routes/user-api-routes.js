// require the dependencies
var db = require("../models");
var bcrypt = require('bcrypt');

module.exports = function (app) {

  // get route to check the user's email and password
  app.get("/api/users", function (req, res) {
    db.User.findOne({
      where: {
        email: req.query.email
      },
      include: [
        {
          model: db.SearchParam, include: [
            { model: db.Activity }
          ]
        }
      ]
    }).then(function (dbUser) {
      bcrypt.compare(req.query.password, dbUser.dataValues.password, function(err, result){
        var db = dbUser.dataValues;
        db.loggedin = result
        res.json(db);
      });
    });
  });

  //Post route: Hash the password and store it in MySQL
  app.post("/api/users", function (req, res) {
    var pass;

    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      // pass up "hash" to mySQL instead of what they entered for password
      pass = hash;
      db.User.create({
        email: req.body.email,
        displayName: req.body.displayName,
        password: pass
      }).then(function (dbUser) {
        res.json(dbUser);
      }).catch(function(err){
        res.send(err);
      });
    });
  });

  // delete route to delete the specified user (will also delete all the associted searches and activities)
  app.delete("/api/users", function (req, res) {
    db.User.destroy({
      where: {
        id: req.body.id
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

};
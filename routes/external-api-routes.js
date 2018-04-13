// require the dependencies
require('dotenv').config();
var request = require('request');
var db = require("../models");
var keys = require("../keys.js");

// activate api keys
var googleMapsGeoKey = keys.google.id;
var googleMapsAirKey = keys.google.air_id;
var trailsKey = keys.trail.id;

module.exports = function(app) {

  // get route to ultimately return trails of a given minimum length in a given radius around a given address
  app.get("/api/ex/trail", function(req, res) {
    var address = req.query.address;
    var searchRadius = req.query.searchRadius;
    var searchLength = req.query.searchLength;

    var latlngUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleMapsGeoKey;

    // request to the googlemaps geocode api to convert the address into latitude and longitude
    request(latlngUrl, function(error, response, body){
      var externalRes = {};

      if (error){
        console.log("Error Occurred: " + error);
        return res.json(error);
      };

      // collect lat & long from body
      var latlngParsed = JSON.parse(body);
      externalRes.location = latlngParsed.results[0].geometry.location;

      var trailUrl = "https://www.hikingproject.com/data/get-trails?lat="+
                      externalRes.location.lat+
                      "&lon="+externalRes.location.lng+
                      "&maxDistance="+searchRadius+
                      "&minLength="+searchLength+
                      "&key=" + trailsKey;

      // request to the trail api using the returned latitude and longitude and the given minimum trail length and search radius
      request(trailUrl, function(error, response, body){
        if (error){
          console.log("Error Occurred: " + error);
          return res.json(error);
        };

        var trailParsed = JSON.parse(body);
        externalRes.trails = trailParsed.trails;

        res.send(externalRes);
      });
    });
  });

  // get route to the googlemaps geocode api to convert latitude and longitude into an address
  app.get("/api/ex/address", function(req, res) {
    var latlng = req.query.latitude + "," + req.query.longitude;

    var addressUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng +"&key=" + googleMapsGeoKey;

    request(addressUrl, function(error, response, body){
      if (error){
        console.log("Error Occurred: " + error);
        return res.json(error);
      };

      var addressParsed = JSON.parse(body);

      res.send(addressParsed);
    });
  });

  app.get("/api/ex/airport", function(req, res){
    var latlng = req.query.latitude + "," + req.query.longitude;

    var airportURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latlng + "&radius=5000&types=airport&key=" + googleMapsAirKey;

    request(airportURL, function(error, response, body){
      if (error){
        console.log("Error Occurred: " + error);
        return res.json(error);
      };

      var airportParsed = JSON.parse(body);

      res.send(airportParsed);
    });
  });
};
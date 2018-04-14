
$(document).ready(function () {
  var address = "";
  var searchLat = "";
  var searchLon = "";
  var searchLength;
  var searchDiff;
  var searchRadius;
  var currentSearchesArray = [];

  // click to submit the search request
  $("#searchButton").on("click", function () {
    event.preventDefault();

    // clear any previously submitted searches
    currentSearchesArray = [];
    $("#hikingDiv").empty();

    // get information from search form
    address = $("#inlineFormInput").val().trim();
    searchLength = parseFloat($("#search-min-lng").val().trim());
    searchDiff = $("#search-diff").val();
    searchRadius = parseFloat($("#search-max-dist").val().trim());

    // set trail length and search radius defaults if a number is not entered
    if (isNaN(searchLength)) {
      searchLength = 0;
    };
    if (isNaN(searchRadius)) {
      searchRadius = 30;
    };

    if (address){
      // create object containing search information
      var searchInfo = {
        address: address,
        searchLength: searchLength,
        searchRadius: searchRadius
      };

      // call function to get the trails based on the serach information entered
      findNewTrails(searchInfo);

      // reset form values
      $("#inlineFormInput").val("");
      $("#search-max-dist").val("");
      $("#search-min-lng").val("");

    } else {
      $("#inlineFormInput").addClass("is-invalid");
    };

    //setTimeout(function(){ location.href= '#hikingDiv'; }, 500);

  });

  // function to submit the search criteria and get the set of matching trails
  function findNewTrails(data) {

    // get call to the /routes/external-api-routes (lines 13-54)
    $.get("/api/ex/trail", data, function (response) {
      console.log(response);
      searchLat = response.location.lat;
      searchLon = response.location.lng;

      // add search parameters to data attributes on the hiking container
      $("#hikingDiv").attr("data-length", searchLength)
        .attr("data-difficulty", searchDiff)
        .attr("data-radius", searchRadius)
        .attr("data-lat", searchLat)
        .attr("data-lng", searchLon);

      var pullID = 0;
      if (response.trails.length == 0) {
        $("#no-trails").modal("show");
      } else {
        $('html,body').animate({
          scrollTop: $("#hikingDiv").offset().top
        }, 'slow');
      };

      var trailInfo = {};
      for (var i = 0; i < response.trails.length; i++) {

        trailInfo = response.trails[i];
        // pushes response to array so that more info can be displayed to user in modal
        currentSearchesArray.push(trailInfo);

        var difficulty = trailInfo.difficulty;
        var trailName = trailInfo.name;

        var newDiv = $("<div data-toggle='modal' data-target='#moreInfo-Modal'>");

        // add the returned trail information to data attributes on the individual trail container
        newDiv.attr("data-actNum", trailInfo.id)
          .attr("data-actName", trailInfo.name)
          .attr("data-actDiff", trailInfo.difficulty)
          .attr("data-actLength", trailInfo.length)
          .attr("data-actRating", trailInfo.stars)
          .attr("data-lat", trailInfo.latitude)
          .attr("data-lng", trailInfo.longitude);
        var newIMG = $("<img>");
        var trailIMG = trailInfo.imgSmall.replace(/\\\//g, "/");
        if (trailIMG == '') {
          trailIMG = "https://image.ibb.co/cxZnrn/defaulthiker240.png";
        };
        newIMG.attr("src", trailIMG);

        newDiv.attr('data-pullID', pullID++);

        var newP = $("<p>");
        var newH = $("<h5>");
        newH.append(trailInfo.name);
        newP.append(trailInfo.location);

        var rateSpan = $("<span>");
        rateSpan.rateYo({
          rating: trailInfo.stars,
          readOnly: true,
          starWidth: "12px"
        });

        // need to append to the div in html
        newDiv.append(newH);
        newDiv.append(newP);
        newDiv.append(newIMG);
        newDiv.append(rateSpan);
        newDiv.addClass("trails");

        $("#hikingDiv").append(newDiv);
      }
      console.log(currentSearchesArray);
    });

  };

  function airportSearch(lat, lng) {
    googlePlacesSearch = {
      latitude: lat,
      longitude: lng
    };

    $.get("/api/ex/airport", googlePlacesSearch, function (response) {
      //  searchLat = response.results[0].geometry.location.lat;
      //  searchLon = response.results[0].geometry.location.lng;

      //  var formatLocation = {
      //    lat:searchLat ,
      //    lon: searchLon 
      //  };
      console.log(response.results[1].name);
    });
  }//airport search ends

  // on click to open modal for more information on a specific trail
  $(document).on("click", ".trails", function () {
    var thisIndex = $(this).attr("data-pullid");
    var thisTrail = currentSearchesArray[thisIndex];
    var trailIMG = thisTrail.imgSmallMed.replace(/\\\//g, "/");

    if (trailIMG == "") {
      trailIMG = "https://image.ibb.co/dPzyxS/defaulthike340.png";
    };

    $("#content-title").text(thisTrail.name);
    $("#moreInfo-Body img").attr("src", trailIMG)
      .attr("data-actNum", $(this).attr("data-actNum"))
      .attr("data-actName", $(this).attr("data-actName"))
      .attr("data-actDiff", $(this).attr("data-actDiff"))
      .attr("data-actLength", $(this).attr("data-actLength"))
      .attr("data-actRating", $(this).attr("data-actRating"))
      .attr("data-actLat", $(this).attr("data-lat"))
      .attr("data-actLng", $(this).attr("data-lng"));
    $("#moreInfo-Body p").empty();
    $("#moreInfo-Body p").append(thisTrail.location + "</br>");
    var hikeDiff = { green: "Easy", greenBlue: "Kinda Easy", blue: "Intermediate", blueBlack: "Kinda Hard", black: "Hard", dblack: "Very Hard" };
    var hikeTips =
      ["Pay attention to signs and trail markers, as well as any park rules.",
        "Make sure to bring water for any length of hike.",
        "Don't forget bug protection, especially during the spring and summer.",
        "It's unwise to walk into the brush, especially in areas where snakes and ticks are common.",
        "Make sure to bring water for any length of hike.",
        "Sneakers will increase your traction and reduce wear on your feet.",
        "Be careful when walking down steep inclines. It's just as dangerous as going up!",
        "Pay attention to weather broadcasts. Weather can change fast, and you won't be able to get to safety quickly!",
        "Don't forget bug protection, especially during the spring and summer.",
        "Always let someone know where you will be during your hike.",
        "In areas with bad cell coverage, always have a paper map when you can.",
        "Make sure to choose a trail appropriate to your level of fitness.",
        "Always bring an extra source of light during evening hikes. Phones die!",
        "Best footwear for hiking: Hiking boots with wool or nylon socks (no cotton!)",
        "Cotton fabric does not dry easily. Avoid it when dressing for your hike.",
        "Set a manageable pace, instead of moving fast when you begin the hike. You'll be thankful for this later!",
        "Basic first aid equipment will go a long way in preventing infection.",
        "Familiarize yourself with the terrain and the native wildlife.",
        "Never hike alone when you travel to low-traffic trails.",
        "Hiking in a group makes everyone safer.",
        "Eat small snacks often, instead of a large meal before or after your hike.",
        "Never leave anything on the trail! Take your trash with you.",
        "Leaving food on the trail can attract bears and coyotes.",
        "In group hikes, let the slowest member set the pace."
      ];
    var randomtip = Math.floor(Math.random()*hikeTips.length);
    var difficulty = hikeDiff[thisTrail.difficulty];
    $("#moreInfo-Body p").append("Difficulty: " + difficulty + "<br>");
    if(thisTrail.conditionDetails){
      $("#moreInfo-Body p").append("Current Condition Details: " + thisTrail.conditionDetails + "<br>");
    };
    $("#moreInfo-Body p").append("Hiking Tip: " + hikeTips[randomtip]);

  });

  $(document).on("click", "#bookTrip", function () {
    // var thisIndex = $(this).attr("data-pullid");
    // var thisTrail = currentSearchesArray[thisIndex];
    // airportSearch();

    if ("geolocation" in navigator) { //check geolocation available 
      //try to get user current location using getCurrentPosition() method
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Found your location XX Lat : " + position.coords.latitude + " Lang :" + position.coords.longitude);
      });
    } else {
      console.log("Browser doesn't support geolocation!");
    }

  });

  $("#inlineFormInput").focus(function(){
    $("#inlineFormInput").removeClass("is-invalid");
  });

});//jQuery ends
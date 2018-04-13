$(document).ready(function(){

  // function to get a users saved searches
  function getSaves(loginInfo){
    $.get("/api/users", loginInfo, function(data){
      console.log(data);
      var displayName = data.displayName;
      var titleHeadline = $("<h2>");
      titleHeadline.text(`${displayName}'s Saved Searches`);
      $("#hikingDiv").empty();
      $("#hikingDiv").append(titleHeadline);
      data.SearchParams.forEach(function(item){
        createSavesList(item);
      });
    });
  };

  // function creating list items to display the saved searches
  function createSavesList(data){
    // get route to convert the latitude and longitude to an address
    $.get("/api/ex/address", data, function(response){
      var address = response.results[2].formatted_address;
      var listItem = $("<li>");
      listItem.attr("data-lat", data.latitude)
              .attr("data-lng", data.longitude)
              .text(address + " ");
      var delSearchBttn = $("<button>");
      delSearchBttn.attr("class", "btn btn-primary del")
                   .attr("data-id", data.id)
                   .attr("data-type", "search")
                   .text("Delete Search");
      listItem.append(delSearchBttn);
      var subList;
      var delActBttn;
      var actDiv;
      var actImg;
      var actH;
      var actP;
      var rateSpan;
      if (data.Activities.length > 0){
        subList = $("<li>");
        subList.attr("class", "saves");
        data.Activities.forEach(function(item){
          actDiv = $("<div>");
          actDiv.attr("class", "trails")
                .attr("data-actNum", item.activityNum)
                .attr("data-actName", item.name)
                .attr("data-actDiff", item.difficulty)
                .attr("data-actLength", item.length)
                .attr("data-actRating", item.rating)
                .attr("data-lat", item.lat)
                .attr("data-lng", item.lng);
          actImg = $("<img>");
          actImg.attr("src", item.imgUrl);
          actH = $("<h5>");
          actH.text(item.name);
          rateSpan = $("<span>");
          rateSpan.rateYo({
            rating: item.rating,
            readOnly: true,
            starWidth: "12px"
          });
          actP = $("<p>");
          actP.text(`Difficulty: ${item.difficulty}`);
          actP.append(rateSpan);
          delActBttn = $("<button>");
          delActBttn.attr("class", "btn btn-sm btn-primary del")
                    .attr("data-id", item.id)
                    .attr("data-type", "activity")
                    .text("Delete Activity");
          actDiv.append(actH, actImg, actP, delActBttn);
          subList.append(actDiv);
        });
        listItem.append(subList);
      };
      $("#hikingDiv").append(listItem);
    });

  };

  // function building the data variables for storage into the database
  function search(){

    // search information
    var userId = sessionStorage.getItem("id");
    var searchLat = parseFloat($("#hikingDiv").attr("data-lat"));
    var searchLng = parseFloat($("#hikingDiv").attr("data-lng"));
    var searchDist = parseFloat($("#hikingDiv").attr("data-radius"));
    var searchLength = parseFloat($("#hikingDiv").attr("data-length"));

    // activity information
    var actName = $(".modal-body img").attr("data-actName");
    var actNum = parseFloat($(".modal-body img").attr("data-actNum"));
    var actDiff = $(".modal-body img").attr("data-actDiff");
    var actLength = parseFloat($(".modal-body img").attr("data-actLength"));
    var actRating = parseFloat($(".modal-body img").attr("data-actRating"));
    var actLat = parseFloat($(".modal-body img").attr("data-actLat"));
    var actLng = parseFloat($(".modal-body img").attr("data-actLng"));
    var actImgUrl = $(".modal-body img").attr("src");

    // create the search information object
    var searchInfo = {
      latitude: searchLat,
      longitude: searchLng,
      maxDistance: searchDist,
      minLength: searchLength,
      UserId: userId
    };

    // create the activity information object
    var activityInfo = {
      name: actName,
      activityNum: actNum,
      difficulty: actDiff,
      length: actLength,
      rating: actRating,
      lat: actLat,
      lng: actLng,
      imgUrl: actImgUrl
    };

    // get route to check if the search has already been saved
    $.get("/api/check/search", searchInfo, function(data){
      if (data.length === 0){
        saveSearch(searchInfo, activityInfo);
      } else {
        activityInfo.SearchParamId = data[0].id;
        saveActivity(activityInfo);
      };
    });
  };

  // function to save the search paramters
  function saveSearch(searchData, activityData){
    $.ajax({
      method: "POST",
      url: "/api/search",
      data: searchData
    }).done(function(result){
      activityData.SearchParamId = result.id;
      saveActivity(activityData);
    }).fail(function(xhr, responseText, responseStatus){
      if (xhr){
        console.log(xhr.responseText);
      };
    });
  };

  // function to save the activity paramters
  function saveActivity(activityData){
    $.ajax({
      method: "POST",
      url: "/api/activity",
      data: activityData
    }).done(function(result){
      console.log("added activity result: " + result);
    }).fail(function(xhr, responseText, responseStatus){
      if (xhr){
        console.log(xhr.responseText);
      };
    });
  };

  // click event to delete a search or activity (depending on which button is pushed)
  $(document).on("click", ".del", function(){
    var delId = {
      id: parseInt($(this).attr("data-id"))
    };
    var type = $(this).attr("data-type");
    var url = "/api/" + type;

    $.ajax({
      method: "DELETE",
      url: url,
      data: delId
    }).done(function(result){
      var userEmail = sessionStorage.getItem("email");
      var userPass = sessionStorage.getItem("password");
      var authInfo = {
        email: userEmail,
        password: userPass
      };
      getSaves(authInfo);
    }).fail(function(xhr, responseText, responseStatus){
      if(xhr){
        console.log(xhr.responseText);
      };
    });
  });

  // click event to save an activity and/or search after verifying a user is logged in
  $(document).on("click", "#save-act", function(){

    if (sessionStorage.getItem("user")){
      search();
    } else {
      console.log("not logged in!");
      $("#signIn-Modal").modal("show");
    };
  });

  // click event to display a user's saved searches
  $(document).on("click", "#savedSearches", function(){
    var userEmail = sessionStorage.getItem("email");
    var userPass = sessionStorage.getItem("password");
    var authInfo = {
      email: userEmail,
      password: userPass
    };
    getSaves(authInfo);
    $('html,body').animate({
      scrollTop: $("#hikingDiv").offset().top
    }, 'slow');
  });

});
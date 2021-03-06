$(document).ready(function() {

    $(window).resize(function() {
        var homeHeight = $(this).height();
        var hCenter = (($(this).height() /2) - ($("#box").height() /2));
        $("#background").height(homeHeight);
        $("#box").css("margin-top", hCenter);
    }).resize();

    locationFinder();
    apiCall();

    // Unit changer (F to C, vice versa). Tagged to body due to API
	$("body").on("click", "#change", function(e) {
    	if (unit === "F") {
    		temperature = (temperature - 32) * 5 / 9;
    		unit = "C";
    		$("#change").html(Math.round(temperature) + "&#176;" + unit);
    		}

    	else if (unit === "C") {
    		temperature = temperature * 9 / 5 + 32;
    		unit = "F";
    		$("#change").html(Math.round(temperature) + "&#176;" + unit);
    	}
    	e.preventDefault();
	});

// End of (document).ready

});

// Initial definition of global variables
var temperature, city, unit, fullLocation, apiLink = "";

function locationFinder() {
	$.getJSON("https://ipinfo.io/geo").done(function(response) {
  		city = response.city; // Leave here, needs to be filled for Weather API
  		fullLocation = response.city + ", " + response.region;
	}).fail(error);
}

// Waits for city to fill before it calls the if
function apiCall() {
	if (typeof city !== "undefined") {
		apiLink = "https://api.apixu.com/v1/current.json?key=5cb736ef916f42e79c2183020171108&q=" + city;
		$.getJSON(apiLink).done(update).fail(error);

		function update(response) {

			// Units are F, initial setting. &units=imperial
			unit = "F";
			var description = response.current.condition.text;
			temperature = Math.round(response.current.temp_f);

			var iconLink = "https://" + response.current.condition.icon;

			$("#city").html("<h3>" + fullLocation + "</h3>");
			$("#description").html(description + " | " + "<a href='#' id='change'>" + temperature + "&#176;" + unit + "</a>");
			$("#icon").html('<img src="' + iconLink + '">');
		}
	}

	else {
		setTimeout(apiCall, 100);
	}
}

// Only runs when JSON fails or server responds with anything other than expected
function error() {
	$("#city").html("There has been an error.</br>Try again later!");
	$("#description").html("");
}

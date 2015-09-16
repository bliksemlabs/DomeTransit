var getHalteData = function (postcode) {
	// Trigger load indicator
	MAF.utility.WaitIndicator.up();
	new Request({
		url: "http://1313.nl/postcode/"+postcode,
		proxy: {
			json: true
		},
		onSuccess: function(json) {
			var data = json && json.features || {};
			// Store data via message to signal the views that have a registerMessageCenterListenerCallback on the view
			MAF.messages.store('MyBushaltes', data || []);
			// Unset load indicator
			MAF.utility.WaitIndicator.down();
		}
	}).send();
};

var getStationData = function (latlng) {
	MAF.utility.WaitIndicator.up();
	new Request({
		url: "http://1313.nl/station/"+postcode,
		proxy: {
			json: true
		},
		onSuccess: function(json) {
			var data = json && json.features || {};
			// Store data via message to signal the views that have a registerMessageCenterListenerCallback on the view
			MAF.messages.store('MyStations', data || []);
			// Unset load indicator
			MAF.utility.WaitIndicator.down();
		}
	}).send();
}

var getStopTimeData = function (stopArea) {
	// Trigger load indicator
	MAF.utility.WaitIndicator.up();
	new Request({
		url: "http://dev.ovapi.nl/v2/stop_area/"+stopArea+"/departures/",
		proxy: {
			json: true
		},
		onSuccess: function(json) {
			destinations = {}, journey_destination = {}, journey_patterns = {}, journey_routes = {}, journey_lines = {},
				lines = {}, stop_times = []
			Array.forEach(json.destination, function(val, i) {
				destinations[val.id] = val.name;
			})
			Array.forEach(json.journey_pattern_point, function(jpp, i) {
				Array.forEach(jpp._links, function(link) {
					if (link.rt === "destination") {
						journey_destination[jpp.id] = link.href.replace("http://dev.ovapi.nl/v2/destination/", "");
					} else if (link.rt === "journey_pattern") {
						journey_patterns[jpp.id] = link.href.replace("http://dev.ovapi.nl/v2/journey_pattern/", "");
					}
				});
			})
			Array.forEach(json.journey_pattern, function(jp, i) {
				Array.forEach(jp._links, function(link) {
					if (link.rt === "route") {
						journey_routes[jp.id] = link.href.replace("http://dev.ovapi.nl/v2/route/", "");
					}
				});
			})
			Array.forEach(json.route, function(route, i) {
				Array.forEach(route._links, function(link) {
					if (link.rt === "line") {
						journey_lines[route.id] = link.href.replace("http://dev.ovapi.nl/v2/line/", "");
					}
				});
			})
			Array.forEach(json.line, function(line, i) {
				lines[line.id] = line
			})
			Array.forEach(json.stop_time, function(stoptime, i) {
				Array.forEach(stoptime._links, function(link) {
					if (link.rt === "journey_pattern_point") {
						stoptime.jpp = link.href.replace("http://dev.ovapi.nl/v2/journey_pattern_point/", "");
					}
				});
				stoptime.destination = destinations[journey_destination[stoptime.jpp]];
				stoptime.line = lines[journey_lines[journey_routes[journey_patterns[stoptime.jpp]]]];
				stop_times.push(stoptime);
			})

			// Store data via message to signal the views that have a registerMessageCenterListenerCallback on the view
			MAF.messages.store('MyStopTimes', stop_times || []);
			// Unset load indicator
			MAF.utility.WaitIndicator.down();
		}
	}).send();
};

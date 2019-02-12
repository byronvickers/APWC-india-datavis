var map = L.map('map').setView([23.245322, 81.615787], 4);

var wasteData = {
    "1": 0.017,
    "2": 0.25,
    "3": 0.12,
    "4": 0.57,
    "5": 0.27,
    "6": 0.88,
    "7": 0.95,
    "8": 0.43,
    "9": 0.047,
    "10": 0.44,
    "11": 0.44,
    "12": 0.62,
    "13": 0.16,
    "14": 0.73,
    "15": 0.61,
    "16": 0.4,
    "17": 0.36,
    "18": 0.38,
    "19": 0.3,
    "20": 0.41,
    "21": 0.18,
    "22": 0.14,
    "23": 0.41,
    "24": 0.38,
    "25": 0.28,
    "26": 0.99,
    "27": 0.28,
    "28": 0.93,
    "29": 0.77,
    "30": 0.78,
    "31": 0.019,
    "32": 0.35,
    "33": 0.88,
    "34": 0.8,
    "35": 0.54
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.light'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>State statistics</h4>' +  (props ?
		'<b>' + props.NAME_1 + '</b><br />Waste production: ' + wasteData[props.ID_1] + ' m<sup>3</sup>/hh/wk'
        : 'Hover over a state');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
	return d > 0.8 ? '#800026' :
			d > 0.7  ? '#BD0026' :
			d > 0.6  ? '#E31A1C' :
			d > 0.5  ? '#FC4E2A' :
			d > 0.4   ? '#FD8D3C' :
			d > 0.3   ? '#FEB24C' :
			d > 0.2   ? '#FED976' :
						'#FFEDA0';
}

function style(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(wasteData[feature.properties.ID_1])
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 0.01) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

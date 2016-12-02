var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';

var grayscale = L.tileLayer(mbUrl, {
        id: 'mapbox.light',
        attribution: mbAttr
    }),
    streets = L.tileLayer(mbUrl, {
        id: 'mapbox.streets',
        attribution: mbAttr
    });

var map = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: '',
    id: 'mapbox.light',

}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = '<h4>US Gallons consumption pre day Distribution</h4> <h4>Hover the clock to choose a year</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' Thousand gallons per day' : 'Hover over a state');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d > 30000 ? 'Purple' :
        d > 10000 ? 'BlueViolet' :
        d > 5000 ? 'MediumOrchid' :
        d > 2000 ? 'Orchid' :
        d > 1000 ? 'Plum' :
        d > 500 ? 'Thistle' :
        d > 100 ? 'Lavender' :
        '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
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



    info.update(layer.feature.properties);
}

var geojson2013;
var geojson2003;
var geojson1993;
var geojson1983;

function resetHighlight(e) {
    geojson2013.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson2003.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson1993.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson1983.resetStyle(e.target);
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


var geojson2013 = L.geoJson(states2013, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson2003 = L.geoJson(states2003, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson1993 = L.geoJson(states1993, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson1983 = L.geoJson(states1983, {
    style: style,
    onEachFeature: onEachFeature
});



var overlays = {

    "Streets": streets

};
var baseLayers = {
    "2013": geojson2013,
    "2003": geojson2003,
    "1993": geojson1993,
    "1983": geojson1983
};


L.control.layers(baseLayers, overlays).addTo(map);

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [100, 500, 1000, 2000, 5000, 10000, 30000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

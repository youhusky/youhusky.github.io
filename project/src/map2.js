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
    this._div.innerHTML = '<h4>Natural Gas Consumption state Distribution</h4> <h4>Hover the clock to choose a year</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + 'million cubic feet per year' : 'Hover over a state');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d > 3000000 ? 'Purple' :
        d > 1000000 ? 'BlueViolet' :
        d > 500000 ? 'MediumOrchid' :
        d > 200000 ? 'Orchid' :
        d > 100000 ? 'Plum' :
        d > 50000 ? 'Thistle' :
        d > 5000 ? 'Lavender' :
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

var geojson2012;
var geojson2007;
var geojson2002;
var geojson1997;

function resetHighlight(e) {
    geojson2012.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson2007.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson2002.resetStyle(e.target);
    info.update();
}

function resetHighlight(e) {
    geojson1997.resetStyle(e.target);
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


var geojson2012 = L.geoJson(states2012, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson2007 = L.geoJson(states2007, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson2002 = L.geoJson(states2002, {
    style: style,
    onEachFeature: onEachFeature
});

var geojson1997 = L.geoJson(states1997, {
    style: style,
    onEachFeature: onEachFeature
});



var overlays = {

    "Streets": streets

};
var baseLayers = {
    "2012": geojson2012,
    "2007": geojson2007,
    "2002": geojson2002,
    "1997": geojson1997
};


L.control.layers(baseLayers, overlays).addTo(map);

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [5000, 50000, 100000, 200000, 500000, 1000000, 3000000],
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

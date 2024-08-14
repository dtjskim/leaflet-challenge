// Define the url for the GeoJSON earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map
let map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// visualize earthquake data to the map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: markerRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

    // colors for depth
    }
    function markerColor(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    // circle marker for magnitude
    function markerRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 5;
    }

    // Add earthquake data to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(map);

    // Create a legend that will provide context for the map data
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];

        // Set the background color to white
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markerColor(depth[i] + 1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' + 
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
});









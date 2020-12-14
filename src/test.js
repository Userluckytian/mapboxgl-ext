 

cityfun.setToken(
  "pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw"
);
var map = new cityfun.Map({
  container: "map",
  center: [120.70044254024515, 31.301339366724918],
  zoom: 12,
  pitch: 60,
  style: "http://webres.cityfun.com.cn/szmap/szmap_dark/3857/map_dark.json",
});

map.on("load", function() {
  map.loadImage("./docs/mapsdk/images/watermark.png",
    function(err, image) {
      if (err) throw err;
      map.addImage("pattern", image);

      map.addLayer({
        id: "watermark",
        type: "background",
        paint: {
          "background-pattern": "pattern",
        },
      });
    }
  );
});

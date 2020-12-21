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
var measure = null;

//   <button id="distance" onclick="measure.activate('distance')">测距离</button>
// <button id="area" onclick="measure.activate('area')">测面积</button>
// <button id="disable" onclick="measure.disable()">暂停测量</button>
// <button id="clear" onclick="measure.clear()">清空</button>
// <button id="deactivate" onclick="measure.deactivate()">结束测量</button>
map.on("load", function() {
  measure = new cityfun.MeasureTool(map);

  document.getElementById("distance").onclick = function() {
    measure.activate("distance");
  };
  document.getElementById("area").onclick = function() {
    measure.activate("area");
  };
  document.getElementById("disable").onclick = function() {
    measure.disable();
  };
  document.getElementById("clear").onclick = function() {
    measure.clear();
  };
  document.getElementById("deactivate").onclick = function() {
    measure.deactivate();
  };
});

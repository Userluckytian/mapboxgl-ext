let loginParams = {
  password: "admin",
  userName: "admin",
};
let loginUrl = "http://192.168.2.64/geocms/api/geoengine/appinfo/sso";
let tokeUrl = "http://192.168.2.64/geocms/api/geoengine/appinfo/gettoken";

let app_id = "ddbc794c-b452-4364-91e9-c8c8bde87cff";
let app_secret = "a8077a635d290aed9d544a883f28fe9f";

// 登陆
fetch(loginUrl, {
  method: "post",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(loginParams),
})
  .then((result) => {
    return result.json();
  })
  .then((result) => {
    let accessToken = result.data.accessToken;
    fetch(tokeUrl + `?app_id=${app_id}&app_secret=${app_secret}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((result) => {
        let token = result.data.token;
        console.log(token);
      });
  });
cityfun.setConfig({
  userName:loginParams. userName,
  password: loginParams.password,
  app_id: app_id,
  app_secret: app_secret,
  // mapboxToken:
  //   "pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw",
  // cfToken:
  //   "Y46MGb0cSrS57uhfERXk8Om7TJv7TfqHR9dzlyiMXHqwHLk4TQz%2BHZ7abgItY0zD8JmSbQZcw%2F2XLGnVHlAB1vJxaWJmFm%2BGZ%2Bhzg0Zo%2BB3qLd4eWoGztA%3D%3D",
});

 
var map = new cityfun.Map({
  container: "map",
  center: [120.70044254024515, 31.301339366724918],
  zoom: 12,
  pitch: 60,
  style: "http://webres.cityfun.com.cn/szmap/szmap_dark/3857/map_dark.json",
});

map.on("load", function() {});
map.on("load", function() {
  // arcgis  dynamic
  // map.addArcGISDynamicLayer(
  //   "http://192.168.2.138:6080/arcgis/rest/services/SIP/qgxzqh/MapServer",
  //   {
  //     layerid: "esri-dynamic-layer",
  //   }
  // );
  // // arcgis tile
  // map.addArcGISTileLayer( "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/ESRI/01f1dcb7-c9fc-f1a1-c83b-39f987c7d5ad",{
  //     layerid: "esri-tile",
  //   }
  // );
  // // geoserver wms
  // map.addWMSLayer(
  //   "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/OGC/ea971827-12d3-1c12-ac45-39f987c7d5ad",
  //   {
  //     layerid: "wms01",
  //     layers: "WJKFQ_Z:CSZL_AQJG_AQSCSG,WJKFQ_Z:CSZL_CSBJ_BKT",
  //   }
  // );
  // 专题图 http://webres.cityfun.com.cn/sip_std_zt/3857/jzgdfb.json
  // 矢量style
  //   .loadMapStyle(
  //     "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/VM/8c248ab6-616f-702d-a932-39f987c7d5ad"
  //   )
  //   .then((styleObj) => {
  //     map.addMapStyle(styleObj, {
  //       styleid: "special-id",
  //     });
  //   });
  //  wmts  http://map2.cityfun.com.cn/geoserver/gwc/service/wmts
  // map.addWMTSLayer("http://192.168.2.64/geocms/v1/cf/rest/services/MapService/OGC/3abd92a4-0da8-48d4-9905-dac2c5e46caf", {
  //   layerid: "geo-server-wmts",
  //   layer: "SZ_BaseMap:SZ_BaseMap_10",
  // });
  // arcgis tile
  // map.addArcGISTileLayer( "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/ESRI/ff0a52e3-f9e0-4cc9-8034-5d170dfb4b9c",{
  //     layerid: "esri-tile",
  //   }
  // );
});

// style: {
//   version: 8,
//   sources: {
//     // vlayers: {
//     //   type: "vector",
//     //   url: "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/VT/aa4cfd98-e58a-61dc-de37-39f987c7d5ad?token=Y46MGb0cSrS57uhfERXk8Om7TJv7TfqHR9dzlyiMXHqwHLk4TQz%2BHZ7abgItY0zD8JmSbQZcw%2F2XLGnVHlAB1vJxaWJmFm%2BGZ%2Bhzg0Zo%2BB3qLd4eWoGztA%3D%3D&geosite=@cf",
//     // },
//   },
//   layers: [
//     // {
//     //   id: "maine",
//     //   type: "fill",
//     //   source: "vlayers",
//     //   "source-layer": "landuse",
//     //   layout: {},
//     //   paint: {
//     //     "fill-color": "#088",
//     //     "fill-opacity": 0.8,
//     //   },
//     // },
//   ],
// },

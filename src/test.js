 
cityfun.setConfig({
  cfToken:
  "yAkqtubPdGtD61/l8DNLXhQrBCUcCeCQR9dzlyiMXHp3Qe9zsEtfy9k0YMAmXwOzx9p6BulJNYrLbejxUp6zYWpHhnKqZcgr3FjHGv8ybhHqLd4eWoGztA=="
});

var map = new cityfun.Map({
  container: "map",
  center: [120.70044254024515, 31.301339366724918],
  zoom: 12,
  pitch: 60,
  style: "http://192.168.2.76/geocms/v1/cf/rest/services/MapService/VT/c772577d-6200-4469-8147-35d8009ab728",
});

map.on("load", function() {});
map.on("load", function() {
  // arcgis  dynamic
  map.addArcGISDynamicLayer(
    "http://192.168.2.76/geocms/v1/cf/rest/services/MapService/ESRI/ced7d6b9-2aca-48f9-89be-d0376ced9de7",{
      layerid: "esri-dynamic-layer",
    }
  );
  // arcgis tile
  // map.addArcGISDynamicLayer( "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/ESRI/ac785b13-7b7f-4e7e-aad3-4ba67f053eb0",{
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
    // isFlyTo:false,// 默认false
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

 

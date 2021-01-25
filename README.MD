#  cityfun-gl  开发文档

## 开发指南

>  cityfun-gl SDK基于mapbox-gl的扩展库，不影响使用原生mapboxgl的功能。具体API参考[mapboxgl官方文档](https://docs.mapbox.com/mapbox-gl-js/api/)

### 账号和获取密钥

>  通过平台账号密码获取

### 安装

cityfun-gl目前支持三种坐标系，wgs84地理坐标系(ESPG:4326)，国家2000坐标系(EPSG:4490)，web墨卡托投影坐标系（EPSG:3857）。不同坐标系统需要安装指定的SDK包；

- EPSG:3857

```javascript
<script src='./libs/cityfun/cityfun.min.css'></script>
<link href='./libs/cityfun/cityfun.min.js' rel='stylesheet' />
```

或，使用npm安装

```javascript
npm i cityfun-gl
import cityfun from 'cityfun-gl'
```

- EPSG:4326和EPSG:4490

```javascript
<script src='./libs/cityfun/cityfun-4490.min.css'></script>
<link href='./libs/cityfun/cityfun-4490.min.js' rel='stylesheet' />
```

或，使用npm安装

```javascript
npm i cityfun-gl-4490
import cityfun from 'cityfun-gl'
```

### Hello World

使用cityfun-gl SDK创建一个简单的示例。

**1、获取cfToken**

> 通过平台账号密码获取

**2、准备页面**

根据HTML标准，每一份HTML文档都应该声明正确的文档类型，我们建议您使用最新的符合HTML5规范的文档声明：

> ```html
> <!DOCTYPE html>
> ```

您也可以根据需要选择其他类型的文档声明，这样浏览器会以标准的方式对页面进行渲染，保证页面最大的兼容性。我们不建议您使用quirks模式进行开发。

**3、适应移动端页面展示**

下面我们添加一个meta标签，以便使您的页面更好的在移动平台上展示。

> ```html
> <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />  
> ```

**4、设置容器样式**

设置容器样式大小，使地图充满整个浏览器窗口：

```html
<style type="text/css">  
    html{height:100%}    
    body{height:100%;margin:0px;padding:0px}    
    #container{height:100%}    
</style> 
```

**4、引用cityfun-gl文件**

```javascript
<script src='./libs/cityfun/cityfun.min.css'></script>
<link href='./libs/cityfun/cityfun.min.js' rel='stylesheet' />
```

**5、创建地图容器元素**

地图需要一个HTML元素作为容器，这样才能展现到页面上。这里我们创建了一个div元素。

```html
<div id="container"></div> 
```

**6、设置地图配置信息**

- cfToken:使用平台账号获取的秘钥
- ESPG:指定地图服务使用的坐标系统

> 注意：3857(web墨卡托投影坐标系)；4490（cgcs2000）；4326（wgs84坐标）

```javascript
cityfun.setConfig({
  cfToken:
    "you token",
  EPSG: 3857,
});
```

**7、创建地图实例**

位于cityfun命名空间下的Map类表示地图，通过new操作符可以创建一个地图实例。

> 注意：创建地图对象时指定参数中，style必须是平台发布的矢量地图服务

```javascript
var map = new cityfun.Map({
  container: "container",
  center: [120.70044254024515, 31.301339366724918],
  zoom: 12,
  pitch: 60,
  style:"http://192.168.2.76/geocms/v1/cf/rest/services/MapService/VT/c772577d-6200-4469-8147-35d8009ab728",
});
```

**8、监听地图加载完成事件**

```javascript
map.on("load", function() {});
```

**9、定位地图中心点**

```javascript
map.on("load", function() {
    map.flyTo({center:[116.38, 39.90]});
});
```

10、完成实例

```javascript
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>地图展示</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <style>
      body,
      html,
      #container {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
      }
    </style>
    <link href="cityfun.min.css" rel="stylesheet" />
  </head>
  <body>
    <div id="container"></div>
    <script type="text/javascript" src="cityfun.min.js"></script>
    <script>
      cityfun.setConfig({
        cfToken:
          "your access token",
        EPSG: 3857,
      });
      var map = new cityfun.Map({
        container: "container",
        center: [120.70044254024515, 31.301339366724918],
        zoom: 12,
        pitch: 60,
        style:
          "http://192.168.2.76/geocms/v1/cf/rest/services/MapService/VT/c772577d-6200-4469-8147-35d8009ab728",
      });
      map.on("load", function() {
        map.flyTo({center:[116.38, 39.90]});
      });
    </script>
  </body>
</html>

```

### ArcGIS 瓦片服务

> 加载arcgis server 发布的瓦片服务

```javascript
map.on("load", function() {
  map.addArcGISDynamicLayer(
    "http://192.168.2.76/geocms/v1/cf/rest/services/MapService/ESRI/ced7d6b9-2aca-48f9-89be-d0376ced9de7",{
      layerid: "esri-dynamic-layer",
    }
  );
});
```

### ArcGIS 动态服务

```javascript
map.on("load", function() {
  map.addArcGISDynamicLayer(
    "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/ESRI/ac785b13-7b7f-4e7e-aad3-4ba67f053eb0",{
      layerid: "esri-tile",
    }
  );
});
```

### OGC WMS服务

```javascript
map.on("load", function() {
  map.addWMSLayer(
    "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/OGC/ea971827-12d3-1c12-ac45-39f987c7d5ad",{
      layerid: "wms01",
      layers: "WJKFQ_Z:CSZL_AQJG_AQSCSG,WJKFQ_Z:CSZL_CSBJ_BKT",
    }
  );
});
```

### OGC WMTS服务

```javascript
map.on("load", function() {
  map.addWMTSLayer(
    "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/OGC/3abd92a4-0da8-48d4-9905-dac2c5e46caf",{
      layerid: "geo-server-wmts",
      layer: "SZ_BaseMap:SZ_BaseMap_10",
    }
  );
});
```

### 矢量地图服务

> 注意：矢量地图服务，服务配置为符合mapbox矢量切片样式标准。可以通过isFlyTo参数来指定是否定位到服务配置文件中指定的相机参数。

```javascript
map.on("load", function() {
  map
    .loadMapStyle(
      "http://192.168.2.64/geocms/v1/cf/rest/services/MapService/VM/8c248ab6-616f-702d-a932-39f987c7d5ad"
    )
    .then((styleObj) => {
      map.addMapStyle(styleObj, {
        styleid: "special-id",
        isFlyTo: false, // 默认false
      });
    });
});
```

## API

**1、addArcGISTileLayer(url,options)**

加载ArcGIS切片服务

**参数：**

- url:string;
- options:Object ;
  - layerid:string 服务地址

**2、addArcGISDynamicLayer（url,options）**

加载ArcGIS动态地图服务

**参数：**

- url:string;
- options:Object ;
  - layerid:string 服务地址

**3、addWMSLayer(url,options)**

加载WMS地图服务

**参数：**

- url:string;服务请求地址 
- options:Object 
  - layerid:string;图层id
  - layers:string; wms子图层id,多个用逗号隔开

**4、addWMTSLayer(url,options)**

加载WMS地图服务

**参数：**

- url:string;服务请求地址 
- options:Object 
  - layerid:string; 图层id
  - layers:string; wmts服务子图层，多个用逗号隔开"}

**5、addMapStyle(styleJson,options)**

加载专题图样式，mapbox标准地图样式

**参数：**

- styleJson:Object ；满足mapbox样式标准JSON对象
- options:Object
  - styleid:string;样式id专题图图层组（可能多个图层）id，
  - isBaseMap:string ；true|false ；可选参数
  - isFlyTo; true|false ；是否定位到相机参数

**6、removeMapStyle(styleid)**

移除专题图样式，mapbox标准地图样式

**参数：**

- styleid:string；样式ID

**7、addLayer(layer,beforeId)**

重写添加图层方法，和原生一样使用，内部做了处理

**参数：**

- 参考mapbox官网

**8、changeBaseMap(data,options)**

切换mapbox底图

**参数：**

- data:object；mapbox标注样式JSON对象
- options
  - styleid:string 样式ID
  - isBaseMap:boolean ；是否是底图

**9、getThunbnail(options)**

获取缩略图

**参数：**

- data:object
  -  type:string; 输出类型；默认‘image/jpeg’
  - quality:number;图片质量，默认1
  - widht:number；图片宽度，默认300
  - height:number;图片高度，默认300
  - saveAsFile:boolearn:默认，false
  - fileName:string，文件名称

**10、getScreenshot(options)**

地图截图

**参数：**

- data:object
  -  type:string; 输出类型；默认‘image/jpeg’
  - quality:number;图片质量，默认1
  - saveAsFile:boolearn:默认，false
  - fileName:string，文件名称

## 示例DEMO










!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("cityfun",[],t):"object"==typeof exports?exports.cityfun=t():e.cityfun=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=108)}({108:function(e,t){cityfun.setConfig({mapboxToken:"pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw",cfToken:"Y46MGb0cSrS57uhfERXk8Om7TJv7TfqHR9dzlyiMXHqwHLk4TQz%2BHZ7abgItY0zD8JmSbQZcw%2F2XLGnVHlAB1vJxaWJmFm%2BGZ%2Bhzg0Zo%2BB3qLd4eWoGztA%3D%3D"});var n=new cityfun.Map({container:"map",center:[120.70044254024515,31.301339366724918],zoom:12,pitch:60,style:"http://192.168.2.64/geocms/v1/cf/rest/services/MapService/VM/8c248ab6-616f-702d-a932-39f987c7d5ad"});n.on("load",(function(){n.addArcGISDynamicLayer("http://192.168.2.138:6080/arcgis/rest/services/SIP/qgxzqh/MapServer",{layerid:"esri-dynamic-layer"})}))}}).default}));
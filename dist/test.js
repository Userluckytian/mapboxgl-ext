!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("cityfun",[],t):"object"==typeof exports?exports.cityfun=t():e.cityfun=t()}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,n),c.l=!0,c.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)n.d(o,c,function(t){return e[t]}.bind(null,c));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=108)}({108:function(e,t){cityfun.setToken("pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw");var n=new cityfun.Map({container:"map",center:[120.70044254024515,31.301339366724918],zoom:12,pitch:60,style:"http://webres.cityfun.com.cn/szmap/szmap_dark/3857/map_dark.json"}),o=null;n.on("load",(function(){o=new cityfun.MeasureTool(n),document.getElementById("distance").onclick=function(){o.activate("distance")},document.getElementById("area").onclick=function(){o.activate("area")},document.getElementById("disable").onclick=function(){o.disable()},document.getElementById("clear").onclick=function(){o.clear()},document.getElementById("deactivate").onclick=function(){o.deactivate()}}))}}).default}));
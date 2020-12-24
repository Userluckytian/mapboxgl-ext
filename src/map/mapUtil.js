import { config } from "../config";
import { isObject } from "../utils/utils";

/**
 * 网络请求
 * @param {*} opt
 */
export function ajax(opt) {
  opt = opt || {};
  opt.method = opt.method.toUpperCase() || "POST";
  opt.url = opt.url || "";
  opt.async = opt.async || false;
  opt.data = opt.data || null;
  opt.success = opt.success || function() {};
  var xmlHttp = null;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var params = [];
  for (var key in opt.data) {
    params.push(key + "=" + opt.data[key]);
  }
  var postData = params.join("&");
  if (opt.method.toUpperCase() === "POST") {
    xmlHttp.open(opt.method, opt.url, opt.async);
    xmlHttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=utf-8"
    );
    xmlHttp.send(postData);
  } else if (opt.method.toUpperCase() === "GET") {
    if (postData) {
      xmlHttp.open(opt.method, opt.url + "?" + postData, opt.async);
    } else {
      xmlHttp.open(opt.method, opt.url, opt.async);
    }
    xmlHttp.send(null);
  }
  if (opt.async) {
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        opt.success(JSON.parse(xmlHttp.responseText));
      }
    };
  } else {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      opt.success(JSON.parse(xmlHttp.responseText));
    }
  }
}
export function createCavans(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
export function isMapboxSevUrl(url) {
  // mapbox://styles
  let reg = /(^mapbox:\/\/style)|(.json$)/;
  return reg.test(url);
}
export function isImageBase64Url(url){
  let reg = /^data:image\//;
  return reg.test(url);
}
/**
 * 创建地图-读取接口获取Style JSON
 * @param {*} styleurl
 */
export function getStyleJsonByUrl(styleurl) {
  let styleJson = null;
  ajax({
    method: "get",
    url: styleurl,
    async: false,
    success: function(response) {
      styleJson = response;
    },
  });
  return isObject(styleJson) ? styleJson : JSON.parse(styleJson);
}
/**
 * 获取token拼接服务地址
 * @param {*} url
 */
export function getTokenUrl(url) {
  let { cfToken } = config;
  if (url.indexOf("?") > -1) {
    return cfToken ? url + "&token=" + cfToken : url;
  } else {
    return cfToken ? url + "?token=" + cfToken : url;
  }
}
 
/**
 * 获取token拼接服务地址
 * @param {*} url
 */
export function getBaseMapTokenUrl(url) {
  let { cfToken } = config;
  return cfToken ? `${url}?token=${cfToken}&geosite=@cf` : url;
}

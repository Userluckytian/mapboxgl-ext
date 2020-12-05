import { isObject } from '../utils/utils';

export function getMapOptions(options) {
    let { style } = options;
    let reg = /(^mapbox)|(.json$)/;

    if (!reg.test(style) && !isObject(style)) {
        // return   await (await fetch(style)).json()
        return options;
    } else {
        return options;
    }
}

export function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || false;
    opt.data = opt.data || null;
    opt.success = opt.success || function() {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    } else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    if (opt.async) {
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                // 有传入success回调就执行
                opt.success(JSON.parse(xmlHttp.responseText));
            }
        };
    } else {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(JSON.parse(xmlHttp.responseText));
        }
    }
}
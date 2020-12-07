import mapboxgl from 'mapbox-gl';
import { config } from '../config';
import { merge } from '../utils/utils';
import LogoControl from '../controls/LogoControl';
import { getMapOptions, ajax } from './mapUtil';

export class Map extends mapboxgl.Map {
    constructor(options) {
            let { style } = options;
            let obj = null;
            ajax({
                method: 'get',
                url: style,
                async: false,
                success: function(response) {
                    obj = response;
                },
            });
            options.style = obj;
            super(options);
        }
        /**
         *加载arcgis 切片服务
         * @param {*} url
         * @param {*} options
         */
    addArcGISTileLayer(url, options) {
            let { layerid } = options;
            this.addSource(layerid, {
                type: 'raster',
                tiles: [`${url}/tile/{z}/{y}/{x}`],
                tileSize: 256,
            });
            this.addLayer({
                id: layerid,
                type: 'raster',
                source: layerid,
                layout: {},
                paint: {},
            });
        }
        /**
         *加载WMS服务
         * @param {*} url
         * @param {*} options
         */
    addWMSLayer(url, options) {
            let { layerid, layers } = options;
            this.addSource(layerid, {
                type: 'raster',
                tiles: [
                    `${url}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&tiled=true&LAYERS=${layers}&exceptions=application/vnd.ogc.se_inimage&tiles&WIDTH=256&HEIGHT=256&SRS=EPSG:3857&STYLES=&BBOX={bbox-epsg-3857}`,
                ],
                tileSize: 256,
            });
            this.addLayer({
                id: layerid,
                type: 'raster',
                source: layerid,
                paint: {},
            });
        }
        /**
         *加载WMTS
         * @param {*} url
         * @param {layerid,layer} options
         */
    addWMTSLayer(url, options) {
            let { layerid, layer } = options;
            this.addSource(layerid, {
                type: 'raster',
                tiles: [
                    `
                 ${url} ? SERVICE = WMTS & REQUEST = GetTile & layer = $ { layer } & Version = 1.0 .0 & TILEMATRIX = EPSG : 900913: { z } & TILEMATRIXSET = EPSG: 900913 & format = image % 2 Fpng & TileCol = { x } & TileRow = { y }
                 `,
                ],
                tileSize: 256,
            });
            this.addLayer({
                id: layerid,
                type: 'raster',
                source: layerid,
                paint: {},
            });
        }
        /**
         * 加载标注mapbox样式文件
         * @param {*} styleUrl 
         * @param {*} options 
         */
        // addStyleLayers(styleJson, options) {
        //     Object.keys(styleJson.sources).forEach(key => {
        //         if (!this.mapboxmap.getSource(key)) {
        //             self.mapboxmap.addSource(key, styleJson.sources[key]);
        //         }
        //     });
        //     if (styleJson.sprite) {
        //         addImages(styleJson.sprite);
        //     }
        //     for (const layer of styleJson.layers) {
        //         let layerid = layer.id;
        //         if (option && option.idbeg) {
        //             layerid = option.idbeg + layerid;
        //             layer.id = layerid;
        //         }
        //         if (!self.mapboxmap.getLayer(layerid)) {
        //             if (option && option.baseMap) {
        //                 this.addLayer(layer);
        //             } else {
        //                 this.addLayer(layer);
        //             }
        //         }
        //     }
        // }

    // addImages(spritePath) {
    //     const self = this;
    //     this.http.get(`${spritePath}.json`).toPromise().then(spriteJson => {
    //         const img = new Image();
    //         img.onload = function() {
    //             Object.keys(spriteJson).forEach(key => {
    //                 // console.log(key)
    //                 const spriteItem = spriteJson[key];
    //                 const { x, y, width, height } = spriteItem;
    //                 const canvas = self.createCavans(width, height);
    //                 const context = canvas.getContext('2d');
    //                 context.drawImage(img, x, y, width, height, 0, 0, width, height);
    //                 const base64Url = canvas.toDataURL('image/png');
    //                 this.loadImage(base64Url, (error, simg) => {
    //                     if (this.hasImage(key)) {
    //                         this.removeImage(key);
    //                     }
    //                     this.addImage(key, simg);
    //                 });
    //             });
    //         };
    //         img.crossOrigin = 'anonymous';
    //         img.src = `${spritePath}.png`;
    //     });
    // }
}
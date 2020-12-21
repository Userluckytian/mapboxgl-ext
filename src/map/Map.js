import mapboxgl from 'mapbox-gl';
import { saveFile } from '../utils/file';
// import { config } from '../config';
// import { merge } from '../utils/utils';
// import LogoControl from '../controls/LogoControl';
import { ajax, createCavans } from './mapUtil';
import { isObject, merge } from '../utils/utils';
export class Map extends mapboxgl.Map {
    constructor(options) {
            let { style } = options;
            let obj = null;
            // 传入url是接口，访问接口，认证地图访问（只能同步请求）
            isObject(style);
            if (isObject(style)) {
                options.style = style;
                super(options);
            } else {
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
         *加载arcgis动态服务
         * @param {*} url
         * @param {*} options
         */
    addArcGISDynamicLayer(url, options) {
        let { layerid,layers } = options;
        this.addSource(layerid, {
            type: 'raster',
            tiles: [`${url}/export?dpi=96&transparent=true&format=png8&bbox=&SRS=EPSG:3857&STYLES=${layers}&WIDTH=256&HEIGHT=256&f=imageBBOX={bbox-epsg-3857}`],
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
                 ${url}?SERVICE=WMTS&REQUEST=GetTile&layer=${layer}&Version=1.0.0&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&format=image%2Fpng&TileCol={x}&TileRow={y}
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
    addMapStyle(styleJson, options) {
            let { styleid, isBaseMap } = options;
            if (typeof styleJson != 'object') {
                throw new TypeError('addMapStyle需要传入对象类型参数');
            }
            let { zoom, center, pitch } = styleJson;
            Object.keys(styleJson.sources).forEach((key) => {
                if (!this.getSource(key)) {
                    this.addSource(key, styleJson.sources[key]);
                }
            });
            if (styleJson.sprite) {
                this._addImages(styleJson.sprite);
            }
            const layerMetaData = {
                isBaseMap: isBaseMap || false,
                aid: `${styleid}`,
            };
            for (const layer of styleJson.layers) {
                let layerid = layer.id;
                layer.metadata = layerMetaData;
                if (!this.getLayer(layerid)) {
                    let firstSpeLayer = this._findFirstSpeLayer();
                    if (isBaseMap && firstSpeLayer) {
                        this.addLayer(layer, firstSpeLayer.id);
                    } else {
                        this.addLayer(layer);
                    }
                }
            }
            if (zoom) {
                this.setZoom(zoom);
            }
            if (pitch) {
                this.setPitch(pitch);
            }
            if (center) {
                this.setCenter(center);
            }
        }
        /**
         * 解析雪碧图
         * @param {*} spritePath
         */
    _addImages(spritePath) {
            let self = this;
            fetch(`${spritePath}.json`)
                .then((result) => result.json())
                .then((spriteJson) => {
                    const img = new Image();
                    img.onload = function() {
                        Object.keys(spriteJson).forEach((key) => {
                            const spriteItem = spriteJson[key];
                            const { x, y, width, height } = spriteItem;
                            const canvas = createCavans(width, height);
                            const context = canvas.getContext('2d');
                            context.drawImage(img, x, y, width, height, 0, 0, width, height);
                            const base64Url = canvas.toDataURL('image/png');
                            self.loadImage(base64Url, (error, simg) => {
                                if (self.hasImage(key)) {
                                    self.removeImage(key);
                                }
                                // console.log(1);
                                self.addImage(key, simg);
                            });
                        });
                    };
                    img.crossOrigin = 'anonymous';
                    img.src = `${spritePath}.png`;
                });
        }
        /**
         * 通过styleid移除图层
         * @param {*} styleid
         */
    removeMapStyle(styleid) {
            let { layers } = this.getStyle();
            layers.forEach((layer) => {
                if (layer.metadata && layer.metadata.aid === styleid) {
                    this.removeLayer(layer.id);
                }
            });
        }
        /**
         * 重写方法，metadata记录是否是底图，保证所有添加到地图中的图片，含有是否是底图标识
         * @param {*} layer
         * @param {*} beforeId
         */
    addLayer(layer, beforeId) {
            if (!layer.metadata) {
                layer.metadata = {
                    isBaseMap: false,
                };
            }
            super.addLayer(layer, beforeId);
        }
        /**
         * 查询第一个非底图图层
         */
    _findFirstSpeLayer() {
            let { layers } = this.getStyle();
            for (let layer of layers) {
                if (layer.metadata && layer.metadata.isBaseMap == false) {
                    return layer;
                }
            }
            return null;
        }
        /**
         * 移除底图
         */
    _removeBaseStyle() {
            let { layers } = this.getStyle();
            for (let layer of layers) {
                if (!layer.metadata || (layer.metadata && layer.metadata.isBaseMap == true)) {
                    this.removeLayer(layer.id);
                }
            }
        }
        /**
         * 切换地图
         * @param {*} data
         * @param {*} options
         */
    changeBaseMap(data, options) {
            let opt = Object.assign(options, {
                isBaseMap: true,
            });
            this._removeBaseStyle();
            this.addMapStyle(data, opt);
        }
        /**
         * 图层 id 数组
         * @param layerids
         */
    removeLayers(layerids, rimg = true) {
            for (let id of layerids) {
                // console.log(999, layerids);
                if (this.getLayer(id)) {
                    this.removeLayer(id);
                }
                if (this.getSource(id)) {
                    this.removeSource(id);
                }
                if (this.hasImage(id) && rimg) {
                    this.removeImage(id);
                }
            }
        }
        /**
         * 添加默认图层组
         */
    addGroupLayer() {
            this.addLayer({
                id: 'cityfun.null.fill',
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: null,
                },
            });
            this.addLayer({
                id: 'cityfun.null.line',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: null,
                },
            });
            this.addLayer({
                id: 'cityfun.null.symbol',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: null,
                },
            });
            // this.addLayer({
            //     id: 'sp-layer-hot',
            //     type: 'heatmap',
            //     source: {
            //         type: 'geojson',
            //         data: null,
            //     },
            // });
        }
        // 获取缩略图
    getThumbnail(options) {
            options = merge({
                    type: 'image/jpeg',
                    quality: 1,
                    width: 300,
                    height: 300,
                    saveAsFile: false,
                    fileName: `MapThumbnail_${new Date().getTime()}`,
                },
                options || {}
            );
            const { type, quality, width, height, saveAsFile, fileName } = options;
            const that = this;
            return new Promise((resolve, reject) => {
                that.once('render', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const render = that.getCanvas();
                    const ctx = canvas.getContext('2d');
                    ctx.beginPath();
                    ctx.drawImage(
                        render,
                        (render.width - width) / 2,
                        (render.height - height) / 2,
                        width,
                        height,
                        0,
                        0,
                        width,
                        height
                    );
                    ctx.save();
                    const fileData = canvas.toDataURL(type, quality);

                    if (saveAsFile) {
                        saveFile(fileData, fileName);
                    } else {
                        resolve(fileData);
                    }
                });
                that.setBearing(that.getBearing());
            });
        }
        // 获取地图截图
    getScreenshot(options) {
        options = merge({
                type: 'image/jpeg',
                quality: 1,
                saveAsFile: false,
                fileName: `MapScreenShot_${new Date().getTime()}`,
            },
            options || {}
        );
        const { type, quality, saveAsFile, fileName } = options;
        const that = this;
        return new Promise((resolve, reject) => {
            that.once('render', () => {
                const fileData = that.getCanvas().toDataURL(type, quality);
                if (saveAsFile) {
                    saveFile(fileData, fileName);
                } else {
                    resolve(fileData);
                }
            });
            that.setBearing(that.getBearing());
        });
    }
    setCursor(type) {
        const canvas = this.getCanvasContainer();
        canvas.style.cursor = type || '';
    }
    bringToFront(layerId, options) {
        if(!layerId) return;
        let layer = this.getLayer(layerId);
        if(!layer) return;
        layer = layer.serialize();
        this.removeLayer(layer);
        this.addLayer(layer);
    }
}
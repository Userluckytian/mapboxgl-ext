import mapboxgl from '@cgcs2000/mapbox-gl';

import merge from 'lodash/merge';
import { distance, area, guid, measureTextWidth, bindAll, formatNum, throttle } from '../utils/index';
import {ALTAS_TEMP, POINT_SOURCE_ID, LINE_SOURCE_ID, FILL_SOURCE_ID, DRAGGING_POINT_SOURCE_ID, 
    DISTANCE_POINT_LAYER_ID, DISTANCE_LINE_LAYER_ID, AREA_OUTLINE_LAYER_ID, 
    AREA_FILL_LAYER_ID, AREA_POINT_LAYER_ID} from '../core/constant';
import  {point} from '../utils/gis';

const SOURCES = [POINT_SOURCE_ID, LINE_SOURCE_ID, FILL_SOURCE_ID, DRAGGING_POINT_SOURCE_ID];


  class MeasureTool {
    constructor(map, options) {
        if(!map) {
            throw new Error('Add Measure error, Map is null');
        }
        this.map = map;
        this.options = merge({
            loop: false,
            unit: 'km', 
            lineColor: '#f90', 
            lineWidth: 3,
            pointColor: '#fff',
            pointSize: 4,
            fill: true,
            fillOpacity: 0.1,
            cursor: 'default',
            dashArray: null,
            zIndex: 9,
        }, options || {});
        // 测量结果
        this.result = 0;

        // 默认测量类型为距离
        this.type = 'distance';


        // 测量点
        this.points = [];

        // 初始化测量图层
        this._initSourceAndLayer();

        // 测量ID
        this.measureActionId = null;

        // 测量结果
        this.measureActions = {};

        // 是否在测量中
        this.isMeasuring = false;

        // 最后一个移动中的点
        this.lastPoint = null;

        // 是否拖动中
        this.draggingFlag = false;

        // 鼠标是否在点上
        this.cursorOverPointFlag = false;

        // 拖动目标元素
        this.draggingFeature = null;

        bindAll(['_clickEvent', '_mouseMoveEvent', '_mouseUpEvent', '_dblClickEvent', 
        '_draggingMouseDown', '_draggingMouseMovePoint', '_draggingMouseUpPoint',
        '_overDraggingPoint'], this);

        // this._clickEvent = throttle(this.__clickEvent, 500, this);

    }

    // 是否在测量中
    isActivate() {
        return this.isMeasuring;
    }

    // 初始化图层
    _initSourceAndLayer() {
        const {map, options} = this;
        if(!map) return;
        const {pointSize, pointColor, lineColor, lineWidth, 
            fillOpacity, fill, dashArray, zIndex} = options;



        SOURCES.forEach((sid) => {
            map.addSource(sid, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
        });

        // 添加轮廓图层
        map.addLayer({
            id: AREA_OUTLINE_LAYER_ID,
            source: LINE_SOURCE_ID,
            type: 'line',
            paint: {
                'line-width': lineWidth,
                'line-color': lineColor,
            },
            metadata: {
                type: "atlas-temp",
                zIndex
            },
            filter: ['==', 'type', 'area']
        });

        // 添加填充图层
        if(fill) {
            map.addLayer({
                id: AREA_FILL_LAYER_ID,
                source: FILL_SOURCE_ID,
                type: 'fill',
                paint: {
                    'fill-color': '#fff',
                    'fill-opacity': fillOpacity
                },
                metadata: {
                    type: "atlas-temp",
                    zIndex
                },
                filter: ['==', 'type', 'area']
            });
        }

        // 添加点图层
        map.addLayer({
            id: AREA_POINT_LAYER_ID,
            source: POINT_SOURCE_ID,
            type: 'circle',
            paint: {
                'circle-radius': pointSize,
                'circle-color': pointColor,
                'circle-stroke-width': 1,
                'circle-stroke-color': lineColor
            },
            metadata: {
                type: "atlas-temp",
                zIndex
            },
            filter: ['==', 'type', 'area']
        });

        // 添加轮廓图层
        map.addLayer({
            id: DISTANCE_LINE_LAYER_ID,
            source: LINE_SOURCE_ID,
            type: 'line',
            paint: {
                'line-width': lineWidth,
                'line-color': lineColor,
            },
            metadata: {
                type: "atlas-temp",
                zIndex
            },
            filter: ['==', 'type', 'distance']
        });

        // 添加点图层
        map.addLayer({
            id: DISTANCE_POINT_LAYER_ID,
            source: POINT_SOURCE_ID,
            type: 'circle',
            paint: {
                'circle-radius': pointSize,
                'circle-color': pointColor,
                'circle-stroke-width': 2,
                'circle-stroke-color': lineColor
            },
            metadata: {
                type: "atlas-temp",
                zIndex
            },
            filter: ['==', 'type', 'distance']
        });

        map.addLayer({
            id: DRAGGING_POINT_SOURCE_ID,
            source: DRAGGING_POINT_SOURCE_ID,
            type: 'circle',
            paint: {
                'circle-radius': pointSize * 1.25,
                'circle-color': pointColor,
                'circle-stroke-width': 3,
                'circle-stroke-color': lineColor
            },
            metadata: {
                type: "atlas-temp",
                zIndex
            }
        });

        this.pointSource = map.getSource(POINT_SOURCE_ID);
        this.lineSource = map.getSource(LINE_SOURCE_ID);
        this.fillSource = map.getSource(FILL_SOURCE_ID);
        this.draggingSource = map.getSource(DRAGGING_POINT_SOURCE_ID);
    }

    _beforeToFront(type) {
        const { map } = this;
        if(!map) return;
        const layers = map.getStyle().layers.filter(ly => ly.id.indexOf(`${ALTAS_TEMP}-ms-${type}`) >= 0);
        layers.forEach((layer) => {
            map.bringToFront(layer.id);
        });
    }

    activate(type, callback) {
        const { map } = this;
        this._beforeToFront(type);
        if(!map || (type === this.type && this.isMeasuring)) return;
        this.type = type || 'distance';
        if(this.isMeasuring) return;
        this.callback = callback;
        this.enable();
        this.originMapDoubleClickZoom = map.doubleClickZoom.isEnabled();
        map.on('click', this._clickEvent) // 开始测量
        map.on('mousemove', this._overDraggingPoint);
        map.on('mousedown', this._draggingMouseDown);
    }

    _clickEvent(e) {
        // {type: 'Feature', geometry: {type: 'Point', coordinates: []}, properties: {}}
        if(!this.isMeasuring) return;
        
        const { measureActionId, measureActions, type, map } = this;
        const lngLat = e.lngLat.toArray();
        const measureAction = measureActions[measureActionId];
        if(this.originMapDoubleClickZoom) {
            map.doubleClickZoom.disable();
        }
        if( !measureActionId && !measureAction ) {
            const id = this.measureActionId = guid(true);
            this.measureActions[id] = {
                type,
                points: [lngLat],
                status: 'start',
                result: 0,
                spans: [],
                results: []
            };
            map.on('mousemove', this._mouseMoveEvent); // 更新测量 
            map.on('mouseup', this._mouseUpEvent); // 添加测量结点，更新测量信息
            map.on('dblclick', this._dblClickEvent); // 结束一个测量
        } else if(measureActionId && measureAction) {
            const lastPoint = measureAction.points[measureAction.points.length - 1];
            if(lastPoint[0] !== lngLat[0] && lastPoint[1] !== lngLat[1]) {
                measureAction.points.push(lngLat);
            }
            measureAction.status = 'ing';
        }
        this.isclick = true;
        this.updateMeasureActions();
        this.updateSource();
    }

    _mouseMoveEvent(e) {
        if(!this.isMeasuring) return;
        const { measureActionId, measureActions } = this;
        if(!measureActionId) return;
        const lngLat = e.lngLat.toArray();
        const measureAction = measureActions[measureActionId];
        if(!measureAction) return;
        const {type, points} = measureAction;
        // const target = type === 'distance' ? points : points[0];
        if(this.isclick) {
            points.push(lngLat);
            this.isclick = false;
        } else if(points.length > 1)  {
            points[points.length - 1] = lngLat;
        }
        this.updateMeasureActions(measureActionId);
        this.updateSource();
        this.updateMeasureSpan(measureActionId);
    }

    _mouseUpEvent(e) {
        
    }

    _dblClickEvent(e) {
        if(!this.isMeasuring) return;
        const { measureActionId, measureActions, map } = this;
        if(!measureActionId || !map) return;
        const measureAction = measureActions[measureActionId];
        measureAction.status = 'end';
        this.updateMeasureActions(measureActionId);
        this.updateLastMeasureSpan(measureActionId);
        this.measureActionId = null;
        this.updateSource();
        const {loop} = this.options;
        if(!loop) {
            this.disable();
        }
        setTimeout(() => {
            this.offEvent();
        }, 500);
    }

    updateSource() {
        const { measureActions } = this;
        const sourcePoints = {
            type: 'FeatureCollection',
            features:[]
        };
        const sourceLines = {
            type: 'FeatureCollection',
            features:[]
        };
        const sourcePolygons = {
            type: 'FeatureCollection',
            features:[]
        };
        for(const key in measureActions) {
            const measureAction = measureActions[key];
            const {type, points, status} = measureAction;
            const properties = {
                status,
                type,
                key,
            };
            // const pointCoordinates = type === 'distance' ? points: points[0];
            points.forEach((point, index) => {
                sourcePoints.features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: point
                    },
                    properties: {
                        status,
                        type,
                        key,
                        index
                    }
                });
            });
            const coordinates = points.slice(0).concat([points[0]]);
            sourceLines.features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: type === 'distance' ? points : coordinates
                    // coordinates: points
                },
                properties
            });
            if(type === 'area' && points.length > 2) {
                sourcePolygons.features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        // coordinates: [points.slice(0).concat([points[0]])]
                        coordinates: [coordinates]
                    },
                    properties
                });
            }
        }
        this.pointSource.setData(sourcePoints);
        this.lineSource.setData(sourceLines);
        this.fillSource.setData(sourcePolygons);
        
    }

    updateMeasureActions(id) {
        const { measureActions, measureActionId } = this;
        id = id || measureActionId;
        if(!id || !measureActions) return;
        const measureAction = measureActions[id];
        if(!measureAction) return;
        const {type, points, results} = measureAction;
        if(type === 'distance' && points.length >= 2) {
            let count = 0;
            points.forEach((p, index) => {
                if(index > 0) {
                    count += distance(point(points[index - 1]), point(p));
                    results[index] = count;
                } else {
                    results[index] = 0;
                }
            });
            measureAction.result = count;
        }
        if(type === 'area' && points.length >= 3) {
            const areaResult = area({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [points],
                }
            });
            measureAction.result = areaResult;
            measureAction.results[0] = measureAction.result;
        }
    }

    _formatResult(result, type) {
        if(type === 'distance') {
            return result < 1 ?  `${parseInt(result * 1000)}米` : `${formatNum(result, 2)}公里`;
        }
        if(type === 'area') {
            return result < 10000 ?  `${formatNum(result, 2)}平方米` : `${formatNum(result / 1000 / 1000, 2)}平方公里`;
        }
        return '';
    }

    updateMeasureSpan(id) {
        const {measureActions, map, measureActionId} = this;
        id = id || measureActionId;
        if(!map || !id) return;
        // for(const key in measureActions) {
            // const measureAction = measureActions[key];
            const measureAction = measureActions[id];
            const {type, result, points, spans, results} = measureAction;
            if(type === 'distance') {
                let _result = this._formatResult(result, 'distance');
                points.forEach((point, index) => {
                    const text = index === 0 ? '起点' : this._formatResult(results[index], 'distance');
                    const width = measureTextWidth(text, {
                        family: 'Microsoft Yahei, arial',
                        size: 12
                    });
                    if(!spans[index]) {
                        const el = document.createElement('div');
                        el.className = 'atlas-measure-span';
                        el.innerText = text;
                        spans[index] = new mapboxgl.Marker(el, {offset:[(width / 2) + 15, 0]})
                        .setLngLat(point)
                        .addTo(map);
                    } else {
                        spans[index].setLngLat(point);
                        spans[index].setOffset([(width / 2) + 15, 0]);
                        spans[index]._element.innerText = text;
                    }
                });
                if(id === measureActionId) {
                    const width = measureTextWidth(_result, {
                        family: 'Microsoft Yahei, arial',
                        size: 12
                    });
                    spans[spans.length - 1]._element.innerText = _result;
                    spans[spans.length - 1].setOffset([width / 2 + 15, 0]);
                }
            }
            if(type === 'area' && points.length > 2) {
                spans[0] && spans[0].remove();
                const point = points[points.length - 1];
                const text = `面积：${this._formatResult(result, 'area')}`;
                const width = measureTextWidth(text, {
                    family: 'Microsoft Yahei, arial',
                    size: 12
                });
                const el = document.createElement('div');
                el.className = 'atlas-measure-span';
                el.innerText = text;
                spans[0] = new mapboxgl.Marker(el, {offset:[(width / 2) + 15, 0]})
                .setLngLat(point)
                .addTo(map);
            }
        // }
    }

    updateLastMeasureSpan() {
        const {measureActions, map} = this;
        if(!map) return;
        for(const key in measureActions) {
            const measureAction = measureActions[key];
            const {spans, type, result} = measureAction;
            const span = spans[spans.length - 1];
            if(span && span._element) {
                const text = (type === 'distance' ? '总长：' : '总面积：') + this._formatResult(result, type);
                const width = measureTextWidth(text, {
                    family: 'Microsoft Yahei, arial',
                    size: 12
                });
                span._element.innerText = text;
                span.setOffset([width / 2 + 15, 0]);

                // 添加关闭功能
                if(!measureAction.closeSpan) {
                    const el = document.createElement('div');
                    el.className = 'atlas-measure-span-close';
                    el.title = '点击清除测量';
                    measureAction.closeSpan = new mapboxgl.Marker(el, {offset:[0, -15]})
                        .setLngLat(span.getLngLat())
                        .addTo(map);
                    el.addEventListener('click', () => {
                        this.removeMeasureAction(key);
                    });
                } else {
                    measureAction.closeSpan.setLngLat(span.getLngLat());
                }
            }
        }
    }

    removeMeasureAction(id) {
        if(!id) id = this.measureActionId;
        const {measureActions} = this;
        const measureAction = measureActions[id];
        if(!measureAction) return;
        const{spans, closeSpan} = measureAction;
        spans.forEach((marker) => {
            marker && marker.remove();
        });
        closeSpan && closeSpan.remove();
        delete measureActions[id];
        this.updateSource();
        this.updateMeasureActions();
    }

    
    _draggingMouseDown(e) {
        const {map, isMeasuring} = this;
        if (!map || isMeasuring || !this._draggingHasData()) return;
        const features = map.queryRenderedFeatures(e.point, {layers: [AREA_POINT_LAYER_ID, DISTANCE_POINT_LAYER_ID]});
        if(features.length > 0 && features[0] && features[0].geometry) {
            const feature = features[0];
            this.draggingFeature = feature;
            this.draggingFlag = true;
            this._dragOriginEnable = map.dragPan.isEnabled();
            map.dragPan.disable();
            map.on('mousemove', this._draggingMouseMovePoint);
            map.once('mouseup', this._draggingMouseUpPoint);
        } else {
            this.draggingFeature = null;
        }
    }

    _draggingMouseMovePoint(e) {
        if (!this.draggingFlag || !this.draggingFeature) return;
        const lngLat = e.lngLat.toArray();
        this._setDraggingPoint(lngLat);
        const {draggingFeature, measureActions} = this;
        const props = draggingFeature && draggingFeature.properties;
        if(props) {
            const {key, index} = props;
            const measureAction = measureActions[key];
            if(measureAction) {
                measureAction.points[index] =  lngLat;
                this.updateMeasureActions(key);
                this.updateSource();
                this.updateMeasureSpan(key);
                this.updateLastMeasureSpan(key);
            }
        }
    }

    _draggingMouseUpPoint() {
        const {map, draggingFlag} = this;
        if (!draggingFlag || !map) return;
        map.setCursor();
        this.draggingFlag = false;
        this.draggingFeature = null;
        map.off('mousemove', this._draggingMouseMovePoint);
        if(this._dragOriginEnable) {
            map.dragPan.enable();
        }
        this._clearDraggingPoint();
    }

    _setDraggingPoint(coordinates) {
        if(!coordinates) return;
        this.draggingSource.setData({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates
                },
            }]
        });
    }

    _clearDraggingPoint() {
        this.draggingSource.setData({
            type: 'FeatureCollection',
            features: []
        });
    }

    _draggingHasData() {
        const { draggingSource } = this;
        return draggingSource._data && draggingSource._data.features.length === 1;
    }

    _overDraggingPoint(e) {
        const {map, isMeasuring} = this;
        if(!map || isMeasuring || this.draggingFeature) return;
        const features = map.queryRenderedFeatures(e.point, {layers: [AREA_POINT_LAYER_ID, DISTANCE_POINT_LAYER_ID]});
        if(features.length > 0 && features[0] && features[0].geometry) {
            const feature = features[0];
            this._setDraggingPoint(feature.geometry.coordinates.slice(0));
            map.setCursor('default');
        } else {
            this._clearDraggingPoint();
            map.setCursor();
        }
    }

    disable() {
        const {map} = this;
        this.isMeasuring = false;
        if(map) {
            map.setCursor();
        }
    }

    enable() {
        this.isMeasuring = true;
        const {map, options} = this; 
        if(map) {
            map.setCursor(options.cursor || 'default');
        }
    }

    offEvent() {
        const {map} = this;
        
        // 移除地图监听事件
        // map.off('click', this._clickEvent) // 开始测量
        map.off('mousemove', this._mouseMoveEvent); // 更新测量 
        map.off('mouseup', this._mouseUpEvent); // 添加测量结点，更新测量信息
        map.off('dblclick', this._dblClickEvent); // 结束一个测量
        // map.off('mousedown', this._draggingMouseDown);
        if(this.originMapDoubleClickZoom) {
            map.doubleClickZoom.enable();
        }
    }

    clear() {
        const {measureActions} = this;
        for(const key in measureActions) {
            const measureAction = measureActions[key];
            const{spans, closeSpan} = measureAction;
            spans.forEach((marker) => {
                marker && marker.remove();
            });
            closeSpan && closeSpan.remove();
        }
        this.measureActions = {};
        this.measureActionId = null;
        
        // 设置图层数据
        this.pointSource.setData({
            type: 'FeatureCollection',
            features: []
        });

        this.lineSource.setData({
            type: 'FeatureCollection',
            features: []
        });

        this.fillSource.setData({
            type: 'FeatureCollection',
            features: []
        });
    }

    deactivate() {
        //清空点
        const {map} = this;
        if(!map) return;
        this.points = []; 
        this.isMeasuring = false;
        this.clear();
        this.offEvent();
        map.setCursor();
        map.off('click', this._clickEvent);
        map.off('mousemove', this._overDraggingPoint);
    }
}
export {
    MeasureTool
}
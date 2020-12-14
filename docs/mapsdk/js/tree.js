var atEaxmpleTree = [{
        name: '地图',
        path: 'map',
        children: [
            { name: '初始化地图', path: 'basemap' },
            { name: '显示地图参数', path: 'get-mapinfo' },
            { name: '切换底图', path: 'change-basemap' },
            { name: '切换地图', path: 'change-style' },
            { name: '添加标准地图样式服务', path: 'add-map-style' },
            { name: '移除标准地图样式服务', path: 'remove-map-style' },
            {name: '地图缩放级别限制', path: 'zoomlimit'},
            {name: '倾斜角与角度', path: 'pitch_bearing'},
            {name: '地图加载完成', path: 'mapload'},
            {name: '禁止全球地图重复', path: 'disable_worldcopy'},
            {name: '禁止地图旋转', path: 'disable_rotate'},
            {name: '禁止地图交互', path: 'disable_interact'},
            {name: '禁止键盘操作', path: 'disable_keyboard'},
            {name: '定位到某点', path: 'setcenter'},
            {name: '飞行到某点', path: 'flyto'},
            {name: 'bbox定位', path: 'bbox'},
            {name: '围绕中心点旋转', path: 'aroundcenter'},
            {name: '地图移动', path: 'move'},
        ]
    },
    {
        name: '地图服务',
        path: 'mapsev',
        children: [
            { name: '添加ArcGIS瓦片服务', path: 'esri-tile' },
            { name: '添加WMS服务', path: 'wms' },
            { name: '添加WMTS服务', path: 'wmts' },

        ]
    },
    {
        name: '图层',
        path: 'layer',
        children: [

            // { name: 'ArcGIS瓦片服务', path: 'arcgistile' },
        ]
    },
    {
        name: '其他',
        path: 'else',
        children: [
            { name: '地图截图', path: 'snap' },
        ]
    },
];
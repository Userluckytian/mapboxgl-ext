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
            {name: '添加点图标', path: 'icon'},
            {name: '添加点图标二', path: 'icon2'},
            {name: '添加图片', path: 'image'},
            {name: '添加视频', path: 'video'},
            {name: '添加一个圆', path: 'circle'},
            {name: 'GeoJSON线', path: 'line'},
            {name: 'GeoJSON面', path: 'polygon'},
            {name: '三维建筑', path: '3dbuilding'},
            {name: '三维建筑二', path: '3dbuilding2'},
 
            {name: '三维室内', path: '3dindoor'},
 
            {name: 'WMS', path: 'wms'},
            {name: '自定义图层', path: 'customlayer'},
            {name: 'Threejs图层', path: 'threelayer'},
            {name: 'Threejs图层-模型', path: 'three_model'},
            {name: '点聚合', path: 'cluster'},
            {name: '热力图', path: 'heatmap'},
            {name: '显示隐藏图层', path: 'showhide'},
            {name: '透明度', path: 'opacity'},
            {name: '图层蒙版', path: 'mask'},
            {name: '删除图层', path: 'remove_layer'},
 
            {name: '点图层样式', path: 'point_style'},
            {name: '线图层样式', path: 'line_style'},
            {name: '渐变线', path: 'gradient_line'},
            {name: '面图层样式', path: 'polygon_style'},
            {name: '面图层样式二', path: 'polygon_style2'},
        ]
    },
    {
        name:'交互',
        path: 'interact',
        children: [
          
            {name: '地图事件监听', path: 'event'},
            {name: '鼠标样式', path: 'mouse_style'},
            {name: '获取鼠标位置', path: 'mouse_position'},
            {name: '获取点击位置', path: 'click_position'},
            {name: '图层鼠标移入移出', path: 'layer_mouse'},
            {name: '图层点击', path: 'layer_click'},
            {name: '高亮元素', path: 'highlight'},
            {name: '点拖拽', path: 'drag_point'},
            {name: '图标拖拽', path: 'drag_marker'},
       
        ]
    },
    {
        name:'动画',
        path: 'animate',
        children: [
            {name: '点动画', path: 'point'},
            {name: '点动画二', path: 'marker_wave'},
            {name: '图标动画', path: 'marker'},
            {name: '线动画', path: 'line'},
            // {name: '圆形扩散', path: 'circle'},
            {name: '图片动画', path: 'image'},
            {name: '点沿路径动画', path: 'point_along_a_line'},
            {name: '热力图动画', path: 'heatmap'},

        ]
    },
    {
        name:'控件',
        path: 'control',
        children: [
            {name: '比例尺', path: 'scale'},
            {name: '缩放导航', path: 'zoomnav'},
            {name: '全屏', path: 'fullscreen'},
            {name: '版权', path: 'attribute'},
            // {name: '鹰眼', path: 'minimap'},
            {name: 'Logo', path: 'logo'},
            {name: '信息窗体', path: 'popup'},
            {name: '自定义控件', path: 'custom'},
            // {name: '联动地图', path: 'swipemap'},
        ]
    },
    {
        name:'计算',
        path: 'caculate',
        children: [
            {name: '测量', path: 'measure'},
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
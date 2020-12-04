// cityfun.setConfig({
// 	apiUrl: 'http://api.atlasdata.cn',
// 	accessToken: 'eyJpZCI6InNodW4ifQ.69ncA--qjdXrEXxMF3WDBlCKfLv_OigFLS27a2ATE_A',
// });

cityfun.setToken('pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw');

var map = new cityfun.Map({
	container: 'map',
	center: [120.58018178199796, 31.299183908754387],
	zoom: 8,
    // style: 'http://webres.cityfun.com.cn/szmap/szmap_dark/3857/map_dark.json',
   //	style: 'http://cim.cityfun.com.cn/3d_v1/scenes/',
   	style: './style.json',
});
let url = 'http://map.cityfun.com.cn/arcgis/rest/services/SZ/SZ_IMAGE_2020_3857/MapServer';

map.on('load',(e)=>{
		map.addArcGISTileLayer (url,{
			layerid:'image01'
		});
})


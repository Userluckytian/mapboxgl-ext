cityfun.setToken('pk.eyJ1IjoibGltemdpc2VyIiwiYSI6ImNqZXFvemJlcjB1bWYyd2x0eGxjeGdvcXIifQ.gSsj63R-2VZV7L7mpSw0Uw');
var map = new cityfun.Map({
    container: 'map',
    center: [120.74075692443142, 31.162229349894375],
    zoom: 12,
    style: 'http://webres.cityfun.com.cn/szmap/szmap_dark/3857/map_dark.json',
});
map.on('load', (e) => {});

map.on('moveend', function(e) {
    let htmlstr = `
						<div>
							当前地图中心：${map.getCenter()}
						</div>
						<div>
							当前地图级别：${map.getZoom()}
						</div>
						<div>
							当前旋转角：${map.getBearing()}
						</div>
						<div>
							当前地图倾角： ${map.getPitch()}
						</div>	
						<div>
							当前地图范围：${map.getBounds().toArray()}
						</div>
	 `;
    document.getElementById('mapinfo').innerHTML = htmlstr;
});
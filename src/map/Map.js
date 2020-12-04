import mapboxgl from 'mapbox-gl';
import { config } from '../config';
import { merge } from '../utils/utils';
import LogoControl from '../controls/LogoControl';
import { getMapOptions ,ajax} from './mapUtil';

export class Map extends mapboxgl.Map {
	constructor(options) {
 

    
    let {style} = options;
    let obj = null;
    ajax({
      method: 'get',
      url: style,
      async: false,
      success: function(response) {
        obj = response
      }
    });

     options.style = obj;
   
    super(options)
 
    
	}

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
}

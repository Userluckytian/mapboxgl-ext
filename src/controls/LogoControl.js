/**
 * LogoControl
 */
export default class LogoControl {
    constructor(options) {
        this.options = options || {};
    }

    onAdd(map) {
        if(!map) {
            return;
        }
        this._map = map;
        const options = this.options;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl';
        const anchor = document.createElement('a');
        anchor.target = "_blank";
        anchor.className = 'atlas-logo ' + (options.className || 'mapboxgl-ctrl-logo');
        if(options.logo) {
            anchor.style.background = `url(${options.logo}) left center no-repeat`;
            anchor.style.backgroundSize = 'auto 100%';
        }
        anchor.href = options.link || "http://www.atlasdata.cn";
        anchor.setAttribute("aria-label", "Atlas logo");
        anchor.setAttribute("rel", "noopener");
        this._container.appendChild(anchor);
        return this._container;
    }

    onRemove () {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
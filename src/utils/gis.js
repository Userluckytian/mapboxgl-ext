// eslint-disable-next-line valid-jsdoc
/**
 * 获取角度,单位为 deg
 * @param {Array} oldLngLat 第一个点位置 [lng, lat]
 * @param {Array} newLngLat 第二个点位置 [lng, lat]
 * @return {Number}
 */
export function getAngle(oldLngLat, newLngLat) {
    const x1 = oldLngLat[1],
        y1 = oldLngLat[0],
        x = newLngLat[1],
        y = newLngLat[0];

    return ((Math.atan2(0, 1) - Math.atan2((y - y1), (x1 - x))) * 180 / Math.PI)+ 180;
}

export function point(coordinates, properties) {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates
        },
        properties: properties || {}
    }
}
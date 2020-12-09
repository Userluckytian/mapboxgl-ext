export function saveFile(data, filename) {
    const saveLink = document.createElement('a');
    const event = document.createEvent('MouseEvents');
    saveLink.href = data;
    saveLink.download = filename;
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    saveLink.dispatchEvent(event);
}
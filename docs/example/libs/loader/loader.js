function loadLoader() {
    var loadContainer = document.createElement("div");
    loadContainer.setAttribute('id', 'loader');
    loadContainer.innerHTML = `
        <div class="atlas-LoaderIcon atlas-LoaderIcon--big">
            <svg class="atlas-LoaderIcon-spinner" viewBox="0 0 50 50">
            <circle class="atlas-LoaderIcon-path" cx="25" cy="25" r="20" fill="none"></circle>
            </svg>
        </div>
    `;
    document.body.appendChild(loadContainer);
    return loadContainer;
}
var loader = loadLoader();
const menuElement = document.getElementById('menu-navigation');
const placeNameElement = document.getElementById('place-name');
const photoElement = document.getElementById('photo');
const addressElement = document.getElementById('address');
const modalElement = document.getElementById('modal');
const lightboxElement = document.getElementById('lightbox').getElementsByClassName('content')[0];

loadMenuHTML();
loadPlaces();

L.mapbox.accessToken = "pk.eyJ1IjoiYWd1bmJ1aG9yaSIsImEiOiJjam1vanR4YXMwcWF4M3hxYzRiaXB2bTNrIn0.AYjahrgxIbMo2_NvEnirEQ";
const map = L.mapbox.map('bandung-map').setView([-6.92, 107.60], 13).addLayer(L.mapbox.tileLayer('mapbox.streets'));

async function loadMenuHTML() {
    await fetch('components/menu.html').then(response => response.text()).then(response => {
        menuElement.innerHTML = response;

        let currentMenu = document.getElementsByClassName('menu')[0].getElementsByTagName('a')[3];
        currentMenu.className = 'active';
    })
        .catch(error => console.log(error));
}

function showModal() {
    modalElement.style.visibility = 'visible';
}

async function loadPlaces() {
    await fetch('data/bandung.geojson').then(response => response.json()).then(response => {
        let places = response.features;
        let placeItem = "";

        places.forEach(place => {
            placeItem += `
                        <div class="item" onclick='showDescription(${JSON.stringify(place)})'>
                            <div class="photo">
                                <img src="${place.properties.photo}">
                            </div>
                            <div class="description">
                                <span>${place.properties.name}</span>
                            </div>
                        </div>
                    `;
        })

        lightboxElement.innerHTML = placeItem;
    });
}

function showDescription(data) {
    modalElement.style.visibility = 'hidden';
    placeNameElement.innerHTML = data.properties.name;
    addressElement.innerHTML = data.properties.address;
    photoElement.setAttribute('src', data.properties.photo);

    map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 15);

}


L.mapbox.featureLayer()
    .loadURL('data/bandung.geojson')
    .on('ready', event => {
        let clusterGroup = new L.MarkerClusterGroup();

        event.target.eachLayer(layer => {
            clusterGroup.addLayer(layer);
        });

        map.addLayer(clusterGroup);
    })
    .on('click', event => {
        let coordinates = event.layer.feature.geometry.coordinates;



        showDescription(event.layer.feature);
    });

map.scrollWheelZoom.disable();
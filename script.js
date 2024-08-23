// Crear el mapa
const map = L.map('map').setView([-33.027, -52.811],7);

// Definir los mapas bases
let baseMap = L.tileLayer('http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});
const ideUy= L.tileLayer.wms("https://mapas.ide.uy/geoserver-raster/ortofotos/ows?", {
    layers: "ORTOFOTOS_2019",
    format: 'image/jpeg',
    transparent: true,
    version: '1.3.0',
    attribution: "IDE-URUGUAY"
});
let openStreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
/* let openstreetmapdark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}); */
let openstreetmapOsm = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
});

// Caminerìa WMS



//Añadir wfs caminería nacional

// URL del servicio WFS
let url_geojson_file = 'tesis_4326.geojson';
let url_investigaciones_file = 'investigaciones_4326.geojson';
let url_deptos_file='deptos.geojson'

// Función para obtener datos desde un archivo GeoJSON
async function fetchGeoJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Failed to fetch GeoJSON data:", err);
        return null; // Devolver null en caso de error
    }
}

fetchGeoJSON(url_deptos_file).then(data => {
    if (data) {
        let deptosLayer = L.geoJSON(data, {
            style: function(feature) {
                return {
                    fillColor: 'transparent', 
                    weight: 0.5, 
                    color: 'black', // Color de la línea
                    opacity: 1.0
                };
            },
            
        });

        overlayLayers["Departamentos"] = deptosLayer;
        controlDeCapas.addOverlay(deptosLayer, "Departamentos");
    }
});

// Función para crear un marcador con un color específico
function createColoredMarker(latlng, color) {
    let markerHtmlStyles = `
        background-color: ${color};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -1rem;
        top: -1rem;
        position: relative;
        border-radius: 1rem 1rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

    return L.divIcon({
        className: "custom-marker",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
    });
}

// Obtener datos del archivo `investigaciones_4326.geojson` y agregar la capa al mapa y al control de capas
fetchGeoJSON(url_investigaciones_file).then(data => {
    if (data) {
        let markers = L.markerClusterGroup();

        let investigacionesLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: createColoredMarker(latlng, 'green') });
            },
            onEachFeature: function(feature, layer) {
                let popupcontent = `
                    <div>
                        Código: <b>${feature.properties.codigo}</b>
                    </div>
                    <br>
                    <div>
                        Autor: <b>${feature.properties.responsabl}</b>
                    </div>
                    <br>
                    <div>
                        Financiación: <b>${feature.properties.financia}</b>
                    </div>
                    <br>
                    <div>
                        Año de publicación: <b>${feature.properties.publicacio}</b>
                    </div>
                    <br>
                    <div>
                        Título: <b>${feature.properties.titulo}</b>
                    </div>
                    
                   
                `;
                layer.bindPopup(popupcontent, { className: 'custom-popup' });
            }
        });

        markers.addLayer(investigacionesLayer);
        overlayLayers["Investigaciones (Verde)"] = markers;
        controlDeCapas.addOverlay(markers, "Investigaciones");
    }
});

// Obtener datos del archivo `tesis_4326.geojson` y agregar la capa al mapa y al control de capas
fetchGeoJSON(url_geojson_file).then(data => {
    if (data) {
        let markers = L.markerClusterGroup();

        let tesisLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: createColoredMarker(latlng, 'blue') });
            },
            onEachFeature: function(feature, layer) {
                let popupcontent = `
                    <div>
                        Código: <b>${feature.properties.codigo}</b>
                    </div>
                    <br>
                    <div>
                        Autor: <b>${feature.properties.autor}</b>
                    </div>
                    <br>
                    <div>
                        Año de publicación: <b>${feature.properties.publicacio}</b>
                    </div>
                    <br>
                    <div>
                        Título: <b>${feature.properties.titulo}</b>
                    </div>
                    <br>
                    <div>
                        Tipo: <b>${feature.properties.tipo}</b>
                    </div>
                    <br>
                    <div>
                        Portada: <br>
                        ${feature.properties.link ? `<a href="${feature.properties.link}" target="_blank"><img src="${feature.properties.img}" alt="Portada" style="width:100px;height:auto;"></a>` : `<img src="${feature.properties.img}" alt="Portada" style="width:100px;height:auto;">`}
                    </div>
                `;
                layer.bindPopup(popupcontent, { className: 'custom-popup' });
            }
        });

        markers.addLayer(tesisLayer);
        overlayLayers["Tesis de Grado (Azul)"] = markers;
        controlDeCapas.addOverlay(markers, "Tesis");
    }
});

let camineriawms=L.tileLayer.wms('https://geoservicios.mtop.gub.uy/geoserver/inf_tte_ttelog_terrestre/v_camineria_nacional/ows?',{
    layers: "v_camineria_nacional",
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: "IDE UY"
});
// Definir capas base
let baseLayers = {
    "Mosaico IDE": ideUy,
    "Open StreetMap": openStreetmap,
    /* "CartoDB Modo Oscuro": openstreetmapdark, */
    "Mapa base": baseMap,
    "CartoDB Light": openstreetmapOsm
};

// Capas de control
let overlayLayers = {
    "Caminería MTOP": camineriawms
};

// Añadir el control de capas al mapa
let controlDeCapas = L.control.layers(baseLayers, overlayLayers).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Mini Mapa
let osmURL='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
let osmAttrib='Map data &copy; OpenStreetMap contributors';

// Plugin
let osm2 = new L.TileLayer(osmURL, {minZoom: 0, maxZoom: 7, attribution: osmAttrib});
let miniMap = new L.Control.MiniMap(osm2).addTo(map);

// Ajustar la posición del control de capas
controlDeCapas.setPosition('topleft');
// Añadir el mapa base predeterminado
baseMap.addTo(map);


// Estilo para la capa cargada
let style = {
    color: 'blue',
    opacity: 1.0,
    fillOpacity: 1.0,
    weight: 2,
    clickable: false
};
//Geolocate
let lc = L.control
  .locate({
    position: "topleft",
    strings: {
      title: "Esta es tu ubicación"
    }
  })
  .addTo(map);


// Configurar el control de carga de archivos
L.Control.FileLayerLoad.LABEL = '<img class="icon" src="img/folder.svg" alt="file icon"/>';
let control = L.Control.fileLayerLoad({
    fitBounds: true,
    layerOptions: {
        style: style,
        pointToLayer: function (data, latlng) {
            return L.circleMarker(latlng, { style: style });
        }
    }
});

// Agregar el control de carga de archivos al mapa
control.addTo(map);


// Manejar el evento 'data:loaded'
control.loader.on('data:loaded', function (e) {
    // Aquí puedes hacer algo con la capa cargada, como añadirla al control de capas
    let layer = e.layer;
    L.control.layers(null, { 'Cargado': layer }).addTo(map);
});


//SideBar
$(document).ready(function () {
  $('.sidemenu-toggler').on('click',function(){
      $('.sideMenu').toggleClass('active');
      $('.row').toggleClass('translate');
      $('.line').toggleClass('close');
  }); 

});


//Añadir Plugin ubicaciòn en tiempo real
L.control.measure(baseLayers).addTo(map);


//PUNTOS 

/* let udelarMarker=L.marker([-32.314802, -58.076896]).addTo(map).bindPopup
("<h6 class='text center' >Título: Delimitación territorial en el marco de la Ley n.º 18.308 : Análisis de los planes locales aprobados entre 2008-2015 con énfasis en el departamento de Paysandú</h6> <br> <h6 class='text center' >Autor: Robayna Sosa, Alejandro Sebastián </h6> <br> <h6 class='text center' >Año: 2018 </h6> <br> <h6 class='text center' >Tutores: Blanco, Jorge y Resnichenko, Yuri </h6> <br> <h6 class='text center' >Título Obtenido: Magíster en Ordenamiento Territorial y Desarrollo Urbano </h6> <br> <a href='https://www.colibri.udelar.edu.uy/jspui/handle/20.500.12008/21810' target='blank'><img src='img/Alejandro_Robayna.jpg' width='200px'></a>")
 */

//PUNTOS POSTGIS
 /* let url_geoserver_wfs = "http://localhost:8085/geoserver/puntos_geoserver/ows?";
let wfsURL = url_geoserver_wfs + "service=WFS&version=1.0.0&request=GetFeature&typeName=puntos_geoserver%3Apuntos_tesis&maxFeatures=50&outputFormat=application%2Fjson";

// Función para obtener datos WFS en formato GeoJSON
async function getWFSgeojson() {
    try {
        const response = await fetch(wfsURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Failed to fetch WFS GeoJSON data:", err);
        return null; // Devolver null en caso de error
    }
}

// Obtener datos WFS y agregar la capa al mapa y al control de capas
getWFSgeojson().then(data => {
    if (data) {
        // Crear un grupo de clústeres de puntos
        let markers = L.markerClusterGroup();

        // Crear capa de GeoJSON con los puntos
        let wfsPointLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // Crear un marcador para cada punto
                return L.marker(latlng);
            },
            onEachFeature: function(feature, layer) {
                let customOptions = {
                    maxWidth: "500px",
                    className: "customPop"
                };
                let popupcontent =`
  <div>
    Código: <b>${feature.properties.codigo}</b>
  </div>
  <br>
  <div>
    Autor: <b>${feature.properties.autor}</b>
  </div>
  <br>
  <div>
    Año de publicación: <b>${feature.properties.publicacio}</b>
  </div>
  <br>
  <div>
    Título: <b>${feature.properties.titulo}</b>
  </div>
  <br>
  <div>
    Tipo: <b>${feature.properties.tipo}</b>
  </div>
  <br>
  <div>
    Portada: <br>
    ${feature.properties.link ? `<a href="${feature.properties.link}" target="_blank"><img src="${feature.properties.img}" alt="Portada" style="width:100px;height:auto;"></a>` : `<img src="${feature.properties.img}" alt="Portada" style="width:100px;height:auto;">`}
  </div>
  <br>
`;
                
                
                ;
                layer.bindPopup(popupcontent, { className: 'custom-popup' }, customOptions);
            }
        });

        // Añadir los puntos al grupo de clústeres
        markers.addLayer(wfsPointLayer);
        
        // Agregar la capa de clústeres al objeto overlayLayers y al control de capas
        overlayLayers["Puntos Tesis WFS (Clúster)"] = markers;
        controlDeCapas.addOverlay(markers, "Puntos Tesis WFS (Clúster)");
    }
});  */

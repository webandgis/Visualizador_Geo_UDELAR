  // Crear el mapa
  const map = L.map('map').setView([-33.027, -52.811], 7);

  // Capa base debajo del swipe

  const baselayer= L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
  }).addTo(map)

  //const ideuy = L.tileLayer.wms("https://mapas.ide.uy/geoserver-raster/ortofotos/ows?", {
    //layers: "ORTOFOTOS_2019",
   // format: 'image/jpeg',
    //transparent: true,
    //version: '1.3.0',
    //attribution: "IDE-URUGUAY"
//}).addTo(map);

  // Capa superior recortada con swipe (1996)
  const topLayer = L.tileLayer.wms("https://mapas.ide.uy/geoserver-raster/ortofotos/ows?", {
    layers: "ortofoto_1966",
    format: 'image/jpeg',
    transparent: true,
    version: '1.3.0',
    attribution: "IDE-URUGUAY"
  }).addTo(map);

  topLayer.on('load', () => {
    const container = topLayer.getContainer();
    container.style.pointerEvents = 'none'; // para permitir clics debajo
    clip(); // aplicar recorte inicial
  });

  // Función que recorta la capa superior
  function clip() {
    const range = document.getElementById('slider');
    const container = topLayer.getContainer();
    const nw = map.containerPointToLayerPoint([0, 0]);
    const se = map.containerPointToLayerPoint(map.getSize());
    const clipX = nw.x + (se.x - nw.x) * range.value;
    container.style.clip = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`;
  }

  // Eventos de movimiento del deslizador
  document.getElementById('slider').addEventListener('input', clip);
  map.on('move zoom resize', clip);

  // === FUNCIONALIDAD DE AÑADIR PUNTO ===
  let modoAgregarPunto = false;

  document.getElementById("btn-agregar-punto").addEventListener("click", function () {
    modoAgregarPunto = !modoAgregarPunto;
    this.textContent = modoAgregarPunto ? "Haga clic en el mapa" : "Añadir Punto";
    this.style.backgroundColor = modoAgregarPunto ? "lightgreen" : "lightblue";
  });

  map.on("click", function (e) {
    if (modoAgregarPunto) {
      addMarker(e);
      modoAgregarPunto = false;
      const boton = document.getElementById("btn-agregar-punto");
      boton.textContent = "Añadir Punto";
      boton.style.backgroundColor = "lightblue";
    }
  });

  function addMarker(e) {
    const markerPlace = document.querySelector(".marker-position");
    markerPlace.textContent = `Coordenadas del punto: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;

    const marker = L.marker(e.latlng, { draggable: true })
      .addTo(map)
      .bindPopup('<button type="button" class="remove">🗑 Eliminar marcador</button>')
      .openPopup();

    marker.on("popupopen", function () {
      const btn = document.querySelector(".remove");
      if (btn) {
        btn.addEventListener("click", function () {
          map.removeLayer(marker);
          markerPlace.textContent = "Marcador eliminado";
        });
<<<<<<< HEAD
      }
    });

    marker.on("dragend", function () {
      const newPos = marker.getLatLng();
      markerPlace.textContent = `Nueva posición: ${newPos.lat.toFixed(5)}, ${newPos.lng.toFixed(5)}`;
    });
  }
=======

        clusterTesis.addLayer(tesisLayer);
        clusterTesis.addTo(map)
    }
});

// Obtener datos del archivo `investigaciones_4326.geojson` y agregar la capa al grupo de clústeres
fetchGeoJSON(url_investigaciones_file).then(data => {
    if (data) {
        let investigacionesLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: createColoredMarker(latlng, 'green') });
            },
            onEachFeature: function(feature, layer) {
                let popupcontent = `
                    <div>
                        Código: <b>${feature.properties.Código}</b>
                    </div>
                    <br>
                    <div>
                        Autor: <b>${feature.properties.Responsabe}</b>
                    </div>
                    <br>
                    <div>
                        Financiación: <b>${feature.properties.Financiac}</b>
                    </div>
                    <br>
                    <div>
                        Año de publicación: <b>${feature.properties.Año}</b>
                    </div>
                    <br>
                    <div>
                        Título: <b>${feature.properties.Título}</b>
                    </div>
                `;
                layer.bindPopup(popupcontent, { className: 'custom-popup' });
            }
        });

        clusterInvestigaciones.addLayer(investigacionesLayer);
    }
});

fetchGeoJSON(url_centros_universitarios_file).then(data => {
    if (data) {
        let centrosLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: createColoredMarker(latlng, 'yellow') });
            },
            onEachFeature: function(feature, layer) {
                let popupcontent = `
                     <div>
                        Nombre: <b>${feature.properties.NOMBRE}</b>
                    </div>
                    <br>
                    <div>
                        Departamento: <b>${feature.properties.DEPARTAMEN}</b>
                    </div>
                    <br>
                    <div>
                        Código de Localidad: <b>${feature.properties.CODLOC}</b>
                    </div>
                    <br>
                    <div>
                        Localidad/Barrio: <b>${feature.properties.LOCALIDAD}</b>
                    </div>
                    <br>
                    <div>
                        Calle: <b>${feature.properties.CALLE}</b>
                    </div>
                    <br>
                    <div>
                        Nro: <b>${feature.properties.NRO}</b>
                    </div>
                    <br>
                     <div>
                        Teléfono: <b>${feature.properties.TELEFONO}</b>
                    </div>
                    <br>
                     <div>
                       Correo: <b>${feature.properties.CORREO}</b>
                    </div>
                    
                `;
                layer.bindPopup(popupcontent, { className: 'custom-popup' });
            }
        });

        clusterCentros.addLayer(centrosLayer);
    }
});

// Obtener datos del archivo `deptos.geojson` y agregar la capa al mapa
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
            }
        });

       
        deptosLayer.addTo(map);
    }
});


// Función para crear la capa WMS
function createCamineriaWMSLayer() {
    camineriaLayer = L.tileLayer.wms('https://geoservicios.mtop.gub.uy/geoserver/inf_tte_ttelog_terrestre/v_camineria_nacional/ows?', {
        layers: "v_camineria_nacional",
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "IDE UY"
    });

    return camineriaLayer;
}

// Definir capas base
let baseLayers = {
    "Mosaico IDE": ideUy,
    "Open StreetMap": openStreetmap,
    "Mapa base": baseMap,
    "CartoDB Light": openstreetmapOsm
};

// Definir capas de control (en el orden deseado)
let overlayLayers = {
    "Tesis de Grado": clusterTesis,
    "Investigaciones": clusterInvestigaciones,
    "Centros Universitarios": clusterCentros,
    "Rutas Nacionales MTOP": createCamineriaWMSLayer() // Llama a la función para obtener la capa WMS
};

// Crear y añadir el control de capas al mapa
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
// HOVER
document.addEventListener('DOMContentLoaded', function () {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
})
>>>>>>> 8753b0ff597ac784a28c95c50a89ee357e099068

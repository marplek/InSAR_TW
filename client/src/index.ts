import { Ion, Cartesian3, Viewer, GeoJsonDataSource, Color } from 'cesium';
import './index.css';
import MVTImageryProvider from 'mvt-imagery-provider';


Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;

let faultLinesVisible = false;
const geoJsonUrl = 'https://www.geologycloud.tw/api/v1/zh-tw/Fault?t=.json&all=true';
GeoJsonDataSource.load(geoJsonUrl, {
  stroke: Color.RED,
  fill: Color.RED.withAlpha(0.5),
  strokeWidth: 3
}).then(dataSource => {
  viewer.dataSources.add(dataSource);
  dataSource.show = false;
}).catch(error => {
  console.error('Failed to load GeoJSON data:', error);
});

document.getElementById('toolbarIcon')?.addEventListener('click', () => {
  const toolbar = document.getElementById('toolbar');
  if (toolbar.style.display === "none") {
    toolbar.style.display = "block";
  } else {
    toolbar.style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  const toggleFaultLinesCheckbox = document.getElementById('toggleFaultLines') as HTMLInputElement;
  toggleFaultLinesCheckbox.checked = false;

  toggleFaultLinesCheckbox.addEventListener('change', (event) => {
    faultLinesVisible = toggleFaultLinesCheckbox.checked;
    viewer.dataSources.get(0).show = faultLinesVisible;
  });
});

const geoserverStyle = {
  version: 8,
  sources: {
    'class_one': {
      type: 'vector',
      tiles: ['http://172.105.226.156:8080/geoserver/gwc/service/wmts?layer=insar:class_one&style=point&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/vnd.mapbox-vector-tile&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}'],
      maxzoom: 21,
      minzoom: 7,
    },
  },
  layers: [
    {
      id: 'class_one_points',
      type: 'circle',
      source: 'class_one',
      'source-layer': 'class_one',
      maxzoom: 21,
      minzoom: 7,
      paint: {
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          0, 1,
          10, 1.5,
          20, 8
        ],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "avg_data"],
          -20, "#0000ff",
          0, "#ffffff",
          20, "#ff0000"
        ]
      },
    },
  ],
};

for (let i = 1; i <= 10; i++) {
  const layerId = `class_two_${i}`;
  geoserverStyle.sources[layerId] = {
    type: 'vector',
    tiles: [`http://172.105.226.156:8080/geoserver/gwc/service/wmts?layer=insar:${layerId}&style=point&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/vnd.mapbox-vector-tile&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}`],
    maxzoom: 21,
    minzoom: 7,
  };

  geoserverStyle.layers.push({
    id: `${layerId}_points`,
    type: 'circle',
    source: layerId,
    'source-layer': layerId,
    maxzoom: 21,
    minzoom: 11,
    paint: {
      "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        0, 1,
        10, 1.5,
        20, 8
      ],
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "avg_data"],
        -20, "#0000ff",
        0, "#ffffff",
        20, "#ff0000"
      ]
    },
  });
}

const viewer = new Viewer('cesiumContainer', {
  baseLayerPicker: false,
  animation: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  shouldAnimate: true,
  useBrowserRecommendedResolution: true,
  orderIndependentTranslucency: true,
});

const provider = new MVTImageryProvider({
  style: geoserverStyle as any,
});

viewer.imageryLayers.addImageryProvider(provider as any);


viewer.camera.setView({
  destination: Cartesian3.fromDegrees(120.9605, 23.6978, 1000000),
});

viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2500;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000000; 

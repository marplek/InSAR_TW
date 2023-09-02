import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {registerLoaders} from '@loaders.gl/core';
import {MVTLoader} from '@loaders.gl/mvt';

registerLoaders(MVTLoader);

import {ScatterplotLayer} from '@deck.gl/layers';
import {readableInteger} from './components/utils/format-utils';
import {MVTLayer} from '@deck.gl/geo-layers';

import ExampleInfoPanel from './components/info-panel/index';  // Update path to actual import
import CustomizedInputBase  from './components/info-panel/search';

const INITIAL_VIEW_STATE = {
  longitude: 121,
  latitude: 23.5,
  zoom: 7,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const TAIWAN_BOUNDS = {
  longitudeMin: 120,
  longitudeMax: 122,
  latitudeMin: 21.8,
  latitudeMax: 25.5
};



export default function App({
  //data = generateRandomPoints(800000),
  radius = 50,
  mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
}) {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [pointCount, setPointCount] = useState(0);
  // 用於處理視圖狀態更改的函數
  function handleViewStateChange({viewState}) {
    setViewState(viewState);
  }
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
}
  function handleMVTPointClick(info) {
    if (info && info.object) {
      setSelectedPoint(info.coordinate);
    } else {
      setSelectedPoint(null);
    }
  }

  function handlePointClick(info) {
    if (info && info.object) {
      setSelectedPoint(info.object);
    } else {
      setSelectedPoint(null);
    }
  }

  useEffect(() => {
    // 從 GeoServer 的 WFS 端點獲取資料
    fetch('/geoserver/insar/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=insar%3Alevel_one&maxFeatures=1000000&outputFormat=application%2Fjson')
      .then(response => response.json())
      .then(data => {
        // 使用GeoServer返回的資料
        const points = data.features.map(feature => feature.geometry.coordinates);
        setData(points);
      })
      .catch(error => console.error("Error loading data from GeoServer:", error));
}, []);

const levelTwoLayer = new MVTLayer({
  id: 'level-two-layer',
  data: ['http://localhost/geoserver/gwc/service/wmts/rest/insar:level_two/point/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=application/vnd.mapbox-vector-tile'],
  minZoom: 12, 
  maxZoom: 15,
  getPointRadius: radius,
  pointRadiusMinPixels: 0.1,
  getFillColor: f => {
    switch (f.properties.layerName) {
      case 'poi':
        return [255, 0, 255];
      case 'level_two':
        return [120, 150, 180];
      case 'point':
        return [218, 218, 218];
      default:
        return [240, 240, 0];
    }
  },
  onClick: info => handleMVTPointClick(info),
  pickable: true
  //onClick: info => handlePointClick(info)
});


  const layers = [
    levelTwoLayer,
    new ScatterplotLayer({
      id: 'scatter-plot',
      data,
      pickable: true,
      radiusScale: radius,
      radiusMinPixels: 0.25,
      getPosition: d => [d[0], d[1], 0],
      getFillColor: d => {
        const {latitudeMin, latitudeMax} = TAIWAN_BOUNDS;
        const t = (d[1] - latitudeMin) / (latitudeMax - latitudeMin);  // Scale between 0 and 1
        return [
          255 * t,  // Red
          0,        // Green
          255 * (1 - t),  // Blue
        ];
      },
      getRadius: 1,
      onClick: info => handlePointClick(info)
    })
  ];

  const meta = {
    points: data.length,
  };

  function renderInfo(meta) {
    return (
      <div>
        <div className="stat">
          No. of Instances
          <b>{readableInteger(meta.points || 0)}</b>
        </div>
        {selectedPoint && (
        <>
          <div className="stat">
            Selected Point Longitude
            <b>{selectedPoint[0].toFixed(3)}</b>
          </div>
          <div className="stat">
            Selected Point Latitude
            <b>{selectedPoint[1].toFixed(3)}</b>
          </div>
        </>
      )}
      <div>Zoom Level: {viewState.zoom.toFixed(0)}</div> {/* 顯示當前縮放級別 */}
      </div>
    );
  }

  return (
    <>
    <CustomizedInputBase  value={searchTerm} onChange={handleSearchTermChange} />
      <DeckGL
        layers={layers}
        viewState={viewState} // 使用當前的視圖狀態
        onViewStateChange={handleViewStateChange} // 添加處理函數
        controller={true}
      >
        <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
      </DeckGL>
      <ExampleInfoPanel
        title="Scatterplot Layer"
        sourceLink="https://github.com/visgl/deck.gl/blob/master/examples/website/scatterplot"
        params={{}} // parameters for controlling the map
        updateParam={() => {}}
        meta={meta}
      >
        {renderInfo(meta)}
        
      </ExampleInfoPanel>
      
    </>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
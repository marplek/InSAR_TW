import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {readableInteger} from './components/utils/format-utils';

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

function generateRandomPoints(count) {
  const points = [];

  for (let i = 0; i < count; i++) {
    const longitude = Math.random() * (TAIWAN_BOUNDS.longitudeMax - TAIWAN_BOUNDS.longitudeMin) + TAIWAN_BOUNDS.longitudeMin;
    const latitude = Math.random() * (TAIWAN_BOUNDS.latitudeMax - TAIWAN_BOUNDS.latitudeMin) + TAIWAN_BOUNDS.latitudeMin;

    points.push([longitude, latitude]);
  }

  return points;
}



export default function App({
  //data = generateRandomPoints(800000),
  radius = 30,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
}) {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 從 /api/data 端點獲取資料
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        // 隨機選擇 10 萬點
        const totalPoints = data.length;
        const indices = new Set();
        while (indices.size < 100000 && indices.size < totalPoints) {
          indices.add(Math.floor(Math.random() * totalPoints));
        }
        const selectedPoints = Array.from(indices).map(index => data[index]);

        setData(selectedPoints);
      })
      .catch(error => console.error("Error loading data:", error));
  }, []);
  
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
}
  const layers = [
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

  function handlePointClick(info) {
    if (info && info.object) {
      setSelectedPoint(info.object);
    } else {
      setSelectedPoint(null);
    }
  }

  function renderInfo(meta) {
    return (
      <div>
        <p>Each dot represents 10 people. Density per tract from 2015 census data</p>
        <p>
          Data source: <a href="http://www.census.gov">US Census Bureau</a>
        </p>
        <div className="stat">
          No. of Instances
          <b>{readableInteger(meta.points || 0)}</b>
        </div>
        {selectedPoint && (
        <>
          <div className="stat">
            Selected Point Longitude
            <b>{selectedPoint[0]}</b>
          </div>
          <div className="stat">
            Selected Point Latitude
            <b>{selectedPoint[1]}</b>
          </div>
        </>
      )}
      </div>
    );
  }

  return (
    <>
    <CustomizedInputBase  value={searchTerm} onChange={handleSearchTermChange} />
      <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true}>
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
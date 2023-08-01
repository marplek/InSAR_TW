import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {readableInteger} from './components/utils/format-utils';

import ExampleInfoPanel from './components/info-panel/index';  // Update path to actual import

const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json'; // eslint-disable-line

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
  data = generateRandomPoints(800000),
  radius = 30,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
}) {
  const [selectedPoint, setSelectedPoint] = useState(null);


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
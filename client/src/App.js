import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
  const [data, setData] = useState([]);
  const [faultData, setFaultData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api/data');
      setData(result.data);

      const url = "https://www.geologycloud.tw/api/v1/zh-tw/Fault25?t=.json&all=true";
      const faultResult = await axios.get(url);
      setFaultData(faultResult.data);
    };
 
    fetchData();
  }, []);

  const onEachFeature = (feature, layer) => {
    const pro = feature.properties;
    let HTML = '';
    for (let q in pro) {
      HTML += q + ":" + pro[q] + '<br />';
    }
    layer.bindPopup(HTML);
  }

  const geoJsonStyles = {
    weight: 1,
    opacity: 1,
    color: '#035BB2',
    fillColor: '#035BB2',
    fillOpacity: 0.5
  };

  return (
    <MapContainer center={[23, 120]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item, index) => (
        <CircleMarker key={index} center={[item.latitude, item.longitude]} pathOptions={{ color: 'red' }} radius={20}>
        </CircleMarker>
      ))}
      {faultData && (
        <GeoJSON 
          data={faultData} 
          style={geoJsonStyles}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};


export default MyMap;
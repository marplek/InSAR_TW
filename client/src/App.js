import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api/data');
      setData(result.data);
    };
 
    fetchData();
  }, []);

  return (
    <MapContainer center={[23, 120]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map(item => (
        <CircleMarker center={[item.latitude, item.longitude]} pathOptions={{ color: 'red' }} radius={20}>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MyMap;
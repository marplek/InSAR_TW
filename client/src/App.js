import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";

const MyMap = () => {
  const [data, setData] = useState([]);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api/sta');
      setData(result.data);
      console.log('data:', result.data); // 在此處輸出popupData
    };

    fetchData();
  }, []);

  const handleClick = async (id) => {
    const result = await axios(`/api/data/${id}`);
    setPopupData(result.data);
    console.log('Popup data:', result.data); // 在此處輸出popupData
  }

  return (
    <MapContainer center={[23, 120]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item) => (
        <CircleMarker
          key={item.id}
          center={[item.latitude, item.longitude]}
          pathOptions={{ color: 'red' }}
          radius={20}
          eventHandlers={{
            click: () => handleClick(item.id),  
          }}
        >
          {popupData && (
            <Popup>
              <div>
                {popupData.map((dataPoint) => (
                  <div key={dataPoint.id}>
                    Time: {dataPoint._time} - Value: {dataPoint._value}
                  </div>
                ))}
              </div>
            </Popup>
          )}
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MyMap;



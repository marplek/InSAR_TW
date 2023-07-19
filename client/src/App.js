import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyMap = () => {
  const [data, setData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [showChart, setShowChart] = useState(false); // New state for controlling chart visibility
  const [chartData, setChartData] = useState(null); // New state for storing chart data

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api/sta');
      setData(result.data);
    };

    fetchData();
  }, []);

  const handleClick = async (id) => {
    const result = await axios(`/api/data/${id}`);
    setPopupData(result.data);
    setShowChart(true); // Show chart when CircleMarker is clicked
    setChartData(result.data); // Update chart data
  }
  
  return (
    <div>
      <MapContainer center={[23, 120]} zoom={13} style={{ height: "100vh", width: "50%" }}>
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
                Click to view data chart
              </div>
            </Popup>
            )}
          </CircleMarker>
        ))}
      </MapContainer>
      {showChart && chartData && // If showChart is true and chartData is not null, then display the chart
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100vh' }}>
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_value" stroke="#8884d8" />
          </LineChart>
        </div>
      }
    </div>
  );
};

export default MyMap;
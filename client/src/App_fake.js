import React, { useRef, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import './assets/lib/sidebar/leaflet-sidepanel.css';
import './assets/lib/sidebar/leaflet-sidepanel.js';
import axios from 'axios';


const Basic = () => {
  const position = [25.03418, 121.564517]
  const mapRef = useRef(null);
  //const [data, setData] = useState([]);
  const [data, setData] = useState([
    { id: 1, latitude: 25.03418, longitude: 121.564517 },
    { id: 2, latitude: 25.03485, longitude: 121.565060 },
    { id: 3, latitude: 25.03412, longitude: 121.563982 },
  ]);
  //const [chartData, setChartData] = useState(null); 
  const fakeChartData = [
    { _time: '2023-01-01', _value: 100 },
    { _time: '2023-02-01', _value: 120 },
    { _time: '2023-03-01', _value: 180 },
    { _time: '2023-04-01', _value: 160 },
    { _time: '2023-05-01', _value: 200 },
  ];
  const [chartData, setChartData] = useState(null); // 新的state用于保存图表的数据
  const [showChart, setShowChart] = useState(true); // 新的state用于控制图表的显示和隐藏


  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await axios('/api/sta');
  //     setData(result.data);
  //   };
  //   fetchData();
  // }, []);


  useEffect(() => {

    const mymap = L.map(mapRef.current, {
      zoomControl: false
    }).setView(position, 17);
    const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(OSMUrl).addTo(mymap);
    L.control.zoom({position: 'bottomright'}).addTo(mymap);
    data.forEach((item) => {
      const circleMarker = L.circleMarker([item.latitude, item.longitude], { color: 'red', radius: 20 })
        .on('click', () => {
          setChartData(fakeChartData); // 更新图表数据
        })
        .addTo(mymap);
    });

    L.control.sidepanel('mySidepanelLeft', {
      menuposition: "topright",
      tabsPosition: 'left',
      startTab: 'tab-5'
    }).addTo(mymap);
  }, [data]);

  return (
    <div ref={mapRef} className="sidebar-map" style={{ height: "100vh", width: "100%" }}>
      <div id="mySidepanelLeft" className="sidepanel" aria-label="side panel" aria-hidden="false">
        <div className="sidepanel-inner-wrapper">
          <div className="sidepanel-header">
            <a href="/"><img src="/favicon.ico" alt="Your Logo" /></a>
            <button className="back-link">Back</button>
          </div>
          <nav className="sidepanel-tabs-wrapper" aria-label="sidepanel tab navigation">
            <ul className="sidepanel-tabs">
              <li className="sidepanel-tab">
                <a href="#" className="sidebar-tab-link" role="tab" data-tab-link="tab-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                    {/* svg paths */}
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
          <div className="sidepanel-content-wrapper">
            <div className="sidepanel-content">
              <div className="sidepanel-tab-content" data-tab-content="tab-5">
                <h4>Content 5</h4>
                {showChart && chartData && // If showChart is true and chartData is not null, then display the chart
                  <div>
                    <LineChart width={300} height={200} data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="_value" stroke="#8884d8" />
                    </LineChart>
                  </div>
                }
                <a href="/">Back</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basic;
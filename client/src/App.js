import React, { useRef, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import './assets/lib/sidebar/leaflet-sidepanel.css';
import './assets/lib/sidebar/leaflet-sidepanel.js';
import axios from 'axios';
import LoginForm from './component/LoginForm';  // Add this line at the top of your file


const Basic = () => {
  const position = [25.03418, 121.564517]
  const mapRef = useRef(null);
  const [data, setData] = useState(null);
  const fakeChartData = [
    { _time: '2023-01-01', _value: 100 },
    { _time: '2023-02-01', _value: 120 },
    { _time: '2023-03-01', _value: 180 },
    { _time: '2023-04-01', _value: 160 },
    { _time: '2023-05-01', _value: 200 },
  ];
  const fakeData = [
    { id: 1, latitude: 25.03418, longitude: 121.564517 },
    { id: 2, latitude: 25.03485, longitude: 121.565060 },
    { id: 3, latitude: 25.03412, longitude: 121.563982 },
  ]
  const [mymap, setMap] = useState(null);  // Initialize a state to store the map object
  const [chartData, setChartData] = useState(null);
  const [sidePanelContent, setSidePanelContent] = useState("Content 5");
  const [lastClickedId, setLastClickedId] = useState(null);
  const [mysidePanel, setMysidePanel] = useState(null);  // Initialize a state to store the map object
  const markersRef = useRef(new Map());  // 用於存儲 markers 的 Map
  const lastClickedIdRef = useRef(null);  // 創建一個新的 useRef 來存儲最新的 lastClickedId
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  if (process.env.REACT_APP_ENV === 'development') {
    setData(fakeData);
  } else {
      // 如果是生產環境，從伺服器獲取資料
      useEffect(() => {
          const fetchData = async () => {
              const result = await axios('/api/sta');
              setData(result.data);
          };
          fetchData();
      }, []);
  }


  useEffect(() => {

    const mymap = L.map(mapRef.current, {
      zoomControl: false
    }).setView(position, 10);
    const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(OSMUrl).addTo(mymap);
    L.control.zoom({position: 'bottomright'}).addTo(mymap);
    setMap(mymap);  // Save the map object in state

    const mysidePanel = L.control.sidepanel('mySidepanelLeft', {
      menuposition: "topright",
      tabsPosition: 'left',
      startTab: 'tab-5'
    }).addTo(mymap);
    setMysidePanel(mysidePanel);  // Correctly save the SidePanel object in state

  }, []);

  useEffect(() => {
    lastClickedIdRef.current = lastClickedId;  // 更新 useRef 中的 lastClickedId
  }, [lastClickedId]);
  
  useEffect(() => {
    // Run this useEffect whenever data changes
    if (isLoggedIn && data && mymap) {
        data.forEach(item => {
          if (!markersRef.current.has(item.id)) {
            const marker = L.circleMarker([item.latitude, item.longitude], {color: 'red',weight: 1, radius: 3}).addTo(mymap);
              marker.on('click', async () => {
                
                if (process.env.REACT_APP_ENV === 'development') {
                  setChartData(fakeChartData);
                } else {
                    const result = await axios(`/api/data/${item.id}`);
                    setChartData(result.data);
                }
                // Update the side panel content using React's state
                setSidePanelContent(
                  <>
                    <h4>Chart Data</h4>

                  </>
                );
                let sidePanelElement = document.getElementById('mySidepanelLeft');
        
                // If the clicked item is the same as the last clicked item, close the side panel

                if (item.id === lastClickedIdRef.current) {
                  if(sidePanelElement.classList.contains('opened')){
                    sidePanelElement.classList.remove('opened');
                  }
                  sidePanelElement.classList.add('closed');
                  setLastClickedId(null);  // Reset the last clicked id
                } 
                // If the clicked item is not the same as the last clicked item, open the side panel
                else {
                  if(sidePanelElement.classList.contains('closed')){
                    sidePanelElement.classList.remove('closed');
                  }
                  sidePanelElement.classList.add('opened');
                  setLastClickedId(item.id);  // Update the last clicked id
                }
              });
          markersRef.current.set(item.id, marker); // 在 Map 中儲存這個 marker
        }
      })
    }
  }, [data, mymap, lastClickedId]); // Include sidePanel in the dependencies to get the latest reference

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
              <li className="sidepanel-tab">
                <a href="#" className="sidebar-tab-link" role="tab" data-tab-link="tab-6">
                  {/* Insert your login icon here */}
                </a>
              </li>
            </ul>
          </nav>
          <div className="sidepanel-content-wrapper">
            <div className="sidepanel-content">
              <div className="sidepanel-tab-content" data-tab-content="tab-5">
                {isLoggedIn && (
                  <>
                    {sidePanelContent}
                    {chartData && (
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
                    )}
                  </>
                )}
              </div>
              <div className="sidepanel-tab-content" data-tab-content="tab-6">
                <LoginForm onLogin={handleLogin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basic;
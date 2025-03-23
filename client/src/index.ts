import { Ion } from 'cesium';
import './index.css';
import { setupMapViewer } from './map/setup';
import { initializeFaultLines } from './features/fault-lines';
import { initializeToolbar } from './ui/toolbar';
import { setupPointSystems } from './features/points';
import { setupEventHandlers } from './events/handlers';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;

const viewer = setupMapViewer('cesiumContainer');

initializeFaultLines(viewer);
initializeToolbar();
const { pointDataMap } = setupPointSystems(viewer);
setupEventHandlers(viewer, pointDataMap);


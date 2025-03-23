import { Viewer, GeoJsonDataSource, Color } from 'cesium';

export let faultLinesVisible = false;
const geoJsonUrl = import.meta.env.VITE_FAULT_LINES_API_URL;

export function initializeFaultLines(viewer: Viewer) {
    GeoJsonDataSource.load(geoJsonUrl, {
        stroke: Color.RED,
        fill: Color.RED.withAlpha(0.5),
        strokeWidth: 3
    }).then(dataSource => {
        viewer.dataSources.add(dataSource);
        dataSource.show = false;
    }).catch(error => {
        console.error('Failed to load GeoJSON data:', error);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const toggleFaultLinesCheckbox = document.getElementById('toggleFaultLines') as HTMLInputElement;
        if (toggleFaultLinesCheckbox) {
            toggleFaultLinesCheckbox.checked = false;
            toggleFaultLinesCheckbox.addEventListener('change', () => {
                faultLinesVisible = toggleFaultLinesCheckbox.checked;
                viewer.dataSources.get(0).show = faultLinesVisible;
            });
        }
    });
}
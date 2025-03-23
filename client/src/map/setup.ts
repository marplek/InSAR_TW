import { Viewer, Cartesian3 } from 'cesium';

export function setupMapViewer(containerId: string): Viewer {
    const viewer = new Viewer(containerId, {
        baseLayerPicker: false,
        animation: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        shouldAnimate: true,
        useBrowserRecommendedResolution: true,
        orderIndependentTranslucency: true,
        sceneMode: 3,
        sceneModePicker: false,
    });

    viewer.camera.setView({
        destination: Cartesian3.fromDegrees(120.9605, 23.6978, 1000000),
    });

    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2500;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000000;

    return viewer;
}
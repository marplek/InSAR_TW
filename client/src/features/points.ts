import {
    Viewer, PointPrimitiveCollection, LabelCollection} from 'cesium';
import { loadClassOnePoints, loadClassTwoPoints } from '../data/point-loaders';
import { toDegrees } from '../utils/coordinate-utils';

export function setupPointSystems(viewer: Viewer) {
    const classOnePoints = new PointPrimitiveCollection();
    const classTwoPoints = new PointPrimitiveCollection();
    const labelCollection = new LabelCollection();

    viewer.scene.primitives.add(classOnePoints);
    viewer.scene.primitives.add(classTwoPoints);
    viewer.scene.primitives.add(labelCollection);

    const pointDataMap = new Map();

    loadClassOnePoints(classOnePoints, pointDataMap);

    setupViewChangeHandler(viewer, classTwoPoints, pointDataMap);

    return {
        classOnePoints,
        classTwoPoints,
        pointDataMap
    };
}

function setupViewChangeHandler(viewer, classTwoPoints, pointDataMap) {
    let loadTimer = null;
    let currentViewRect = null;

    viewer.camera.moveEnd.addEventListener(() => {
        const height = viewer.camera.positionCartographic.height;

        if (height < 50000) {
            if (loadTimer) {
                clearTimeout(loadTimer);
            }

            let rectangle;
            try {
                rectangle = viewer.camera.computeViewRectangle();
                if (!rectangle) {
                    return;
                }

            } catch (e) {
                console.error('Error computing view rectangle:', e);
                return;
            }

            const west = toDegrees(rectangle.west);
            const south = toDegrees(rectangle.south);
            const east = toDegrees(rectangle.east);
            const north = toDegrees(rectangle.north);

            currentViewRect = { west, south, east, north };

            classTwoPoints.show = true;

            loadTimer = setTimeout(() => {
                loadClassTwoPoints(
                    currentViewRect, 
                    classTwoPoints, 
                    pointDataMap,
                    () => {}
                );
            }, 30);
        } else {
            clearAllClassTwoPoints(classTwoPoints, pointDataMap);
            classTwoPoints.show = false;
        }
    });
}

function clearAllClassTwoPoints(classTwoPoints, pointDataMap) {
    try {
        classTwoPoints.removeAll();

        for (const key of pointDataMap.keys()) {
            if (key.startsWith('class_two_')) {
                pointDataMap.delete(key);
            }
        }
    } catch (e) {
        console.error('Error clearing points:', e);
    }
}
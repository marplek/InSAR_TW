import { getColorFromValue } from '../utils/color-utils';
import { Cartesian3 } from 'cesium';

let currentViewRequest = {
    viewBounds: null,
    isActive: false,
    requestId: 0
};

export function loadClassOnePoints(classOnePoints, pointDataMap) {
    fetch('/api/class_one')
        .then(response => response.json())
        .then(data => {
            data.forEach(point => {
                const pointId = `class_one_${point.id}`;

                if (pointDataMap.has(pointId)) {
                    return;
                }

                if (!isFinite(point.longitude) || !isFinite(point.latitude)) {
                    return;
                }

                try {
                    classOnePoints.add({
                        position: Cartesian3.fromDegrees(point.longitude, point.latitude),
                        color: getColorFromValue(point.avg_data),
                        pixelSize: 3,
                        id: pointId
                    });

                    pointDataMap.set(pointId, {
                        ...point,
                        class: 'class_one'
                    });
                } catch (e) {
                    console.error(`Error adding point ${pointId}:`, e);
                }
            });
        })
        .catch(error => console.error('Error loading class_one points:', error));
}

export function loadClassTwoPoints(viewBounds, classTwoPoints, pointDataMap, callback) {
    const { west, south, east, north } = viewBounds;
    
    currentViewRequest.isActive = false;
    const requestId = Date.now();
    currentViewRequest = {
        viewBounds: { west, south, east, north },
        isActive: true,
        requestId: requestId
    };
    
    const MAX_POINTS = 100000;
    let loadedPointsCount = 0;
    let pageNumber = 1;
    const PAGE_SIZE = 5000;

    clearPointsOutsideView(viewBounds, classTwoPoints, pointDataMap);
    function loadMorePoints() {
        if (!currentViewRequest.isActive || currentViewRequest.requestId !== requestId) {
            return;
        }
        
        if (loadedPointsCount >= MAX_POINTS) {
            if (callback) callback();
            return;
        }
        
        fetch(`/api/class_two?west=${west}&south=${south}&east=${east}&north=${north}&page=${pageNumber}&pageSize=${PAGE_SIZE}`)
            .then(response => response.json())
            .then(data => {
                if (!currentViewRequest.isActive || currentViewRequest.requestId !== requestId) {
                    return;
                }
                
                if (data.length === 0) {
                    if (callback) callback();
                    return;
                }
                
                const batchSize = 500;
                const totalBatches = Math.ceil(data.length / batchSize);
                
                function processBatch(batchIndex) {
                    if (!currentViewRequest.isActive || currentViewRequest.requestId !== requestId) {
                        return;
                    }
                    
                    if (batchIndex >= totalBatches) {
                        loadedPointsCount += data.length;
                        pageNumber++;
                        setTimeout(loadMorePoints, 10);
                        return;
                    }
                    
                    const start = batchIndex * batchSize;
                    const end = Math.min(start + batchSize, data.length);
                    const batch = data.slice(start, end);
                    
                    batch.forEach(point => {
                        if (!point || typeof point.id === 'undefined') return;
                        
                        const pointId = `class_two_${point.id}`;
                        
                        if (pointDataMap.has(pointId)) {
                            return;
                        }
                        
                        if (!isFinite(point.longitude) || !isFinite(point.latitude)) {
                            return;
                        }
                        
                        try {
                            classTwoPoints.add({
                                position: Cartesian3.fromDegrees(point.longitude, point.latitude),
                                color: getColorFromValue(point.avg_data),
                                pixelSize: 3,
                                translucencyByDistance: {
                                    near: 10000,
                                    nearValue: 1.0,
                                    far: 100000,
                                    farValue: 0.0
                                },
                                id: pointId
                            });
                            
                            pointDataMap.set(pointId, {
                                ...point,
                                class: 'class_two'
                            });
                        } catch (e) {
                            console.error(`Error adding point ${pointId}:`, e);
                        }
                    });
                    
                    requestAnimationFrame(() => processBatch(batchIndex + 1));
                }
                
                processBatch(0);
            })
            .catch(error => {
                if (callback) callback();
            });
    }
    
    loadMorePoints();
}

export function clearPointsOutsideView(viewBounds, classTwoPoints, pointDataMap) {
    const { west, south, east, north } = viewBounds;
    const indicesToRemove = [];
    const allPoints = classTwoPoints._pointPrimitives;

    for (let i = 0; i < allPoints.length; i++) {
        const point = allPoints[i];
        const pointId = point.id;

        if (pointId && pointId.startsWith('class_two_')) {
            const pointData = pointDataMap.get(pointId);
            if (pointData) {
                const { longitude, latitude } = pointData;
                if (longitude < west || longitude > east || latitude < south || latitude > north) {
                    indicesToRemove.push(i);
                    pointDataMap.delete(pointId);
                }
            }
        }
    }

    if (indicesToRemove.length > 0) {
        try {
            for (let i = indicesToRemove.length - 1; i >= 0; i--) {
                const pointIndex = indicesToRemove[i];
                if (pointIndex >= 0 && pointIndex < allPoints.length) {
                    classTwoPoints.remove(classTwoPoints.get(pointIndex));
                }
            }
        } catch (e) {
            console.error('Error removing points:', e);
        }
    }
}
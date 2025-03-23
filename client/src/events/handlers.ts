import {
    ScreenSpaceEventHandler, ScreenSpaceEventType, PointPrimitive,
    LabelCollection, Color, HorizontalOrigin, VerticalOrigin, Cartesian2,
    SceneTransforms
} from 'cesium';

export function setupEventHandlers(viewer, pointDataMap) {
    const labelCollection = new LabelCollection();
    viewer.scene.primitives.add(labelCollection);

    let currentLabel = null;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
        if (currentLabel) {
            labelCollection.remove(currentLabel);
            currentLabel = null;
        }

        const pickedObject = viewer.scene.pick(click.position);

        if (pickedObject && (pickedObject.primitive instanceof PointPrimitive || pickedObject.id)) {
            const id = pickedObject.id || pickedObject.primitive.id;

            const pointData = pointDataMap.get(id);

            if (pointData) {
                const position = pickedObject.primitive.position || pickedObject.position;
                SceneTransforms.wgs84ToWindowCoordinates(
                    viewer.scene, position
                );

                currentLabel = labelCollection.add({
                    position: position,
                    text: `ID: ${pointData.id}\nLongitude: ${pointData.longitude.toFixed(6)}\nLatitude: ${pointData.latitude.toFixed(6)}\nAverage: ${pointData.avg_data.toFixed(4)} mm\nError: ${pointData.error.toFixed(4)}`,
                    font: '14px sans-serif',
                    fillColor: Color.WHITE,
                    outlineColor: Color.BLACK,
                    outlineWidth: 2,
                    style: 2,
                    showBackground: true,
                    backgroundColor: new Color(0.165, 0.165, 0.165, 0.8),
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.BOTTOM,
                    pixelOffset: new Cartesian2(10, -10),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                });
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
}
import React, { useEffect, useRef } from 'react';
import Dropdown from '../Display/Dropdown';
import './CesiumPlot.css'

export default function CesiumPlot(props) {
    let Ces = window.Cesium;
    const viewer = useRef('');
    let singleTileLayer;
    useEffect(() => {
        viewer.current = new window.Cesium.Viewer("cesiumContainer");
        return () => { }
    }, []);
    useEffect(() => {
        if (props.content.czml.length !== 0) {
            viewer.current.dataSources.removeAll();
            let dataSourcePromise = Ces.CzmlDataSource.load(props.content.czml);
            viewer.current.dataSources.add(dataSourcePromise);
            viewer.current.zoomTo(dataSourcePromise);
        }
        return () => { }
    }, [props.content, Ces.CzmlDataSource, Ces.Viewer]);

    const getSingleImage = (props) => {
        viewer.current.clock.shouldAnimate = false;

        viewer.current.entities.removeAll();
        viewer.current.dataSources.removeAll();

        Ces.knockout.cleanNode(document.getElementById("toolbar"));
        if (singleTileLayer) {
            viewer.current.imageryLayers.remove(singleTileLayer);
          }
        let layer = viewer.current.scene.imageryLayers;
        singleTileLayer = layer.addImageryProvider(
            new Ces.SingleTileImageryProvider({
                name: "image for date " + props.id,
                url: props.image,
                rectangle: Ces.Rectangle.fromDegrees(props.coordinates[0], props.coordinates[1], props.coordinates[2], props.coordinates[3]),
            })
        );
        singleTileLayer.alpha = 0.7;
        singleTileLayer.colorToAlpha = new Ces.Color(0.0, 0.0, 0.0, 1.0);
        singleTileLayer.colorToAlphaThreshold = 0;


        var viewModel = {
            threshold: singleTileLayer.colorToAlphaThreshold,
        };

        Ces.knockout.track(viewModel);

        var toolbar = document.getElementById("toolbar");
        Ces.knockout.applyBindings(viewModel, toolbar);

        Ces.knockout
            .getObservable(viewModel, "threshold")
            .subscribe(function (newValue) {
                singleTileLayer.colorToAlphaThreshold = parseFloat(
                    viewModel.threshold
                );
            });

    }
    return (
        <div>
            <div id="cesiumContainer">
                <div id="toolbar">
                    <Dropdown clickFunction={getSingleImage} options={props.view.resultView} />
                    Threshold
                    <input id="slider" type="range" min="0" max="1" step="0.01" data-bind="value: threshold, valueUpdate: 'input'" />
                </div>
            </div>
        </div>
    )
}

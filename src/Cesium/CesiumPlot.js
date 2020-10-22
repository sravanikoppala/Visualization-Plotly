import React, { useEffect, useRef } from 'react';
import Controls from '../Display/Control'
import { useForm, Form } from '../Services/FiltersService';
import Dropdown from '../Display/Dropdown';

const initialValues = {
    result: ''
}

export default function CesiumPlot(props) {
    //let c = props.content;
    let Ces = window.Cesium;
    const viewer = useRef('');
    const { values, handleInputChange } = useForm(initialValues);
    useEffect(() => {
        viewer.current = new window.Cesium.Viewer("cesiumContainer");
        return () => { }
    }, []);
    useEffect(() => {
        if (props.content.czml.length !== 0) {
            console.log("Inside");
            viewer.current.dataSources.removeAll();
            let dataSourcePromise = Ces.CzmlDataSource.load(props.content.czml);
            viewer.current.dataSources.add(dataSourcePromise);
            viewer.current.zoomTo(dataSourcePromise);
        }
        return () => {
            console.log("return");
        }
    }, [props.content, Ces.CzmlDataSource, Ces.Viewer]);

    return (
        <div>
            <div id="cesiumContainer">
            <Form>
                <Controls.Select name="result" label="Data View" value={values.result} onChange={handleInputChange} options={props.view.resultView} />
            </Form>
            {/* <Dropdown value={values.result} options={props.view.resultView}/> */}
            </div>
        </div>
    )
}

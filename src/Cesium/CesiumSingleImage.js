import React, { useState, useEffect, useRef } from 'react';
import * as CesiumService from './CesiumService';
import Token from '../Services/Config.json';
import Controls from '../Display/Control';
import Draggable from 'react-draggable';
import { DatePicker, Spin } from 'antd';
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import AssistantIcon from '@material-ui/icons/Assistant';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './CesiumPlot.css';

import HttpRequest from '../Services/HttpRequestService';
import moment from 'moment';
import Url from '../Services/Config.json';

// const initialValues = {
//     startDate: '2019/01/01',
//     color: 'col',
//     dataset: 'mrms'
// }

export default function CesiumSingleImage() {
    // const { values, handleInputChange } = useForm(initialValues);
    const [loadingState, setLoadingState] = useState(false);
    const [alertState, setAlertState] = useState(false);
    const [resultsState, setResultsState] = useState(false);
    const [loadSliderState, setloadSliderState] = useState(false);
    const [collapse, setcollapse] = useState(true);
    const [dragDisable, setdragDisable] = useState(false);
    const [sliderValue, setsliderValue] = useState(0);
    const [open, setOpen] = useState(false);

    const [startingDate, setstartingDate] = useState('2019-01-29');
    const [color, setColor] = useState('col');
    const [datasetName, setdatasetName] = useState('mrms');



    const fetchDataState = (loading, alert, loadSlider) => {
        setLoadingState(loading);
        setAlertState(alert);
        setloadSliderState(loadSlider);
    }
    const viewer = useRef('');
    window.Cesium.Ion.defaultAccessToken = Token.Cesium.accessToken;
    useEffect(() => {
        viewer.current = new window.Cesium.Viewer("cesiumContainer");
        viewer.current.camera.setView({
            destination: window.Cesium.Cartesian3.fromDegrees(-99, 37, 4800000)
        });
        return () => { }
    }, []);

    const toggleResultsDialog = () => {
        setOpen(!open);
    };

    const datechange = (date, dateString) => {
        setstartingDate(dateString);
        getDataFetch(dateString, color);
    }

    const toggleDrawer = (props) => (event) => {
        setcollapse(!collapse);
    }
    const toggleDragDisable = () => {
        setdragDisable(!dragDisable);
    }
    const toggleSliderState = (state) => {
        setloadSliderState(state);
    }
    const settingSliderValue = (value) => {
        setsliderValue(value);
    }
    // useEffect(() => {
    //     const ele = document.querySelector(".slider-thumb-label");
    //     if (ele) {
    //         ele.style.left = `${Number(sliderValue * 52)}px`;
    //     }
    // }, [sliderValue]);

    const getDataFetch = (dateString, color) => {
        setdatasetName('mrms');
        viewer.current.scene.imageryLayers.remove(mrmsSingleTileLayer.current);
        viewer.current.scene.imageryLayers.remove(gpmSingleTileLayer.current);
        fetchDataState(true, false, false);
        let startDate = moment(dateString).format("YY-MM-DD");
        let apiUrl = Url.Cesium.apiUrl;
        startDate = startDate.replace(/-/g, '');
        apiUrl = apiUrl.concat("date=", startDate);
        console.log(apiUrl);
        viewer.current.entities.removeAll();
        viewer.current.dataSources.removeAll();
        let czmlLoad = {
            czml: []
        };

        HttpRequest(apiUrl)
            .then(response => {
                if (response.data.status === "SUCCESS") {
                    setResultsState(true);
                    let apiData = response.data.data.result;
                    let dataMap = new Map(Object.entries(apiData));
                    let dataResults = [];

                    let json = {
                        id: "document",
                        name: "Image Transitions of CAPRi",
                        version: "1.0",
                    };
                    czmlLoad.czml.push(json);

                    for (let entry of dataMap.entries()) {
                        let latlon = entry[1]['latlonbox_wsen'];
                        let dataView = {
                            id: entry[0],
                            coordinates: latlon,
                            mrmscol: entry[1]['mrms'][0],
                            mrmsbw: entry[1]['mrms'][1],
                            gpmcol: entry[1]['gpm'][0],
                            gpmbw: entry[1]['gpm'][1]
                        };
                        let jsonData = {
                            id: entry[0],
                            name: entry[0],
                            description:
                                "<p>image for date site " + entry[0] + "</p>",
                            rectangle: {
                                coordinates: {
                                    wsenDegrees: latlon,
                                },
                                material: {
                                    image: {
                                        image: {},
                                        color: {
                                            rgba: [255, 255, 255, 220],
                                        },
                                    },
                                },
                            },
                        };
                        jsonData['rectangle']['material']['image']['image']['uri'] = entry[1]['mrms'][0];
                        czmlLoad.czml.push(jsonData);
                        viewer.current.entities.add({
                            position: window.Cesium.Cartesian3.fromDegrees(latlon[0], latlon[3]),
                            label: {
                                text: entry[0],
                                font: "14px Helvetica"
                            },
                        });
                        dataResults.push(dataView);
                    }
                    fetchDataState(false, false, false);
                    settingresult(dataResults);
                    let CzmlDataSource = new window.Cesium.CzmlDataSource();
                    CzmlDataSource.load(czmlLoad.czml);
                    viewer.current.dataSources.add(CzmlDataSource);
                    viewer.current.zoomTo(CzmlDataSource, new window.Cesium.HeadingPitchRange(Math.PI / 4, -Math.PI / 2));
                }
            }).catch(err => {
                fetchDataState(false, true, false);
                setResultsState(false);
                console.log(err);
            });;

    }

    const toggleDataset = (dataset) => {
        if (dataset) {
            setdatasetName('mrms');
            plotCzml('mrms', color);
        } else {
            setdatasetName('gpm');
            plotCzml('gpm', color);
        }
    }

    const plotCzml = (dataset, color) => {
        setloadSliderState(false);
        viewer.current.entities.removeAll();
        viewer.current.dataSources.removeAll();
        let czmlLoad = {
            czml: []
        };

        let json = {
            id: "document",
            name: "Image Transitions of CAPRi",
            version: "1.0",
        };
        czmlLoad.czml.push(json);
        for (let entry of resultState.resultView) {
            let jsonData = {
                id: entry.id,
                name: entry.id,
                description:
                    "<p>image for date site " + entry.id + "</p>",
                rectangle: {
                    coordinates: {
                        wsenDegrees: entry.coordinates,
                    },
                    material: {
                        image: {
                            image: {},
                            color: {
                                rgba: [255, 255, 255, 220],
                            },
                        },
                    },
                },
            };
            if (dataset === 'gpm' && color === 'col') {
                jsonData['rectangle']['material']['image']['image']['uri'] = entry.gpmcol;
                czmlLoad.czml.push(jsonData);

            } else if (dataset === 'mrms' && color === 'col') {
                jsonData['rectangle']['material']['image']['image']['uri'] = entry.mrmscol;
                czmlLoad.czml.push(jsonData);

            } else if (dataset === 'mrms' && color === 'bw') {
                jsonData['rectangle']['material']['image']['image']['uri'] = entry.mrmsbw;
                czmlLoad.czml.push(jsonData);

            } else if (dataset === 'gpm' && color === 'bw') {
                jsonData['rectangle']['material']['image']['image']['uri'] = entry.gpmbw;
                czmlLoad.czml.push(jsonData);
            }
            viewer.current.entities.add({
                position: window.Cesium.Cartesian3.fromDegrees(entry.coordinates[0], entry.coordinates[3]),
                label: {
                    text: entry.id,
                    font: "14px Helvetica"
                },
            });
        }
        let CzmlDataSource = new window.Cesium.CzmlDataSource();
        CzmlDataSource.load(czmlLoad.czml);
        viewer.current.dataSources.add(CzmlDataSource);
        viewer.current.zoomTo(CzmlDataSource, new window.Cesium.HeadingPitchRange(Math.PI / 4, -Math.PI / 2));

    }
    const [resultState, setresultState] = useState({
        resultView: []
    });
    const settingresult = (resultsArray) => {
        setresultState({
            resultView: resultsArray
        });
    };
    const mrmsSingleTileLayer = useRef('');
    const gpmSingleTileLayer = useRef('');

    const getSingleImage = (image) => {
        toggleSliderState(true);
        viewer.current.clock.shouldAnimate = false;
        viewer.current.scene.imageryLayers.remove(mrmsSingleTileLayer.current);
        viewer.current.scene.imageryLayers.remove(gpmSingleTileLayer.current);
        viewer.current.entities.removeAll();
        viewer.current.dataSources.removeAll();

        let Ces = window.Cesium;

        Ces.knockout.cleanNode(document.getElementById("toolbar"));

        // if (singleTileLayer) {
        //     viewer.current.scene.imageryLayers.remove(singleTileLayer.current);
        // }
        let layer = viewer.current.scene.imageryLayers;
        let layerName;

        if (color === 'col') {
            if (datasetName === 'gpm') {
                mrmsSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.mrmscol,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                gpmSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.gpmcol,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                layerName = gpmSingleTileLayer.current;

            } else {
                gpmSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.gpmcol,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                mrmsSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.mrmscol,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                layerName = mrmsSingleTileLayer.current;

            }

        } else {
            if (datasetName === 'gpm') {
                mrmsSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.mrmsbw,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                gpmSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.gpmbw,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                layerName = gpmSingleTileLayer.current;

            } else {
                gpmSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.gpmbw,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                mrmsSingleTileLayer.current = layer.addImageryProvider(
                    new Ces.SingleTileImageryProvider({
                        url: image.mrmsbw,
                        rectangle: Ces.Rectangle.fromDegrees(image.coordinates[0], image.coordinates[1], image.coordinates[2], image.coordinates[3]),
                    })
                );
                layerName = mrmsSingleTileLayer.current;

            }
        }
        // mrmsSingleTileLayer.current.alpha = 0.8;
        layerName.colorToAlpha = new Ces.Color(0.0, 0.0, 0.0, 1.0);
        // mrmsSingleTileLayer.current.colorToAlphaThreshold = 0;
        var viewModel = {
            threshold: layerName.colorToAlphaThreshold,
        };

        Ces.knockout.track(viewModel);
        var toolbar = document.getElementById("toolbar");
        Ces.knockout.applyBindings(viewModel, toolbar);

        Ces.knockout
            .getObservable(viewModel, "threshold")
            .subscribe(function (newValue) {
                settingSliderValue(newValue);
                layerName.colorToAlphaThreshold = parseFloat(
                    viewModel.threshold
                );
            });
        viewer.current.zoomTo(layerName, new window.Cesium.HeadingPitchRange(Math.PI / 4, -Math.PI / 2));
        viewer.current.entities.add({
            position: window.Cesium.Cartesian3.fromDegrees(image.coordinates[2], image.coordinates[3]),
            label: {
                text: "Date: " + startingDate,
                font: "14px Helvetica"
            },
        });
        viewer.current.entities.add({
            position: window.Cesium.Cartesian3.fromDegrees(image.coordinates[0], image.coordinates[1]),
            label: {
                text: "Site: " + image.id,
                font: "14px Helvetica"
            },
        });

    }

    const togSwitch = (check) => {
        if (check === true) {
            setColor('col');
            plotCzml(datasetName, 'col');
        } else {
            setColor('bw');
            plotCzml(datasetName, 'bw');
        }
    }

    const [openAssistant, setOpenAssistant] = useState(false);
    const togAssistant = () => {
        setOpenAssistant(!openAssistant);
    }

    const [availableDates, setDatesArray] = useState([]);
    const getDates = () => {
        let dates = [];
        let jsonurl = 'https://capri-kml-png-data.s3.amazonaws.com/index/date_list.json';
        console.log(jsonurl);
        HttpRequest(jsonurl)
            .then(response => {
                // console.log(response.data);
                for (let date of response.data) {
                    var res = date.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
                    res = ("20").concat(res);
                    console.log(res);
                    dates.push(res);
                }
                setDatesArray(dates);
            });
    }
    const datesViewer = (
        <Dialog open={openAssistant} onClose={togAssistant} aria-labelledby="form-dialog-title" fullWidth={true} >
            <div className="dialog-title">Available dates with data:</div>
            <DialogContent>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            resultState.resultView.map(
                                item => (
                                    <tr key={item.id} className="table-row" >
                                        <td>{item.id} </td>
                                    </tr>)
                            )
                        }

                    </tbody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button id="dialog-cancel-button" onClick={togAssistant} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
    return (
        <div>
            <Spin tip="Loading..." spinning={loadingState}>
                <div id="cesiumContainer" >
                    <Draggable disabled={dragDisable}>
                        <div className="menu-overlay">
                            <div className="menu-components">
                                <div className="menu-label" >
                                    <label>Data manager</label> <div className="arrow-icon">
                                        {collapse ? <span id="arrow-up"> <ArrowDropUpIcon fontSize="large" onClick={toggleDrawer(true)} /> </span> : <span id="arrow-down"><ArrowDropDownIcon fontSize="large" onClick={toggleDrawer(true)} /></span>} </div>
                                </div>
                                <div className={collapse ? "menu-filters" : "menu-filters-active"} >
                                    {/* <Controls.DatePicker name="startDate" label="Start Date" value={values.startDate} onChange={handleInputChange} /> */}
                                    <DatePicker defaultValue={moment('2019/01/29')} onChange={datechange}></DatePicker>
                                    <AssistantIcon fontSize="large" onClick={e => { getDates(); togAssistant(); }} style={{ marginTop: '7px', marginRight: '10px' }} />
                                    {/* <Controls.SelectAntD name="color" label="Color" value={color} onChange={e => { setColor(e.target.value); if (e.target.value === 'bw') { getDataFetch(startingDate, 'bw'); } else { getDataFetch(startingDate, 'col'); } }} options={CesiumService.getColorList()} /> */}
                                    {openAssistant ? datesViewer : null}
                                    {
                                        resultsState ?
                                            <div className="results-view">
                                                <span className="labelColor">Color: </span><span className="color-label">BW <Controls.ToggleSwitch onChange={togSwitch} /> COL</span>
                                                <br />
                                                Dataset:<span className="dataset-label">GPM  <Controls.ToggleSwitch onChange={toggleDataset} />  MRMS</span>
                                                {/* <Controls.SelectAntD name="dataset" label="Dataset" value={datasetName} onChange={e => { setdatasetName(e.target.value); toggleDataset(e); }} options={CesiumService.getDatasetList()} /> */}
                                                <Controls.Button text="Data viewer" size="small" onClick={toggleResultsDialog} />
                                                <div id="toolbar" onMouseEnter={toggleDragDisable} onMouseLeave={toggleDragDisable}>
                                                    <div className={loadSliderState ? "slider" : "toolbar-inactive"}>
                                                        Threshold
                                                        <input id="myInput" type="range" min="0" max="1" step="0.01" data-bind="value: threshold, valueUpdate: 'input'" />
                                                        <span className="slider-thumb-label">{sliderValue}</span>
                                                    </div>
                                                </div>
                                                <Dialog open={open} onClose={toggleResultsDialog} aria-labelledby="form-dialog-title" fullWidth={true} >
                                                    <div className="dialog-title">Results of {startingDate}</div>
                                                    <DialogContent>
                                                        <Table striped bordered hover >
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Site</th>
                                                                    <th>Color</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody onClick={toggleResultsDialog}>
                                                                {
                                                                    resultState.resultView.map(
                                                                        item => (
                                                                            <tr key={item.id} className="table-row" onClick={e => getSingleImage(item, 'mrms')} >
                                                                                <td>{startingDate}</td>
                                                                                <td>{item.id} </td>
                                                                                <td>{color} </td>
                                                                            </tr>)
                                                                    )
                                                                }

                                                            </tbody>
                                                        </Table>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button id="dialog-cancel-button" onClick={toggleResultsDialog} color="primary">Cancel</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div> : null
                                    }
                                </div></div>
                        </div>
                    </Draggable>
                    {
                        alertState ? <div className='textLoop'> <Controls.AlertTextLoop />  </div> : null
                    }
                </div>
            </Spin>
            {
                alertState ? <Controls.AlertTextLoop /> : null
            }
        </div>
    )
}

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '../Services/FiltersService';
import * as CesiumService from './CesiumService';
import Token from '../Services/Config.json';
import Controls from '../Display/Control';
import Draggable from 'react-draggable';
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './CesiumPlot.css';

const initialValues = {
  startDate: '2019/01/01',
  endDate: '',
  color: 'col',
  dataset: 'mrms',
  gr_site: 'KBOX'
}


export default function CesiumComponent() {
  const { values, handleInputChange } = useForm(initialValues);

  const [loadingState, setLoadingState] = useState(false);
  const [alertState, setAlertState] = useState(false);
  const [resultsState, setResultsState] = useState(false);
  const [loadSliderState, setloadSliderState] = useState(false);
  const [collapse, setcollapse] = useState(true);
  const [dragDisable, setdragDisable] = useState(false);
  const [sliderValue, setsliderValue] = useState(0);
  const [open, setOpen] = useState(false);

  const [startingDate, setstartingDate] = useState('2019/01/01');
  const [endingDate, setendingDate] = useState('2019/03/30');

  const [czmlState, setczmlState] = useState({
    czml: []
  });
  const [resultState, setresultState] = useState({
    resultView: []
  });

  const fetchDataState = (loading, alert, loadSlider) => {
    setLoadingState(loading);
    setAlertState(alert);
    setloadSliderState(loadSlider);
  }
  const settingCzml = (czmlArray, resultsArray) => {
    setczmlState({
      czml: czmlArray
    });

    setresultState({
      resultView: resultsArray
    });
  };

  const viewer = useRef('');
  const CzmlDataSource = useRef('');
  const singleTileLayer = useRef('');

  window.Cesium.Ion.defaultAccessToken = Token.Cesium.accessToken;

  useEffect(() => {
    viewer.current = new window.Cesium.Viewer("cesiumContainer");
    var center = window.Cesium.Cartesian3.fromDegrees(-102, 37);
    viewer.current.camera.lookAt(center, new window.Cesium.Cartesian3(0.0, 0.0, 4700000.0));
    return () => { }
  }, []);

  useEffect(() => {
    if (czmlState.czml.length !== 0) {
      viewer.current.entities.removeAll();
      viewer.current.dataSources.removeAll();
      if (singleTileLayer) {
        viewer.current.scene.imageryLayers.remove(singleTileLayer.current);
      }
      CzmlDataSource.current = new window.Cesium.CzmlDataSource();
      CzmlDataSource.current.load(czmlState.czml);
      viewer.current.dataSources.add(CzmlDataSource.current);
      viewer.current.zoomTo(CzmlDataSource.current, new window.Cesium.HeadingPitchRange(Math.PI / 4, -Math.PI / 2));
      setResultsState(true);
    }
    return () => { }
  }, [czmlState.czml]);

  const toggleResultsDialog = () => {
    setOpen(!open);
  };

  const datechange = (date, dateString) => {
    setstartingDate(dateString[0]);
    setendingDate(dateString[1]);
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

  useEffect(() => {
    const ele = document.querySelector(".slider-thumb-label");
    if (ele) {
      ele.style.left = `${Number(sliderValue * 92)}px`;
    }
  }, [sliderValue]);


  return (
    <div>
      <Spin tip="Loading..." spinning={loadingState}>
        <div id="cesiumContainer" >
          <Draggable disabled={dragDisable}>
            <div className="menu-overlay">
              <div className="menu-components">
                <div className="menu-label" >
                  <label>Selection filters</label> <div className="arrow-icon">
                    {collapse ? <span id="arrow-up"> <ArrowDropUpIcon fontSize="large" onClick={toggleDrawer(true)} /> </span> : <span id="arrow-down"><ArrowDropDownIcon fontSize="large" onClick={toggleDrawer(true)} /></span>} </div>
                </div>

                <div className={collapse ? "menu-filters" : "menu-filters-active"}>
                  <Controls.DaterangePicker defStartDate={startingDate} defEndDate={endingDate} onChange={datechange} />
                  <Controls.SelectAntD name="color" label="Color" value={values.color} onChange={handleInputChange} options={CesiumService.getColorList()} />
                  <Controls.SelectAntD name="dataset" label="Dataset" value={values.dataset} onChange={handleInputChange} options={CesiumService.getDatasetList()} />
                  <Controls.SelectAntD name="gr_site" label="GR Site" value={values.gr_site} onChange={handleInputChange} options={CesiumService.getGrSiteList()} />
                  <Controls.Button text="Submit" size="small" onClick={() => { CesiumService.getDataFetch(values, startingDate, endingDate, settingCzml, fetchDataState); }} />
                  {
                    resultsState ?
                      <div className="results-view">
                        <div onClick={toggleResultsDialog}>Open Data view dialog</div>
                        <div id="toolbar" onMouseEnter={toggleDragDisable} onMouseLeave={toggleDragDisable}>
                          <div className={loadSliderState ? "slider" : "toolbar-inactive"}>
                            Threshold
                            <input id="myInput" type="range" min="0" max="1" step="0.01" data-bind="value: threshold, valueUpdate: 'input'" />
                            <div className="slider-thumb-label"> <span>{sliderValue}</span> </div>
                          </div>
                        </div>
                        <Dialog open={open} onClose={toggleResultsDialog} aria-labelledby="form-dialog-title" fullWidth={true} >
                          <div className="dialog-title">Results from {startingDate} to {endingDate}</div>
                          <DialogContent>
                            <Table striped bordered hover >
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Dataset</th>
                                  <th>Site</th>
                                  <th>Color</th>
                                </tr>
                              </thead>
                              <tbody onClick={toggleResultsDialog}>
                                {
                                  resultState.resultView.map(
                                    item => (
                                      <tr key={item.id} className="table-row" onClick={e => CesiumService.getSingleImage(viewer, singleTileLayer, toggleSliderState, settingSliderValue, item)} >
                                        <td>{item.id}</td>
                                        <td> {values.dataset} </td>
                                        <td>{values.gr_site} </td>
                                        <td>{values.color} </td>
                                      </tr>)
                                  )
                                }
                              </tbody>
                            </Table>
                          </DialogContent>
                          <DialogActions>
                            <Button id="dialog-cancel-button" onClick={toggleResultsDialog} color="primary">Cancel</Button>
                          </DialogActions>
                        </Dialog></div> : null
                  }
                </div></div>
            </div>
          </Draggable>

        </div>
      </Spin>
      {
        alertState ? <Controls.AlertTextLoop /> : null
      }
    </div >
  )
}

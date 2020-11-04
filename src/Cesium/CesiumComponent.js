import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '../Services/FiltersService';
import * as CesiumService from './CesiumService';
import HttpRequest from '../Services/HttpRequestService';
import Url from '../Services/Config.json'
import Controls from '../Display/Control';
import Draggable from 'react-draggable';
import moment from 'moment';
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './CesiumPlot.css';
const initialValues = {
  startDate: new Date('2019-01-02'),
  endDate: new Date('2019-03-26'),
  color: 'col',
  dataset: 'mrms',
  gr_site: 'KBOX'
}


export default function CesiumComponent() {
  const [loadingState, setLoadingState] = useState(false);
  const [alertState, setAlertState] = useState(false);
  const [resultsState, setResultsState] = useState(false);
  const [startingDate, setstartingDate] = useState('2019/01/01');
  const [endingDate, setendingDate] = useState('2019/03/30');

  const [czmlState, setczmlState] = useState({
    czml: []
  });
  const [resultState, setresultState] = useState({
    resultView: []
  });

  const { values, handleInputChange } = useForm(initialValues);

  const getData = (values) => {
    setLoadingState(true);
    setAlertState(false);
    setloadSliderState(false);
    console.log(startingDate, endingDate);

    let startDate = moment(startingDate).format("YY-MM-DD");
    let endDate = moment(endingDate).format("YY-MM-DD");
    let apiUrl = Url.Cesium.apiUrl;
    let dataResults = [];
    startDate = startDate.replace(/-/g, '');
    endDate = endDate.replace(/-/g, '');
    console.log(startDate, endDate);
    apiUrl = apiUrl.concat("start_date=", startDate, "&end_date=", endDate, "&color=", values.color, "&dataset=", values.dataset, "&gr_site=", values.gr_site, "&sort=true");
    console.log(apiUrl);
    HttpRequest(apiUrl).then(
      response => {
        if (response.data.errorType === "KeyError") {
          console.log(response.data);
          setLoadingState(false);
          setAlertState(true);

        } else if (response.data.status === "INVALID" || response.data.status === "EMPTY") {
          setLoadingState(false);
          setAlertState(true);

        } else if (response.data.status === "SUCCESS") {
          let czmlLoad = {
            czml: []
          };

          let json = {
            id: "document",
            name: "Image Transitions of CAPRi",
            version: "1.0",
          };
          czmlLoad.czml.push(json);
          let apiData = response.data.data;

          for (let x of apiData) {

            let momentEndD = x.next_date;
            const momentStartD = x.date;
            let dataView = {
              id: momentStartD,
              title: momentStartD,
              coordinates: x.latlonbox_wsen,
              image: x.png_file,
            };

            if (momentEndD === "None") {
              momentEndD = moment(momentStartD).add(1, 'days');
              momentEndD = moment(momentEndD).format("YYYY-MM-DD");
            }

            let date = "";
            date = date.concat(momentStartD, "/", momentEndD);

            let jsonData = {
              id: x.date,
              name: "image for date " + momentStartD,
              availability: date,
              rectangle: {
                coordinates: {
                  wsenDegrees: x.latlonbox_wsen,
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
            let columnName = "uri";
            jsonData['rectangle']['material']['image']['image'][columnName] = x.png_file;
            czmlLoad.czml.push(jsonData);
            dataResults.push(dataView);
          }

          // console.log(czmlLoad.czml);
          setczmlState({
            czml: czmlLoad.czml
          })
          setresultState({
            resultView: dataResults
          })
          setLoadingState(false);
        }

      }
    );
  }
  
  const viewer = useRef('');
  let Ces = window.Cesium;
  Ces.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MmMxYjJiYS04MmQyLTQzMDEtYjA0NC04ODI3OWYzOGJjNmMiLCJpZCI6MzM2ODcsImlhdCI6MTU5OTA4MTk4MX0.tVTANg3MA7JR9yBYm23ayj-XdlIlUjT-FQqEFtPi-os';
  useEffect(() => {
    viewer.current = new window.Cesium.Viewer("cesiumContainer");
    return () => { }
  }, []);
  useEffect(() => {
    if (czmlState.czml.length !== 0) {
      viewer.current.dataSources.removeAll();
      let dataSourcePromise = Ces.CzmlDataSource.load(czmlState.czml);
      viewer.current.dataSources.add(dataSourcePromise);
      viewer.current.zoomTo(dataSourcePromise);
      setResultsState(true);
    }
    return () => { }
  }, [czmlState.czml, Ces.CzmlDataSource, Ces.Viewer]);
  
  const singleTileLayer = useRef('');

  const [loadSliderState, setloadSliderState] = useState(false);

  const getSingleImage = (props) => {

    viewer.current.clock.shouldAnimate = false;

    viewer.current.entities.removeAll();
    viewer.current.dataSources.removeAll();

    Ces.knockout.cleanNode(document.getElementById("toolbar"));
    if (singleTileLayer) {
      viewer.current.scene.imageryLayers.remove(singleTileLayer.current);
    }
    let layer = viewer.current.scene.imageryLayers;
    singleTileLayer.current = layer.addImageryProvider(
      new Ces.SingleTileImageryProvider({
        name: "image for date " + props.id,
        url: props.image,
        rectangle: Ces.Rectangle.fromDegrees(props.coordinates[0], props.coordinates[1], props.coordinates[2], props.coordinates[3]),
      })
    );

    singleTileLayer.current.alpha = 0.7;
    singleTileLayer.current.colorToAlpha = new Ces.Color(0.0, 0.0, 0.0, 1.0);
    singleTileLayer.current.colorToAlphaThreshold = 0;


    var viewModel = {
      threshold: singleTileLayer.current.colorToAlphaThreshold,
    };

    Ces.knockout.track(viewModel);

    var toolbar = document.getElementById("toolbar");
    Ces.knockout.applyBindings(viewModel, toolbar);

    Ces.knockout
      .getObservable(viewModel, "threshold")
      .subscribe(function (newValue) {
        singleTileLayer.current.colorToAlphaThreshold = parseFloat(
          viewModel.threshold
        );
      });

  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setloadSliderState(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const datechange = (date, dateString) => {
    setstartingDate(dateString[0]);
    setendingDate(dateString[1]);
  }
  const [collapse, setcollapse] = useState(true);
  const [dragDisable, setdragDisable] = useState(false);
  const toggleDrawer = (props) => (event) => {
    setcollapse(!collapse);
  }
  const toggleDragDisable = () => {
    setdragDisable(!dragDisable);
  }
  return (
    <div>
      <Spin tip="Loading..." spinning={loadingState}>
        <div id="cesiumContainer" >
          <Draggable disabled={dragDisable}>
            <div className="menu-overlay">
              <div className="menu-components">
                <div className="menu-label" onClick={toggleDrawer(true)}>
                  <label>Selection filters</label> <div className="arrow-icon"> {collapse ? <ArrowDropUpIcon fontSize="large" /> : <ArrowDropDownIcon fontSize="large" />} </div>
                </div>

                <div className={collapse ? "menu-filters" : "menu-filters-active"}>
                  <Controls.DaterangePicker defStartDate={startingDate} defEndDate={endingDate} onChange={datechange} />
                  <Controls.SelectAntD name="color" label="Color" value={values.color} onChange={handleInputChange} options={CesiumService.getColorList()} />
                  <Controls.SelectAntD name="dataset" label="Dataset" value={values.dataset} onChange={handleInputChange} options={CesiumService.getDatasetList()} />
                  <Controls.SelectAntD name="gr_site" label="GR Site" value={values.gr_site} onChange={handleInputChange} options={CesiumService.getGrSiteList()} />
                  <Controls.Button text="Submit" size="small" onClick={e => getData(values)} />
                  {
                    resultsState ? <div className="results-view">
                      <div onClick={handleClickOpen}>Open Data view dialog</div>
                      <div id="toolbar" onMouseEnter={toggleDragDisable} onMouseLeave={toggleDragDisable}>
                        <div id={loadSliderState ? "slider" : "toolbaractive"}>
                          Threshold <input type="range" min="0" max="1" step="0.01" data-bind="value: threshold, valueUpdate: 'input'" />
                        </div>
                      </div>
                      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} >
                        <DialogTitle id="form-dialog-title">Dataview from </DialogTitle>
                        <DialogContent>
                          <Table striped bordered hover variant="dark">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Dataset</th>
                                <th>Site</th>
                                <th>Color</th>
                              </tr>
                            </thead>
                            <tbody onClick={handleClose}>
                              {
                                resultState.resultView.map(
                                  item => (
                                    <tr onClick={e => getSingleImage(item)} >
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
                          <Button onClick={handleClose} color="primary">Cancel</Button>
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

import React, { useState } from 'react';
import { useForm, Form } from '../Services/FiltersService';
import * as CesiumService from './CesiumService';
import CesiumPlot from './CesiumPlot';
import HttpRequest from '../Services/HttpRequestService';
import Url from '../Services/Config.json'
import * as moment from 'moment';
import Controls from '../Display/Control'

import { Spin } from 'antd';
import 'antd/dist/antd.css';

const initialValues = {
  startDate: new Date('2019-01-02'),
  endDate: new Date('2019-03-26'),
  color: 'col',
  dataset: 'mrms',
  gr_site: 'KBOX'
}

export default function CesiumComponent() {
  const [loadingState, setLoadingState] = useState(false);
  const [loadPlotState, setloadPlotState] = useState(false);
  const [czmlState, setczmlState] = useState({
    czml: []
  });
  const [resultState, setresultState] = useState({
    resultView: []
  });

  const { values, handleInputChange } = useForm(initialValues);

  const getData = (values) => {
    setLoadingState(true);
    setloadPlotState(true);
    let startDate = moment(values.startDate).format("YY-MM-DD");
    let endDate = moment(values.endDate).format("YY-MM-DD");
    let apiUrl = Url.Cesium.apiUrl;
    let dataResults = [];
    startDate = startDate.replace(/-/g, '');
    endDate = endDate.replace(/-/g, '');
    apiUrl = apiUrl.concat("start_date=", startDate, "&end_date=", endDate, "&color=", values.color, "&dataset=", values.dataset, "&gr_site=", values.gr_site, "&sort=true");
    console.log(apiUrl);
    HttpRequest(apiUrl).then(
      response => {
        if (response.data.errorType === "KeyError") {
          console.log(response.data);

        } else if (response.data.status === "INVALID" || response.data.status === "EMPTY") {
          console.log("empty");
          console.log(response.data);

        } else if (response.data.status === "SUCCESS") {
          setloadPlotState(true);

          // let dataResults = [];
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
  return (
    <div>
      <h2>Select filters to plot on Cesium</h2>
      <Form>
        <Controls.DatePicker name="startDate" label="Start Date" value={values.startDate} onChange={handleInputChange} />
        <Controls.DatePicker name="endDate" label="End Date" value={values.endDate} onChange={handleInputChange} />
        <Controls.Select name="color" label="Color" value={values.color} onChange={handleInputChange} options={CesiumService.getColorList()} />
        <Controls.Select name="dataset" label="Dataset" value={values.dataset} onChange={handleInputChange} options={CesiumService.getDatasetList()} />
        <Controls.Select name="gr_site" label="GR Site" value={values.gr_site} onChange={handleInputChange} options={CesiumService.getGrSiteList()} />
        <Controls.Button text="Submit" onClick={e => getData(values)} />
      </Form>
      {
        loadPlotState ? <Spin tip="Loading..." spinning={loadingState}>
          <CesiumPlot content={czmlState} view={resultState} />
        </Spin> : null
      }
    </div>
  )
}

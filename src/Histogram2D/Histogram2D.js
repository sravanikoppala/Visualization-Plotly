import React, { useState } from 'react';
import Controls from '../Display/Control'
import { useForm, Form } from '../Services/FiltersService';
import Histogram2dPlot from './Histogram2dPlot'
import * as HistogramService from './HistogramService';
import HttpRequest from '../Services/HttpRequestService';
import * as moment from 'moment';
import Url from '../Services/Config.json';
import Checkbox from '@material-ui/core/Checkbox';

import { Spin } from 'antd';
import 'antd/dist/antd.css';


const initialValues = {
    startDate: new Date('2020-01-02'),
    endDate: new Date('2020-01-05'),
    xAxis: 'gr_rc_rainrate',
    yAxis: 'preciprate',
    xRange: 10,
    yRange: 10,
    xBin: 0.2,
    yBin: 0.2,
    sensorType: "DPR",
    scanType: "None",
    title: "2D Histogram"
}

const Histogram2D = () => {
    const { values, handleInputChange } = useForm(initialValues);

    let xData = [];
    let yData = [];

    const [xAxisState, setxAxisState] = useState(xData);
    const [yAxisState, setyAxisState] = useState(yData);
    const [loadingState, setLoadingState] = useState(false);
    // const [setLogAxes, setLogAxesState] = useState(false);
    const [alertState, setAlertState] = useState(false);
    const [loadPlotState, setloadPlotState] = useState(false);


    const getData = (values) => {
        setLoadingState(true);
        setloadPlotState(true);
        setAlertState(false);
        const startDate = moment(values.startDate).format("YYYY-MM-DD");
        const endDate = moment(values.endDate).format("YYYY-MM-DD");
        const xAxis = values.xAxis;
        const yAxis = values.yAxis;
        const scanType = values.scanType;
        const sensorType = values.sensorType;
        let queryUrl = Url.Histogram2D.queryUrl;
        let apiUrl = Url.Histogram2D.apiUrl;
        let csvUrl = "";
        if(scanType === "None"){
            queryUrl = queryUrl.concat(xAxis, ",0,", yAxis, ",0", "&columns=", xAxis, ",", yAxis, "&start_time=", startDate, "&end_time=", endDate, "&sensor_like=", sensorType);
        }else{
            queryUrl = queryUrl.concat(xAxis, ",0,", yAxis, ",0", "&columns=", xAxis, ",", yAxis, "&start_time=", startDate, "&end_time=", endDate, "&sensor_like=", sensorType, "&scan_like=", scanType);
        }
        console.log(queryUrl);
        HttpRequest(queryUrl).then(
            response => {
                let queryId = response.data.split('queryId=')[1].split('}')[0];
                apiUrl = apiUrl.concat(queryId);
                console.log(apiUrl);
            }
        );

        let interval = setInterval(() => {
            HttpRequest(apiUrl).then(
                res => {
                    if (res.data.message === undefined) {
                        clearInterval(interval);
                        if (res.data.data.length === 0) {
                            setLoadingState(false);
                            setAlertState(true);
                            setloadPlotState(false);
                        }
                        else {

                            csvUrl = res.data.file_url;
                        }
                    }
                    if (csvUrl !== "" && res.data.data.length !== 0) {
                        HttpRequest(csvUrl).then(resp => {
                            let dataArray = [];
                            dataArray = resp.data.replace(/"/gi, "").split(/,|\n/);
                            xData = [];
                            yData = [];
                            for (let i in dataArray) {
                                if (Number(i) % 2 === 0) {
                                    xData.push(Number(dataArray[i]));
                                } else {
                                    yData.push(Number(dataArray[i]));
                                }
                            }
                            setxAxisState(xData);
                            setyAxisState(yData);
                            setLoadingState(false);
                        });

                    }

                })
        }, 2000);
    }

    const [xAxisName, setxAxisName] = useState("GR RC rainrate (mm/h)");
    const [yAxisName, setyAxisName] = useState("Precip Rate (mm/h)");
    const [checked, setCheckedState] = useState(false);

    return (
        <div>
            <br></br>
            <Form>
                <Controls.DatePicker name="startDate" label="Start Date" value={values.startDate} onChange={handleInputChange} />
                <Controls.DatePicker name="endDate" label="End Date" value={values.endDate} onChange={handleInputChange} />
                <Controls.Select name="xAxis" label="X-Axis" value={values.xAxis} onChange={e => { handleInputChange(e); setxAxisName(e.target.value + " (mm/h)"); }} options={HistogramService.getXaxisList()} ></Controls.Select>
                <Controls.Select name="yAxis" label="Y-Axis" value={values.yAxis} onChange={e => { handleInputChange(e); setyAxisName(e.target.value + " (mm/h)"); }} options={HistogramService.getYaxisList()} ></Controls.Select>
                <Controls.Select name="sensorType" label="Sensor" value={values.sensorType} onChange={handleInputChange} options={HistogramService.getSensorTypeList()} ></Controls.Select>
                <Controls.Select name="scanType" label="Scan" value={values.scanType} onChange={handleInputChange} options={HistogramService.getScanTypeList(values.sensorType)} ></Controls.Select>
                <Controls.Button text="Submit" onClick={e => getData(values)} />
                <div className="advanced-filters">
                    <Checkbox style={{ color: '#6610f2' }} checked={checked} onChange={e => setCheckedState(e.target.checked)} name="checked" /> Show Advanced Filters
                    {
                        checked ?
                            <div>
                                <Controls.TextInput name="xAxisName" label="X-Axis-Label" value={xAxisName} onChange={e => setxAxisName(e.target.value)} />
                                <Controls.TextInput name="yAxisName" label="Y-Axis-Label" value={yAxisName} onChange={e => setyAxisName(e.target.value)} />
                                <Controls.TextInput name="xRange" label="X-Axis-End-Scale" value={values.xRange} onChange={handleInputChange} />
                                <Controls.TextInput name="yRange" label="Y-Axis-End-Scale" value={values.yRange} onChange={handleInputChange} />
                                <br />
                                <Controls.TextInput name="title" label="Title" value={values.title} onChange={handleInputChange} />
                                <Controls.TextInput name="xBin" label="X-Bin" value={values.xBin} onChange={handleInputChange} />
                                <Controls.TextInput name="yBin" label="Y-Bin" value={values.yBin} onChange={handleInputChange} />
                            </div> : null
                    }
                </div>
            </Form>
            {
                alertState ? <Controls.AlertTextLoop /> : null
            }
            {
                loadPlotState ? <Spin tip="Loading..." spinning={loadingState}>
                    <Histogram2dPlot xValue={xAxisState} yValue={yAxisState} xName={xAxisName} yName={yAxisName} xRange={values.xRange} yRange={values.yRange} xBin={values.xBin} yBin={values.yBin} title={values.title} />
                </Spin> : null
            }


        </div>

    );
}

export default Histogram2D;

import React, { useState } from 'react';
import Controls from '../Controls/Control'
import { useForm, Form } from './HistogramFilters';
import Histogram2dPlot from './Histogram2dPlot'
import * as HistogramService from './HistogramService';
import HttpRequest from '../httpRequestService';
import * as moment from 'moment';
import { Spin } from 'antd';
import 'antd/dist/antd.css';

const initialValues = {
    startDate: new Date('2020-01-02'),
    endDate: new Date('2020-01-05'),
    xAxis: 'gr_rc_rainrate',
    yAxis: 'preciprate'
}

const Histogram2D = () => {
    const { values, setValues, handleInputChange } = useForm(initialValues);

    let xData = [];
    let yData = [];
    const [xAxisState, setxAxisState] = useState(xData);
    const [yAxisState, setyAxisState] = useState(yData);
    const [loadingState, setLoadingState] = useState(false);
    const [alertState, setAlertState] = useState(false);
    const [loadPlotState, setloadPlotState] = useState(false);


    const getData = (values) => {
        setLoadingState(true);
        setloadPlotState(true);
        const startDate = moment(values.startDate).format("YYYY-MM-DD");
        const endDate = moment(values.endDate).format("YYYY-MM-DD");
        const xAxis = values.xAxis;
        const yAxis = values.yAxis;
        let queryUrl = 'https://e3x3fqdwla.execute-api.us-east-1.amazonaws.com/test3/?min=';
        let apiUrl = 'https://e3x3fqdwla.execute-api.us-east-1.amazonaws.com/test3/result/?qid=';
        let csvUrl = "";
        queryUrl = queryUrl.concat(xAxis, ",0,", yAxis, ",0", "&columns=", xAxis, ",", yAxis, "&start_time=", startDate, "&end_time=", endDate);
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
    return (
        <div>
            <Form>
                <Controls.DatePicker name="startDate" label="Start Date" value={values.startDate} onChange={handleInputChange} />
                <Controls.DatePicker name="endDate" label="End Date" value={values.endDate} onChange={handleInputChange} />
                <Controls.Select name="xAxis" label="X-Axis" value={values.xAxis} onChange={handleInputChange} options={HistogramService.getXaxisList()} ></Controls.Select>
                <Controls.Select name="yAxis" label="Y-Axis" value={values.yAxis} onChange={handleInputChange} options={HistogramService.getYaxisList()} ></Controls.Select>
                <Controls.Button text="Submit" onClick={e => getData(values)} />
            </Form>
            {
                alertState ? <Controls.AlertTextLoop /> : null
            }
            {
                loadPlotState ? <Spin tip="Loading..." spinning={loadingState}>
                    <Histogram2dPlot xValue={xAxisState} yValue={yAxisState} ></Histogram2dPlot>
                </Spin> : null
            }


        </div>

    );
}

export default Histogram2D;

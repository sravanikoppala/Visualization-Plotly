import React from 'react';
import Plotly from "plotly.js";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);


export default function Histogram2dPlot(props) {
    let x = props.xValue;
    let y = props.yValue;
    return (
        <div>
            <Plot
                data={[
                    {
                        x: x,
                        y: y,
                        histnorm: "percent",
                        mode: "markers",
                        autobinx: false,
                        xbins: {
                            start: 0,
                            end: 10,
                            size: 0.2
                        },
                        autobiny: false,
                        ybins: {
                            start: 0,
                            end: 10,
                            size: 0.2
                        },
                        colorscale:
                            [[0, "#FFFFFF"],
                            [0.01, "#00008B"],
                            [0.2, "#00CCFF"],
                            [0.4, "#b3e8FF"],
                            [0.5, "#00FF00"],
                            [0.7, "#FFFF00"],
                            [0.8, "#FF4500"],
                            [1, "#FF0000"]],
                        type: 'histogram2d',
                        colorbar: {
                            title: {
                                text: '% of samples',
                                font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#7f7f7f'
                                }
                            },
                            tickmode: 'auto',
                        },
                    }
                ]}
                layout={{
                    width: 900, height: 600, title: '2D Histogram',
                    showlegend: true,
                    xaxis: {
                        showline: true,
                        mirror: 'ticks',
                        dtick: 0.5,
                        //tickvals:[ 1 ,2, 3, 4, 5,6, 7,8,9,10],   
                        exponentformat: 'e',
                        showexponent: 'all',
                        //tickmode: 'auto',
                        title: {
                            text: 'GR_RC_rainrate (mm/h)',
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                            }
                        },
                    },
                    yaxis: {
                        ticks: 'outside',
                        showline: true,
                        mirror: 'ticks',
                        dtick: 0.5,
                        title: {
                            text: 'Preciprate(mm/h)',
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                            }
                        }
                    },
                    shapes: [
                        //Line Diagonal  
                        {
                            type: 'line',
                            x0: 0,
                            y0: 0,
                            x1: 10,
                            y1: 10,
                            line: {
                                color: '#000000',
                                width: 1,
                                dash: 'dot'
                            }
                        }
                    ]
                }}
            />
        </div>

    );
}

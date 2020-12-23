import React from 'react';
import Plotly from "plotly.js";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);


export default function Histogram2dPlot(props) {
    return (
        <div>
            <Plot
                data={[
                    {
                        x: props.xValue,
                        y: props.yValue,
                        histnorm: "percent",
                        mode: "markers",
                        autobinx: false,
                        xbins: {
                            start: 0,
                            end: props.xRange,
                            size: props.xBin
                        },
                        autobiny: false,
                        ybins: {
                            start: 0,
                            end: props.yRange,
                            size: props.yBin
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
                    width: 900, height: 600, title: props.title,
                    showlegend: true,
                    xaxis: {
                        showline: true,
                        mirror: 'ticks',
                        // tick0: 1,
                        // dtick: 10,
                        // type: 'log',
                        autorange: true,
                        title: {
                            text: props.xName,
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
                        // tick0: 1,
                        // dtick: 10,
                        // type: 'log',
                        autorange: true,
                        title: {
                            text: props.yName,
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
                            x1: props.xRange,
                            y1: props.yRange,
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

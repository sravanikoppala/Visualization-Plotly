import React from 'react';
import { Slider as MuiSlider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

export default function Slider(props) {
    const { disabled } = props;
    console.log = props;

    const classes = useStyles();
    return (
        <div className={classes.root}>
            {/* <Typography id="discrete-slider" gutterBottom>
                {label}
      </Typography> */}
 {
                        disabled ? <MuiSlider
                        defaultValue={30}
                        valueLabelDisplay="auto"                       
                        marks
                        min="0" max="1" step="0.01"
                        disabled
                    />
                        : <MuiSlider
                        defaultValue={30}
                        valueLabelDisplay="auto"                       
                        marks
                        min="0" max="1" step="0.01"
                        
                    />
                    }
            
        </div>

    )
}
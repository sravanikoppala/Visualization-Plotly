import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@material-ui/core';
export default function Select(props) {
    const {name, label, value, onChange, options} = props;
    return (
        <FormControl variant="outlined">
            <InputLabel> {label} </InputLabel>
            <MuiSelect
                name={name}
                value={value}
                onChange={onChange}
                label={label} >
                    {
                        options.map(
                            item => (<MenuItem key={item.id} value={item.title} >{item.title}</MenuItem>)
                        )
                    }
                    
            </MuiSelect>
        </FormControl>
    )
}

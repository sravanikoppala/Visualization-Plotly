import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function TextInput(props) {
    const {name, label, value, onChange} = props;
    const convToTextEvent = (name, value) => ({
        target: {
            name, value
        }
    });

    return (
        <TextField label={label} variant="outlined" value={value} onChange={e => onChange(convToTextEvent(name, e.target.value))} />
    )
}

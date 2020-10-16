import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function DatePicker(props) {

    const { name, label, value, onChange } = props;
    const convToDateEvent = (name, value) => ({
        target: {
            name, value
        }
    });


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                disableFuture
                openTo="year"
                format="MM/dd/yyyy"
                views={["year", "month", "date"]}
                inputVariant="outlined"
                label={label}
                name={name}                
                value={value}
                onChange={date => onChange(convToDateEvent(name, date))}
            /> 

        </MuiPickersUtilsProvider>
    )
}

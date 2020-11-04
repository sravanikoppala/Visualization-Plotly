import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default function DaterangePicker(props) {

    const { defStartDate, defEndDate, onChange } = props;
    

    return (
        <RangePicker style={{ marginTop: 20 }}
            defaultValue={[moment(defStartDate, dateFormat), moment(defEndDate, dateFormat)]}
            format={dateFormat} onChange={onChange}
        />
    )
}
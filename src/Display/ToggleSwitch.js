import React from 'react';
import { Switch } from 'antd';


export default function ToggleSwitch(props) {
    const { onChange } = props;

    return (
        <Switch defaultChecked size="small" onChange={onChange} />
    )
}

import React from 'react'
import { Alert } from 'antd';
import TextLoop from 'react-text-loop';
import 'antd/dist/antd.css';

export default function AlertTextLoop() {
    return (
        <div style={({ margin: 'auto', marginTop: '10px' })} >
            <Alert
                isOpen="false"
                closable
                type="warning"
                showIcon
                message={
                    <TextLoop mask>
                        <div>No data exists for selected filters</div>
                        <div>Please try a different date or different combination of filters</div>
                    </TextLoop>}
            />
        </div>
    )
}

import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
export default function SelectAntD(props) {
    const { name, label, value, onChange, options } = props;
    const convToEvent = (name, value) => ({
        target: {
            name, value
        }
    });
    return (
        <>
        <Select
            showSearch
            style={{ width: 80, margin: 8 }}
            placeholder={label}
            defaultValue={value}
            optionFilterProp="children"
            onChange={optionValue => onChange(convToEvent(name, optionValue))}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                options.map(
                    item => (<Option key={item.id} value={item.title} >{item.title}</Option>)
                )
            }

        </Select></>
    )
}

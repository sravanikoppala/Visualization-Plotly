import React from 'react';
import { Menu, Dropdown as Drop, Button } from 'antd';



export default function Dropdown(props) {
    const { clickFunction, options } = props;
    
    const menu = (
        <Menu>
            {
                options.map(
                    item => (<Menu.Item key={item.id} onClick={e => clickFunction(item)} >
                        {item.title}
                    </Menu.Item>
                    )
                )
            }
        </Menu>
    );

    return (
        <div>
            <Drop overlay={menu} placement="bottomCenter" arrow>
                <Button> Results </Button>
            </Drop>
        </div>
    )
}
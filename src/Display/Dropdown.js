import React from 'react';
import { Menu, Dropdown as Drop, Button } from 'antd';



export default function Dropdown(props) {
    const { value, options } = props;
    const gett = () => {
        console.log("Hello");
    }
    const menu = (
        <Menu>
            {
                        options.map(
                            item => (<Menu.Item>
                                <a value={gett}>
                                    {item.title}
                        </a>
                            </Menu.Item>
                            )
                        )
                    }
            
        </Menu>
    );

    return (
        <div>
            <Drop overlay={menu} placement="bottomCenter" arrow>
                <Button>Drop</Button>
            </Drop>
        </div>
    )
}
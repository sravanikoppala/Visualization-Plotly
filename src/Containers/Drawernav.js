import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import { IconContext } from 'react-icons';
import { SidebarData } from './Sidebar';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { Link as RouteLink } from 'react-router-dom';
import logo from './CAPRi_logo6.png';
const useStyles = makeStyles({
    list: {
        width: 250,
        marginTop: 20,
    }
});
export default function Drawernav() {
    const classes = useStyles();
    const [sidebar, setSidebar] = useState(false);
    const toggleDrawer = (props) => (event) => {
        setSidebar(!sidebar);
    }
    return (
        <div className="navigation-bar">
            <div className="navbar-content icon">
                <IconContext.Provider value={{ color: '#fff' }}>
                    <div className="bars-icon" onClick={toggleDrawer(true)}>
                        <FaIcons.FaBars />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="navbar-content-title">
                <RouteLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <img className="logo" src={logo} alt="logo" />
                    <span className="title-name" >CAPRi</span>
                </RouteLink>
            </div>
            <Drawer anchor={'left'} open={sidebar} onClick={toggleDrawer(false)} >
                <List className={classes.list}>
                    {SidebarData.map((item, index) => (
                        <RouteLink to={item.path}>
                            <ListItem button key={index}>
                                <ListItemIcon>{item.icon} </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        </RouteLink>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

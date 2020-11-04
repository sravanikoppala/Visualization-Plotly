import React from 'react';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/Public';


export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <HomeIcon/>,
        cName: 'nav-text'
    }, {
        title: '2D-Histogram',
        path: '/Histogram2D',
        icon: <InsertChartIcon />,
        cName: 'nav-text'
    }, {
        title: 'Cesium',
        path: '/Cesium',
        icon: <PublicIcon />,
        cName: 'nav-text'
    }
]
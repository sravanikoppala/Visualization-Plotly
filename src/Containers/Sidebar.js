import React from 'react';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/Public';


export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        key: 1,
        icon: <HomeIcon/>,
        cName: 'nav-text'
    }, {
        title: '2D-Histogram',
        path: '/Histogram2D',
        key: 2,
        icon: <InsertChartIcon />,
        cName: 'nav-text'
    }, {
        title: 'Cesium',
        path: '/CesiumSingle',
        key: 3,
        icon: <PublicIcon />,
        cName: 'nav-text'
     }//, {
    //     title: 'Cesium Single Date',
    //     path: '/CesiumSingle',
    //     key: 4,
    //     icon: <PublicIcon />,
    //     cName: 'nav-text'
    // }
]
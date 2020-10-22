import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as RouteLink } from 'react-router-dom'


export default function Navibar() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <RouteLink to='/Histogram2D'>
                <Navbar.Brand href="">CAPRi</Navbar.Brand>
            </RouteLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <RouteLink to='/Histogram2D'>
                        <li className="navLink">2D-Histogram</li>
                        {/* <Nav.Link>2D-Histogram</Nav.Link> */}
                    </RouteLink>
                    <RouteLink to='/Cesium'>
                        <li className="navLink">Cesium</li>
                    </RouteLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Histogram2D from './Histogram2D/Histogram2D';
import CesiumComponent from './Cesium/CesiumComponent';
import CesiumSingle from './Cesium/CesiumSingleImage';
import Drawernav from './Containers/Drawernav';

function App() {
  return (
    <div className="App">
      <Router>
        <Drawernav />
        <Switch>
          <Route path="/" exact component={Histogram2D} />
          <Route path="/Histogram2D" exact component={Histogram2D} />
          <Route path="/Cesium" exact component={CesiumComponent} />
          <Route path="/CesiumSingle" exact component={CesiumSingle} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;


import React from 'react';
import './App.css';
import Navbar from "./Containers/Navbar";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Histogram2D from './Histogram2D/Histogram2D';
import CesiumComponent from './Cesium/CesiumComponent';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Histogram2D} />
          <Route path="/Histogram2D" exact component={Histogram2D} />
          <Route path="/Cesium" exact component={CesiumComponent} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;


import './App.css';
import Header from './component/layout/Header/Header';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';

function App() {

  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans", "Chilanka"],
      },
    });
  }, [])

  return (
    <div className="App">
    <Router>
      <Header />
      <Routes>
        <Route extact path='/' Component={Home} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
